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
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider user={null}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
