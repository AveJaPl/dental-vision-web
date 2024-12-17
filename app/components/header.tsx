import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="flex justify-between items-center px-4 py-2 border-b">
      <SidebarTrigger>
        <button className="p-2 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </SidebarTrigger>

      {/* Środkowa część - Nowe zakładki */}
      <nav className="flex space-x-6">
        <a href="/overview" className="text-sm font-medium">
          Overview
        </a>
        <a href="/reports" className="text-sm font-medium">
          Reports
        </a>
        <a href="/analytics" className="text-sm font-medium">
          Analytics
        </a>
        <a href="/support" className="text-sm font-medium">
          Support
        </a>
      </nav>
    </header>
  );
}
