import { apiFetch } from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthRegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface AuthLoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
  purpose: "signup" | "login";
}

export interface VerifyOtpResponse {
  status: string;
  message?: string;
  errors?: Record<string, string[]>;
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

/**
 * Register a new association account.
 * Response triggers an OTP email.
 */
export function register(payload: AuthRegisterPayload) {
  return apiFetch<{
    status: string;
    message: string;
    data: { user_uid: string };
    errors?: Record<string, string[]>;
  }>(
    "/auth/register/",
    { method: "POST", body: JSON.stringify(payload) }
  );
}

/**
 * Verify the OTP sent to the user's email after registration or login.
 */
export function verifyOtp(payload: VerifyOtpPayload) {
  return apiFetch<VerifyOtpResponse>("/auth/verify-otp/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Login with email + password.
 * Returns { access, refresh } tokens — save them with saveTokens().
 */
export function login(payload: AuthLoginPayload) {
  return apiFetch<{ status: string; message: string; data: AuthTokens }>(
    "/auth/login/",
    { method: "POST", body: JSON.stringify(payload) }
  );
}

/**
 * Logout — blacklists the refresh token on the server.
 */
export function logout(refreshToken: string) {
  return apiFetch("/auth/logout/", {
    method: "POST",
    body: JSON.stringify({ refresh: refreshToken }),
  });
}
