"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Helper for combining classes
import Image from "next/image";

export default function LandingPage() {
  // Fade-in animation state
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-700 ease-in max-w-xs sm:max-w-md mx-auto",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Header Section */}
      <div className="flex items-center space-y-4 mb-12 mr-4">
        <Image
          src="/logo.png"
          width={124}
          height={124}
          alt="TeethScan AI"
        />
        <h1
          className="text-3xl font-bold tracking-tight text-primary-foreground"
          style={{
            background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--foreground)))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          TeethScan AI
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center space-y-6 max-w-md text-center">
        <h2 className="text-xl font-semibold tracking-tigh">
          Your Journey to Better Health Starts Here
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          Login to explore our features <br></br> and take control of your dental health.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col space-y-4 w-full max-w-md mt-10">
        <Link href="/login">
          <button className="w-full py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition duration-200">
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className="w-full py-3 rounded-full border border-primary text-primary font-medium shadow-md hover:bg-primary/10 transition duration-200">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
