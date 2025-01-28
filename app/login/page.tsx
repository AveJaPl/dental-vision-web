"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaApple, FaFacebook, FaArrowLeft, FaCheck } from "react-icons/fa";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { login } from "@/lib/sender";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, message, status } = await login({ email, password });
    console.log("Login", { data, message, status });
    if (status === 200) {
      router.push("/dashboard");
    } else {
      setError(message || "Coś poszło nie tak.");
    }

    setLoading(false);
  };

  const handleOAuth = (provider: string) => {
    window.location.href = `http://localhost:3000/auth/${provider}`;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="flex h-screen justify-center px-4">
      <div className="w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center mb-12">
          <Link href="/" className="absolute p-4 left-2">
            <FaArrowLeft className="text-muted-foreground" />
          </Link>
          <h1 className="w-full text-center text-xl font-bold">Login</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center px-4 py-3 bg-input rounded-full border border-border">
            <FiMail className="text-muted-foreground mr-3" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent focus:outline-none text-foreground placeholder-muted-foreground"
            />
            {isValidEmail(email) && <FaCheck className="text-primary" />}
          </div>

          <div className="flex items-center px-4 py-3 bg-input rounded-full border border-border relative">
            <FiLock className="text-muted-foreground mr-3" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent focus:outline-none text-foreground placeholder-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-muted-foreground"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className={`flex ${error ? "justify-between": "justify-end"} items-center px-4`}>
            {/* Display the error message if it exists */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Link href="/forgot-password" className="text-primary text-sm">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold text-center transition ${
              loading ? "opacity-50" : "hover:bg-primary/90"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground mt-6">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-primary font-medium">
            Sign Up
          </Link>
        </div>

        <div className="my-6 text-center text-muted-foreground text-sm">OR</div>

        <div className="space-y-3">
          <button
            onClick={() => handleOAuth("google")}
            className="flex items-center p-4 w-full py-3 border border-border rounded-full bg-input text-foreground hover:bg-secondary/10 transition hover:outline-2 hover:border-primary"
          >
            <FcGoogle className="mr-2 text-lg" />
            <p className="w-full text-muted-foreground text-sm">
              Sign in with Google
            </p>
          </button>

          <button
            onClick={() => handleOAuth("apple")}
            className="flex items-center p-4 justify-center w-full py-3 
            border border-border rounded-full bg-input text-foreground hover:bg-secondary/10 transition hover:outline-2 hover:border-primary"
          >
            <FaApple className="text-black mr-2 text-xl" />
            <p className="w-full text-muted-foreground text-sm">
              Sign in with Apple
            </p>
          </button>

          <button
            onClick={() => handleOAuth("facebook")}
            className="flex items-center p-4 justify-center w-full py-3 
            border border-border rounded-full bg-input text-foreground hover:bg-secondary/10 transition hover:outline-2 hover:border-primary"
          >
            <FaFacebook className="text-blue-600 mr-2 text-lg" />
            <p className="w-full text-muted-foreground text-sm">
              Sign in with Facebook
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
