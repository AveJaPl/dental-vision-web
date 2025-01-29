"use client";

import React from "react";
import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import ProtectedRoute from "../components/protected-route";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen w-full overscroll-none">
        <Header /> {/* Top sticky header */}
        <main className="flex-grow px-6 py-4 mt-[80px] mb-[80px]">
          {children}
        </main>
        <Footer /> {/* Bottom sticky footer */}
      </div>
    </ProtectedRoute>
  );
}
