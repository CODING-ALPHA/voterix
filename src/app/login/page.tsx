"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthImageSlider from "@/components/AuthImageSlider";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message || "Login failed. Please check your credentials.");
      } else {
        setFormError("An error occurred during login. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" suppressHydrationWarning>
      {/* Left Side: Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24 bg-white text-zinc-900">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-[#000a33] mb-8">Login</h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {formError && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
              >
                {formError}
              </p>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 letter-spacing-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="example@voterix.com"
                required
                className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-gray-900 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="••••••••"
                required
                className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-gray-900 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-12 font-semibold text-white transition-opacity hover:opacity-90 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                style={{
                  borderRadius: '11.155px',
                  border: '1.394px solid #909090',
                  background: 'linear-gradient(180deg, #3457B4 0%, #4A496A 100%)',
                  boxShadow: '0 1.394px 2.789px 0 rgba(16, 24, 40, 0.05)'
                }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm font-medium">
            Don&apos;t have an Account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden w-1/2 bg-[#000129] lg:flex flex-col justify-center p-16 text-white">
        <AuthImageSlider />
      </div>
    </div>
  );
}
