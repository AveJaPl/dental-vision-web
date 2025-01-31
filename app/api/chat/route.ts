import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import OpenAI from "openai";
import jwt from "jsonwebtoken";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Typ dla elementu content, który może zawierać tekst lub obraz
type ContentItem =
  | { type: "text"; text: any }
  | { type: "image_url"; image_url: { url: string } };

export async function POST(req: NextRequest) {
  try {
    console.log("🔵 Otrzymano żądanie POST");

    // Pobranie tokena z ciasteczek
    const token = req.cookies.get("token")?.value;
    console.log("🔑 Pobieranie tokena z ciasteczek:", token);

    if (!token) {
      console.log("❌ Brak tokena uwierzytelniającego.");
      return NextResponse.json(
        { error: "Brak tokena uwierzytelniającego." },
        { status: 401 }
      );
    }

    // Weryfikacja użytkownika
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
      console.log("✅ Token poprawny. Użytkownik:", decoded.userId);
    } catch (err) {
      console.log("❌ Nieprawidłowy token:", err);
      return NextResponse.json(
        { error: "Nieprawidłowy token uwierzytelniający." },
        { status: 401 }
      );
    }

    // Odczytanie danych z żądania
    const { content, images } = await req.json();
    console.log("📥 Otrzymano dane:", { content, images });

    if (!content && (!images || images.length === 0)) {
      console.log("❌ Brak treści i obrazów w żądaniu.");
      return NextResponse.json(
        { error: "Brak treści i obrazów." },
        { status: 400 }
      );
    }

    const userId = decoded.userId;

    // Zapis wiadomości użytkownika do bazy
    console.log("💾 Zapisywanie wiadomości użytkownika do bazy...");
    const userMessage = await prisma.message.create({
      data: {
        role: "user",
        content,
        images,
        timestamp: new Date().toISOString(),
        userId,
      },
    });
    console.log("✅ Wiadomość użytkownika zapisana:", userMessage);

    // Tworzymy obiekt wiadomości do OpenAI
    let openaiMessages = [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "Jesteś asystentem medycznym specjalizującym się w analizie zdjęć dentystycznych...",
          },
        ],
      },
      {
        role: "user",
        content: [{ type: "text", text: content }],
      },
    ];

    // Dodanie obrazów do wiadomości OpenAI
    if (images && images.length > 0) {
      console.log(`🖼️ Dodawanie ${images.length} obrazów do wiadomości OpenAI`);
      images.forEach((imageUrl: string) => {
        (openaiMessages[1].content as any).push({
          type: "image_url",
          image_url: { url: imageUrl },
        });
      });
    } else {
      console.log("⚠️ Brak obrazów do przetworzenia.");
    }

    // Pobranie historii czatu użytkownika
    console.log("📜 Pobieranie historii wiadomości użytkownika...");
    const chatHistory = await prisma.message.findMany({
      where: { userId },
      orderBy: { timestamp: "asc" },
    });

    console.log("📚 Historia czatu użytkownika:", chatHistory);

    // Mapowanie historii do formatu OpenAI
    const openaiHistoryMessages = chatHistory.map((msg) => {
      const contentArray: ContentItem[] = [
        { type: "text", text: msg.content || "" },
      ];

      if (msg.images && msg.images.length > 0) {
        msg.images.forEach((imageUrl: string) => {
          contentArray.push({
            type: "image_url",
            image_url: { url: imageUrl },
          });
        });
      }

      return {
        role: msg.role as "user" | "assistant" | "system",
        content: contentArray,
      };
    });

    // Dodajemy wiadomość systemową na początku historii
    openaiHistoryMessages.unshift({
      role: "system",
      content: [
        {
          type: "text",
          text: `Jesteś wirtualnym asystentem dentystycznym i Twoim zadaniem jest pomaganie użytkownikowi w diagnozowaniu problemów stomatologicznych oraz udzielanie wskazówek dotyczących zdrowia jamy ustnej. Twoja rola ogranicza się wyłącznie do kwestii związanych ze zdrowiem zębów, dziąseł i jamy ustnej. Jeśli użytkownik ma jakiekolwiek dolegliwości lub pytania dotyczące tych obszarów, Twoim celem jest dostarczenie mu pomocnych informacji oraz ewentualne zasugerowanie wizyty u stomatologa. Możesz analizować zdjęcia i wskazywać potencjalne problemy, takie jak próchnica, stan zapalny dziąseł, obrzęki i inne nieprawidłowości. Pamiętaj, że Twoje porady mają charakter ogólny i nie zastępują konsultacji lekarskiej. Zachęcaj użytkownika do wizyty w gabinecie stomatologicznym, np. Implant Medical, w celu dokładnej diagnozy i leczenia. Nie udzielaj informacji na tematy niezwiązane z dentystyką.`,
        },
      ],
    });

    console.log("📡 Wysyłanie zapytania do OpenAI...");
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: openaiHistoryMessages as any,
    });

    console.log("🤖 OpenAI odpowiedział:", aiResponse);

    const aiMessage = aiResponse.choices[0]?.message?.content ?? "";
    console.log("📩 Otrzymana odpowiedź AI:", aiMessage);

    // Zapis odpowiedzi AI do bazy
    console.log("💾 Zapisywanie odpowiedzi AI do bazy...");
    const assistantMessage = await prisma.message.create({
      data: {
        role: "assistant",
        content: aiMessage,
        timestamp: new Date().toISOString(),
        userId,
      },
    });
    console.log("✅ Odpowiedź AI zapisana:", assistantMessage);

    // Pobranie zaktualizowanej historii wiadomości
    console.log("📥 Pobieranie zaktualizowanej historii wiadomości...");
    const updatedChatHistory = await prisma.message.findMany({
      where: { userId },
      orderBy: { timestamp: "asc" },
    });

    console.log("✅ Zwracanie odpowiedzi użytkownikowi.");
    return NextResponse.json({ messages: updatedChatHistory });
  } catch (error) {
    console.error("❌ Wystąpił błąd:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
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

    console.log("✅ Historia czatu pobrana:", messages);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("❌ Błąd pobierania wiadomości:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
