"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  saveTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getProfile,
  login as apiLogin,
  logout as apiLogout,
  ApiError,
} from "@/lib/api-client";
import type { AssociationProfile } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: AssociationProfile | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<AssociationProfile>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AssociationProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ── Fetch profile from API ──────────────────────────────────────────────────
  const fetchProfile = async (token: string): Promise<AssociationProfile> => {
    try {
      const res = await getProfile();
      setUser(res.data);
      setAccessToken(token);
      return res.data;
    } catch (err) {
      console.error("Auth fetchProfile failed:", err);
      // Token is invalid or expired — clear everything
      clearTokens();
      setUser(null);
      setAccessToken(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Re-hydrate from localStorage on first load ─────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      const stored = getAccessToken();
      if (stored) {
        try {
          await fetchProfile(stored);
        } catch (err) {
          // Re-hydration failed (e.g. expired token), handled by fetchProfile's catch
          console.warn("Silent re-hydration failure:", err);
        }
      } else {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<AssociationProfile> => {
    const res = await apiLogin({ email, password });
    saveTokens(res.data);
    return await fetchProfile(res.data.access);
  };

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      const refresh = getRefreshToken();
      if (refresh) await apiLogout(refresh);
    } catch {
      // Silently ignore logout API errors
    } finally {
      clearTokens();
      setAccessToken(null);
      setUser(null);
      router.push("/login");
    }
  };

  // ── refreshUser (e.g. after profile update) ────────────────────────────────
  const refreshUser = async () => {
    const token = getAccessToken();
    if (token) await fetchProfile(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!accessToken,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
