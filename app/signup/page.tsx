"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { register } from "@/lib/sender";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, message, status } = await register({ name, email, password });

    console.log("Register", { data, message, status });
    if (status === 201) {
      router.push("/dashboard");
    } else {
      setError(message || "Coś poszło nie tak.");
    }

    setLoading(false);
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
          <h1 className="w-full text-center text-xl font-bold">Sign Up</h1>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Pole Name */}
          <div className="flex items-center px-4 py-3 bg-input rounded-full border border-border relative">
            {name.length > 0 ? (
              <FiUser className="text-primary mr-3" />
            ) : (
              <FiUser className="text-muted-foreground mr-3" />
            )}
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-transparent focus:outline-none text-foreground placeholder-muted-foreground"
            />
          </div>

          {/* Pole Email */}
          <div className="flex items-center px-4 py-3 bg-input rounded-full border border-border relative">
            {isValidEmail(email) ? (
              <FiMail className="text-primary mr-3" />
            ) : (
              <FiMail className="text-muted-foreground mr-3" />
            )}
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

          {/* Pole Password */}
          <div className="flex items-center px-4 py-3 bg-input rounded-full border border-border relative">
            {password.length > 0 ? (
              <FiLock className="text-primary mr-3" />
            ) : (
              <FiLock className="text-muted-foreground mr-3" />
            )}
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

          {/* Komunikat błędu (jeśli istnieje) */}
          <p className="text-red-500 text-sm">{error}&nbsp;</p>

          {/* Checkbox */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="terms" name="terms" value="terms" />
            <label htmlFor="terms" className="text-muted-foreground text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Przycisk Sign Up */}
          <button
            type="submit"
            className={`w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold text-center transition ${
              loading ? "opacity-50" : "hover:bg-primary/90"
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {/* Already have an account? */}
        <div className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
