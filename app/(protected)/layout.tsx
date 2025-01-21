import React from "react";
import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full overscroll-none">
      <Header /> {/* Top sticky header */}
      <main className="flex-grow px-6 py-4">{children}</main>
      <Footer /> {/* Bottom sticky footer */}
    </div>
  );
}
