"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/auth/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <--- kluczowe, aby cookie z JWT zostało zapisane
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // jeśli status != 2xx
        const errorData = await response.json();
        throw new Error(errorData.message || "Błąd logowania");
      }

      // Nie zapisujemy tokena w localStorage, bo jest w HttpOnly cookie
      // Wystarczy np. przekierować użytkownika na stronę po zalogowaniu:
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Logowanie przez OAuth (Google, Facebook, Apple)
  const handleOAuth = (provider: string) => {
    window.location.href = `http://localhost:3000/auth/${provider}`;
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center">Logowanie</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full text-foreground" disabled={loading}>
              {loading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>

          <div className="my-4 text-center text-sm text-gray-500">lub</div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuth("google")}
            >
              Zaloguj przez Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuth("facebook")}
            >
              Zaloguj przez Facebook
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuth("apple")}
            >
              Zaloguj przez Apple
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link href="/register" className="underline">
              Zarejestruj się
            </Link>{" "}
            |{" "}
            <Link href="/forgot-password" className="underline">
              Przypomnij hasło
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
