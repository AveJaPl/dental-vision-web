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
    // Pobranie tokena z ciasteczek
    const token = req.cookies.get("token")?.value;
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
    } catch {
      console.log("❌ Nieprawidłowy token.");
      return NextResponse.json(
        { error: "Nieprawidłowy token uwierzytelniający." },
        { status: 401 }
      );
    }

    // Oczekujemy, że w żądaniu są zarówno treść, jak i obrazy
    const { content, images } = await req.json();
    const userId = decoded.userId;
    console.log(`📨 Otrzymano wiadomość od użytkownika ${userId}:`, {
      content,
      images,
    });

    // Zapis wiadomości użytkownika do bazy
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
            text: "Jesteś asystentem medycznym specjalizującym się w szczegółowej analizie zdjęć dentystycznych. Twoim zadaniem jest precyzyjna ocena stanu uzębienia na podstawie dostarczonych zdjęć. Po dokładnym przeanalizowaniu fotografii, możesz wskazać pacjentowi wstępne obserwacje, które mogą wymagać dalszej konsultacji lub zabiegu. Pamiętaj, aby zawsze zachować profesjonalizm i klarowność przekazywanych informacji. Jeśli zauważysz jakiekolwiek oznaki problemów, takich jak ubytki, zmiany przyzębia, stan zapalny, problemy ze szkliwem lub potencjalne problemy z implantami, wskaż pacjentowi konieczność wizyty u specjalisty. Zachęć pacjenta do skonsultowania się z profesjonalnym stomatologiem w przychodni Implant Medical, podając link do strony kliniki w formacie [https://implantmedical.pl/](https://implantmedical.pl/). Przy każdej ocenie przypominaj o możliwości umówienia wizyty, aby pacjent mógł skonsultować swoje potrzeby z lekarzem specjalistą i zaplanować odpowiednie leczenie.",
          },
        ],
      },
      {
        role: "user",
        content: [{ type: "text", text: content }], // Treść wiadomości
      },
    ];

    // Upewnij się, że content jest tablicą
    if (!Array.isArray(openaiMessages[1].content)) {
      openaiMessages[1].content = [{ type: "text", text: content }]; // Jeśli jest łańcuchem, przekształć na tablicę
    }

    // Dodaj zdjęcia
    if (images && images.length > 0) {
      images.forEach((imageUrl: string) => {
        (openaiMessages[1].content as any).push({
          type: "image_url",
          image_url: { url: imageUrl },
        });
      });
    }

    // Pobranie historii czatu użytkownika
    const chatHistory = await prisma.message.findMany({
      where: { userId },
      orderBy: { timestamp: "asc" },
    });

    // Przetwarzamy historię wiadomości i mapujemy zdjęcia, jeśli są
    const openaiHistoryMessages = chatHistory.map((msg) => {
      const contentArray: ContentItem[] = [
        { type: "text", text: msg.content || "" },
      ];

      // Jeśli wiadomość zawiera obrazy, dodajemy je do content
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

    console.log("📚 Historia wiadomości dla OpenAI:", openaiHistoryMessages);

    // Wysłanie zapytania do OpenAI
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: openaiHistoryMessages as any, // Cast to 'any' to make it work with OpenAI API
    });

    const aiMessage = aiResponse.choices[0].message.content ?? "";
    console.log("🤖 OpenAI odpowiedział:", aiMessage);

    // Zapis odpowiedzi AI do bazy
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
    const updatedChatHistory = await prisma.message.findMany({
      where: { userId },
      orderBy: { timestamp: "asc" },
    });

    return NextResponse.json({ messages: updatedChatHistory });
  } catch (error) {
    console.error("❌ Wystąpił błąd:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Brak tokena uwierzytelniającego." },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const userId = decoded.userId;

    console.log(`📥 Pobieranie historii czatu dla użytkownika ${userId}`);

    const messages = await prisma.message.findMany({
      where: { userId },
      orderBy: { timestamp: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("❌ Błąd pobierania wiadomości:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
