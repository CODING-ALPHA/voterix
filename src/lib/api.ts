/**
 * Voterix API Client
 * Base URL is read from NEXT_PUBLIC_API_URL env variable.
 * Automatically attaches JWT Bearer token from localStorage.
 */

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

type ApiErrorPayload = {
  message?: unknown;
  errors?: Record<string, string[]>;
  detail?: unknown;
};

function toApiErrorPayload(value: unknown): ApiErrorPayload {
  if (typeof value === "object" && value !== null) {
    return value as ApiErrorPayload;
  }

  return {};
}

function collectErrorMessages(value: unknown): string[] {
  if (value == null) return [];

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    const errorDetailMatches = Array.from(
      trimmed.matchAll(/ErrorDetail\(string='([^']+)'(?:,\s*code='[^']+')?\)/g)
    )
      .map((match) => match[1]?.trim())
      .filter(Boolean) as string[];

    if (errorDetailMatches.length > 0) {
      return errorDetailMatches;
    }

    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return collectErrorMessages(JSON.parse(trimmed));
      } catch {
        try {
          const normalized = trimmed
            .replace(
              /ErrorDetail\(string='([^']+)'(?:,\s*code='[^']+')?\)/g,
              (_, message: string) => `"${message}"`
            )
            .replace(/'/g, '"');

          return collectErrorMessages(JSON.parse(normalized));
        } catch {
          // fall through and return the original string
        }
      }
    }

    return [trimmed];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectErrorMessages);
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const priorityKeys = ["message", "non_field_errors", "detail", "errors"];

    const prioritized = priorityKeys.flatMap((key) => collectErrorMessages(record[key]));
    const remaining = Object.entries(record)
      .filter(([key]) => !priorityKeys.includes(key))
      .flatMap(([, nestedValue]) => collectErrorMessages(nestedValue));

    return [...prioritized, ...remaining];
  }

  return [String(value)];
}

export function formatApiErrorMessage(
  value: unknown,
  fallback = "Something went wrong"
): string {
  const messages = Array.from(
    new Set(
      collectErrorMessages(value)
        .map((message) => message.trim())
        .filter(Boolean)
    )
  );

  return messages.length > 0 ? messages.join(". ") : fallback;
}

// ─── Token Helpers ────────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

export function saveTokens(tokens: { access: string; refresh: string }) {
  localStorage.setItem("access_token", tokens.access);
  localStorage.setItem("refresh_token", tokens.refresh);
  // Keep cookie in sync for middleware
  document.cookie = `auth_token=${tokens.access}; path=/; max-age=86400; SameSite=Strict`;
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

// ─── API Error ────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

// ─── Core Fetch Helpers ───────────────────────────────────────────────────────

/**
 * JSON request — automatically sets Content-Type and Authorization headers.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // empty body
  }

  if (!res.ok) {
    const errorPayload = toApiErrorPayload(data);

    throw new ApiError(
      res.status,
      formatApiErrorMessage(
        {
          message: errorPayload.message,
          errors: errorPayload.errors,
          detail: errorPayload.detail,
        },
        `HTTP ${res.status}`
      ),
      errorPayload.errors
    );
  }

  return data as T;
}

/**
 * Voter-session JSON request — uses `Authorization: Token <session_token>`.
 */
export async function voterFetch<T = unknown>(
  path: string,
  voterToken: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Token ${voterToken}`,
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // empty body
  }

  if (!res.ok) {
    const errorPayload = toApiErrorPayload(data);

    throw new ApiError(
      res.status,
      formatApiErrorMessage(
        {
          message: errorPayload.message,
          errors: errorPayload.errors,
          detail: errorPayload.detail,
        },
        `HTTP ${res.status}`
      ),
      errorPayload.errors
    );
  }

  return data as T;
}

/**
 * Multipart/form-data upload — do NOT set Content-Type (browser sets boundary).
 */
export async function apiUpload<T = unknown>(
  path: string,
  formData: FormData,
  method: "POST" | "PATCH" | "PUT" = "POST"
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: formData,
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // empty body
  }

  if (!res.ok) {
    const errorPayload = toApiErrorPayload(data);

    throw new ApiError(
      res.status,
      formatApiErrorMessage(
        {
          message: errorPayload.message,
          errors: errorPayload.errors,
          detail: errorPayload.detail,
        },
        `HTTP ${res.status}`
      ),
      errorPayload.errors
    );
  }

  return data as T;
}

/**
 * Centralised error handler — logs to console and redirects on 401.
 */
export async function safeFetch<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        clearTokens();
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }
    throw err;
  }
}
