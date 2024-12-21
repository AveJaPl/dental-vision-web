// src/(protected)/layout.tsx (ProtectedLayout)
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DentalAssistantSidebar } from "@/app/components/app-sidebar";
import { Header } from "@/app/components/header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <SidebarProvider>
        <DentalAssistantSidebar />
        <div className="flex flex-col w-full">
          <Header />
          <main>{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
