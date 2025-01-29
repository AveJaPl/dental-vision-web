// app/api/register/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Sprawdzenie, czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 400 }
      );
    }

    // Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzenie nowego użytkownika
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "365d",
    });

    const response = NextResponse.json({ message: "Registered successfully." });
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365, // 365 days
      path: "/",
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
