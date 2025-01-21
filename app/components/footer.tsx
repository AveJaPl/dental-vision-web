"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

// Import ikon z Lucide
import { Home, BarChart2, Stethoscope, User } from "lucide-react";

export function Footer() {
  const pathname = usePathname(); // Pobiera aktualną ścieżkę z routera Next.js

  const navItems = [
    { href: "/dashboard", key: "dashboard", Icon: Home },
    { href: "/reports", key: "reports", Icon: BarChart2 },
    { href: "/diagnosis", key: "diagnosis", Icon: Stethoscope },
    { href: "/profile", key: "profile", Icon: User },
  ];

  return (
    <footer className="fixed w-full bottom-0 bg-background border-t shadow-md flex justify-around items-center pb-5 pt-3">
      {navItems.map(({ href, key, Icon }) => (
        <Link key={key} href={href} className="p-2 flex flex-col items-center">
          <Icon
            className={clsx(
              "w-6 h-6 transition-colors duration-300",
              pathname.startsWith(href)
                ? "text-primary"
                : "text-foreground hover:text-primary"
            )}
          />
        </Link>
      ))}
    </footer>
  );
}
