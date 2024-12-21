"use client";
import Link from "next/link";

export default function Home() {

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl text-center mt-8">Welcome to Next.js</h1>
      <div className="text-center mt-4">
        <Link href="/login" className="text-blue-500">
          Login
        </Link>
      </div>
    </div>
  );
}
