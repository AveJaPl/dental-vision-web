import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully." });
    response.cookies.set("token", "", {
      maxAge: 0,
      httpOnly: true,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
