import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAuth } from "./lib/sender";

// Lista publicznych ścieżek
const unsignedPaths = ["/login", "/register"];
const publicPaths = ["/", ...unsignedPaths];
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const { data, message, status } = await checkAuth();

  console.log("Middleware", { data, message, status });
  console.log(data.authenticated);


  // Jeśli użytkownik ma token i wchodzi na stronę niezalogowanych → redirect do /dashboard
  if (data?.authenticated && unsignedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Jeśli użytkownik nie ma tokena i wchodzi na stronę chronioną → redirect do /login
  if (!data?.authenticated && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // W innych przypadkach kontynuujemy
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard",
    "/profile",
    "/diagnosis",
    "/chat",
  ],
};
