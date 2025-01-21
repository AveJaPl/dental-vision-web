"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import Link from "next/link";
export function Header() {
  return (
    <header className="fixed top-0 z-10 bg-background shadow-md px-4 py-3 flex items-center justify-between w-full">
      {/* Left Section - Avatar */}
      <div className="flex items-center space-x-3">
        <Link href="/profile">
          <Avatar className={"w-14 h-14 cursor-pointer"}>
            <AvatarImage src="/avatar.png" alt="User Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </Link>
      </div>

      {/* Center Section - Greeting */}
      <div className="flex flex-col items-center text-center">
        <Link href="/profile" className={"cursor-pointer"}>
          <p className="text-xs text-muted-foreground">Dzień dobry!</p>
          <p className="text-lg font-bold text-foreground">Jan Kowalski</p>
        </Link>
      </div>

      {/* Right Section - Action Icon */}
      <div className="flex items-center">
        <Link href="/profile">
          <Bell size={18} className={"cursor-pointer"} />
        </Link>
      </div>
    </header>
  );
}
