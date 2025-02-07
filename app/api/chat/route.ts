import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import OpenAI from "openai";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const suggestionResponseSchema = z.object({
  suggestion1: z.string(),
  suggestion2: z.string(),
  suggestion3: z.string(),
});

const SYSTEM_PROMPT = `Jesteś wirtualnym asystentem dentystycznym. Twoje zadania:
1. Analizuj pytania i zdjęcia dotyczące zdrowia jamy ustnej.
2. Udzielaj profesjonalnych, ale prostych i zrozumiałych porad.
3. Odpowiadaj maksymalnie w 3-4 zdaniach, jedyne wyjątki to pytania o szczegóły.
4. Jeśli użytkownik nie poda wystarczających informacji, zadawaj precyzyjne pytania pomocnicze.
5. Zawsze kończ odpowiedź zachętą do wizyty u stomatologa Implant Medical.
6. Ignoruj pytania niezwiązane ze stomatologią i przekierowuj rozmowę na temat zdrowia jamy ustnej.`;

function createUserContent(
  text: string,
  images?: string[]
): OpenAI.ChatCompletionContentPart[] {
  const content: OpenAI.ChatCompletionContentPart[] = [{ type: "text", text }];

  images?.forEach((imageUrl: string) => {
    content.push({
      type: "image_url",
      image_url: { url: imageUrl },
    });
  });

  return content;
}

export async function POST(req: NextRequest) {
  try {
    console.log("🔵 [POST] Rozpoczęcie żądania");

    // Weryfikacja tokenu
    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.log("❌ Brak tokenu");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    console.log("✅ Użytkownik:", decoded.userId.slice(0, 6));

    // Odczytanie danych z żądania
    // Parsowanie danych
    const { content, images } = await req.json();
    console.log("📥 Dane:", {
      content: content?.slice(0, 50) + (content?.length > 50 ? "..." : ""),
      images: images?.length || 0,
    });

    // Pobranie historii czatu użytkownika ostatnie 10 wiadomości
    console.log("📜 Pobieranie historii wiadomości...");

    let existingMessages = await prisma.message.findMany({
      where: { userId: decoded.userId },
      orderBy: { timestamp: "desc" },
      take: 10,
    });

    existingMessages = existingMessages.reverse();
    console.log("📜 Liczba wiadomości:", existingMessages.length);
    console.log("🔍 Historia: ", JSON.stringify(existingMessages, null, 4));

    const userMessageData = {
      role: "user",
      content,
      images,
      timestamp: new Date().toISOString(),
      userId: decoded.userId,
    };

    // Tworzymy obiekt wiadomości do OpenAI
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...existingMessages.map((msg): OpenAI.ChatCompletionMessageParam => {
        if (msg.role === "user") {
          return {
            role: "user",
            content: createUserContent(msg.content || "", msg.images),
          };
        }
        return {
          role: "assistant",
          content: msg.content || "",
        };
      }),
      {
        role: "user",
        content: createUserContent(content, images),
      },
    ];

    // Wywołanie AI
    console.log("📡 Wywołanie OpenAI...");
    const start = Date.now();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });
    console.log(`⏱️ Odpowiedź po ${Date.now() - start}ms`);

    // Przetwarzanie odpowiedzi
    const aiMessage = response.choices[0].message;
    console.log("🤖 Odpowiedź:", aiMessage.content?.slice(0, 100) + "...");

    // 5. Zapisz obie wiadomości w jednej transakcji
    const [userMessage, assistantMessage] = await prisma.$transaction([
      prisma.message.create({ data: userMessageData }),
      prisma.message.create({
        data: {
          role: "assistant",
          content: aiMessage.content || "",
          timestamp: new Date().toISOString(),
          userId: decoded.userId,
        },
      }),
    ]);
    console.log(
      "💾 Jednoczesne zapisywanie wiadomości użytkownika i asystenta..."
    );
    console.log(
      "✅ ID wiadomości:",
      userMessage.id,
      "\nID wiadomości asystenta:",
      assistantMessage.id
    );

    const fullHistory = [...existingMessages, userMessage, assistantMessage];

    console.log("💡 Generowanie sugestii...");
    const suggestionResponse = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Jesteś asystentem, który generuje gotowe odpowiedzi użytkownika, które może on kliknąć, aby kontynuować rozmowę. Sugestie powinny być krótkie i zgodne z kontekstem rozmowy.",
        },
        {
          role: "user",
          content: `Na podstawie tej konwersacji wygeneruj sugestie: ${fullHistory
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join("\n")}`,
        },
      ],
      response_format: zodResponseFormat(
        suggestionResponseSchema,
        "suggestion"
      ),
    });

    const suggestions = suggestionResponse.choices[0].message.parsed;

    return NextResponse.json({
      messages: fullHistory,
      suggestions,
    });
  } catch (error) {
    console.error("❌ Krytyczny błąd:", error);
    return NextResponse.json(
      { error: "Wewnętrzny błąd serwera" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log("🔵 Otrzymano żądanie GET");

    const token = req.cookies.get("token")?.value;
    console.log("🔑 Pobieranie tokena:", token);

    if (!token) {
      console.log("❌ Brak tokena uwierzytelniającego.");
      return NextResponse.json(
        { error: "Brak tokena uwierzytelniającego." },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    console.log("✅ Token poprawny. Użytkownik:", decoded.userId);

    console.log(
      `📥 Pobieranie historii czatu dla użytkownika ${decoded.userId}`
    );
    const messages = await prisma.message.findMany({
      where: { userId: decoded.userId },
      orderBy: { timestamp: "asc" },
    });

    // console.log("✅ Historia czatu pobrana:", messages);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("❌ Błąd pobierania wiadomości:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
