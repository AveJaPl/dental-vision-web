import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import OpenAI from "openai";
import jwt from "jsonwebtoken";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

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
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch {
      console.log("❌ Nieprawidłowy token.");
      return NextResponse.json(
        { error: "Nieprawidłowy token uwierzytelniający." },
        { status: 401 }
      );
    }

    const { content, images } = await req.json();
    const userId = decoded.userId;
    console.log(`📨 Otrzymano wiadomość od użytkownika ${userId}:`, { content, images });

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

    // Pobranie historii czatu użytkownika
    const chatHistory = await prisma.message.findMany({
      where: { userId },
      orderBy: { timestamp: "asc" },
    });

    // Tworzenie wiadomości do OpenAI
    const openaiMessages = chatHistory.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content || "",
    }));

    openaiMessages.unshift({
      role: "system",
      content:
        "Jesteś asystentem dentystycznym. Odpowiadaj profesjonalnie, pomagaj użytkownikowi, ale nie diagnozuj.",
    });

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
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
    return NextResponse.json(
      { error: "Błąd serwera" },
      { status: 500 }
    );
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    console.log(`📥 Pobieranie historii czatu dla użytkownika ${userId}`);

    const messages = await prisma.message.findMany({
      where: { userId },
      orderBy: { timestamp: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("❌ Błąd pobierania wiadomości:", error);
    return NextResponse.json(
      { error: "Błąd serwera" },
      { status: 500 }
    );
  }
}
