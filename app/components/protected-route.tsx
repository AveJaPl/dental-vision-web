"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("Loading:", loading);
      console.log("isAuthenticated:", isAuthenticated);
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
