import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lista publicznych ścieżek
const unsignedPaths = ["/login", "/register"];
// const publicPaths = ["/", ...unsignedPaths];
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  console.log("middleware", { token, pathname });

  // Jeśli użytkownik ma token i wchodzi na stronę niezalogowanych → redirect do /dashboard
  if (token && unsignedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Jeśli użytkownik nie ma tokena i wchodzi na stronę chronioną → redirect do /login
  // if (!token && !publicPaths.includes(pathname)) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // W innych przypadkach kontynuujemy
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard"], // Obsługiwane ścieżki
};
