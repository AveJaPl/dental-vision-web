"use client";

import React, { useEffect } from "react";
import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import { checkAuth } from "@/lib/sender";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const { data } = await checkAuth();
      if (!data.authenticated) {
        router.push("/login");
      }
    };

    verifyAuth(); // Wywołanie funkcji asynchronicznej
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen w-full overscroll-none">
      <Header /> {/* Top sticky header */}
      <main className="flex-grow px-6 py-4 mt-[80px] mb-[80px]">
        {children}
      </main>
      <Footer /> {/* Bottom sticky footer */}
    </div>
  );
}
