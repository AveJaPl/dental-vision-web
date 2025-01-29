import { prisma } from "@/app/lib/prisma"; // Zakładając, że masz instancję Prisma w lib/prisma.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { content, images } = await request.json();

    // Zapisz wiadomość użytkownika
    const userMessage = await prisma.message.create({
      data: {
        role: "user",
        content,
        images,
        timestamp: new Date().toISOString(),
      },
    });

    // Wywołaj OpenAI (jeśli chcesz, możesz tu dodać more complex logic)
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content }],
    });

    const assistantMessage = await prisma.message.create({
      data: {
        role: "assistant",
        content: response.choices[0].message.content,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({ content: assistantMessage.content });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
