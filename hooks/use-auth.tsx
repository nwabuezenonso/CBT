"use client";

import type React from "react";

import { useState, useEffect, createContext, useContext } from "react";
import { type User, authService } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: "examiner" | "examinee"
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch (e) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    
    // Listen for immediate user data from login
    const handleUserLoggedIn = (event: CustomEvent) => {
      setUser(event.detail);
      setLoading(false);
    };
    
    window.addEventListener('user-logged-in', handleUserLoggedIn as EventListener);
    initAuth();
    
    return () => {
      window.removeEventListener('user-logged-in', handleUserLoggedIn as EventListener);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    setUser(user);
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: "examiner" | "examinee"
  ) => {
    const user = await authService.register(email, password, name, role);
    setUser(user);
  };

  const logout = async () => {
    console.log("...Logging out")
    await authService.logout();

  
    setUser(null);
    window.location.href = '/auth/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
