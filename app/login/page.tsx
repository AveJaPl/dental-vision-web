"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LoginResponse {
  message?: string;
  token?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) throw new Error(data.message || "Błąd logowania");

      alert("Logowanie udane!");
      // Możesz tutaj zapisać token do localStorage lub zarządzać sesją
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
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
            <Button type="submit" className="w-full" disabled={loading}>
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
