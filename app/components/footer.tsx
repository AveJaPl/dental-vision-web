"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

// Import ikon z Lucide
import { Home, BarChart2, Stethoscope, User } from "lucide-react";

export function Footer() {
  useEffect(() => {
    setActiveTab(window.location.pathname.split("/")[1]);
  }, []);
  const [activeTab, setActiveTab] = useState("overview");

  const navItems = [
    { href: "/dashboard", key: "dashboard", Icon: Home },
    { href: "/reports", key: "reports", Icon: BarChart2 },
    { href: "/diagnosis", key: "diagnosis", Icon: Stethoscope },
    { href: "/profile", key: "profile", Icon: User },
  ];

  return (
    <footer className="fixed w-full bottom-0 bg-background border-t shadow-md flex justify-around items-center pb-5 pt-3">
      {navItems.map(({ href, key, Icon }) => (
        <Link
          key={key}
          href={href}
          className="p-2 flex flex-col items-center"
          onClick={() => setActiveTab(key)}
        >
          <Icon
            className={clsx(
              "w-6 h-6 transition-colors duration-300",
              activeTab === key
                ? "text-primary"
                : "text-foreground hover:text-primary"
            )}
          />
        </Link>
      ))}
    </footer>
  );
}
