"use client";

import { createContext, useContext } from "react";
import { User } from "../types/User";

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
});

export const AuthProvider = ({ user, children }: { user: User | null; children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={{ user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);