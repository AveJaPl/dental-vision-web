// components/Logout.tsx
"use client";

import * as React from "react";
import { LogOut } from "lucide-react"; // Ikona wylogowania
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Dostosuj ścieżkę importu w zależności od struktury projektu

const Logout: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    // Usunięcie ciasteczka 'token'
    try {
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-12 w-36 flex items-center justify-center p-2"
      onClick={() => handleLogout()}
    >
      <LogOut className="w-6 h-6" />{" "}
      {/* Dostosuj rozmiar ikony według potrzeb */}
      <span className="">Logout</span>
    </Button>
  );
};

export default Logout;
