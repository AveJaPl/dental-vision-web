// src/layout.tsx (RootLayout)
import React from "react";
import { ThemeProvider } from "@/app/components/theme-provider";
import { AuthProvider } from "@/app/context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "Public Layout",
  description: "Strony publiczne, dostępne dla niezalogowanych użytkowników.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        {/* Specjalne metatagi dla iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider user={null}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
