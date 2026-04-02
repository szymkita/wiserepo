"use client";

import { useState, useEffect, useCallback } from "react";
import type { AuthUser } from "../model/auth.types";
import { findUserByEmail } from "../model/auth.mock";

const AUTH_KEY = "wisegroup_auth_user";

let cachedUser: AuthUser | null | undefined;

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  if (cachedUser !== undefined) return cachedUser;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    cachedUser = stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    cachedUser = null;
  }
  return cachedUser;
}

function setStoredUser(user: AuthUser | null) {
  cachedUser = user;
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string }> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const found = findUserByEmail(email);
      if (!found) {
        return { success: false, error: "Nie znaleziono użytkownika z tym adresem email" };
      }
      setStoredUser(found);
      setUser(found);
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    setStoredUser(null);
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
}
