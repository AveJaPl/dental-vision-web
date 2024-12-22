"use client"

import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import clsx from "clsx"; // Użycie clsx do dynamicznego przypisywania klas
import Link from "next/link";

export function Header() {
  const [activeTab, setActiveTab] = useState("overview");

  const navItems = [
    { href: "/dashboard", label: "Overview", key: "overview" },
    { href: "/reports", label: "Reports", key: "reports" },
    { href: "/diagnosis", label: "Diagnosis", key: "diagnosis" },
  ];

  return (
    <header className="relative flex items-center px-4 py-2 border-b">
      {/* SidebarTrigger po lewej stronie */}
      <div className="mr-auto">
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
      </div>

      {/* Środkowa część - Nowe zakładki */}
      <nav className="absolute left-1/2 transform -translate-x-1/2 flex justify-around w-3/5 items-center space-x-4">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={clsx(
              "text-sm font-medium px-3 py-2 rounded-md",
              activeTab === item.key
                ? "bg-primary text-white" // Klasa dla aktywnego elementu
                : "hover:bg-primary/10"
            )}
            onClick={() => setActiveTab(item.key)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
