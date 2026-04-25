/**
 * Voterix API Client
 * Base URL is read from NEXT_PUBLIC_API_URL env variable.
 * Automatically attaches JWT Bearer token from localStorage.
 */

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || ""}`.replace(/\/+$/, "");

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
  fallback = "Something went wrong. Please try again."
): string {
  const messages = Array.from(
    new Set(
      collectErrorMessages(value)
        .map((message) => message.trim())
        .filter(Boolean)
    )
  );

  // If we have messages, filter out any that look like technical JSON or tracebacks
  const cleanMessages = messages.filter(msg => {
    const isJson = msg.startsWith('{') || msg.startsWith('[');
    const isTraceback = msg.includes('Traceback') || msg.includes('line ') || msg.includes('File "/');
    const isDbError = msg.includes('psycopg2') || msg.includes('column "') || msg.includes('relation "');
    const isGenericHttp = msg.startsWith('HTTP ');
    
    // Final polish on the message string
    let finalMsg = msg;
    if (finalMsg.toLowerCase().includes("already exists")) {
       finalMsg = "This record already exists in the system.";
    }
    
    return !isJson && !isTraceback && !isDbError && !isGenericHttp;
  });

  if (cleanMessages.length > 0) {
    return cleanMessages.join(". ");
  }

  // Handle common status code fallbacks
  if (typeof value === 'object' && value !== null && 'status' in (value as any)) {
    const status = (value as any).status;
    if (status >= 500) return "Server error. Please contact support or try again later.";
    if (status === 413) return "The uploaded file is too large.";
    if (status === 403) return "Access denied. You don't have permission for this.";
    if (status === 404) return "The requested resource was not found.";
  }

  return fallback;
}

// ─── Formatting & Context Utilities ──────────────────────────────────────────

export function getMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  
  // If it's a relative URL from backend API (e.g. /media/images/profile.png)
  let sanitizedUrl = url.startsWith('/') ? url : `/${url}`;
  if (sanitizedUrl.startsWith('/media/media/')) {
    sanitizedUrl = sanitizedUrl.replace('/media/media/', '/media/');
  }
  
  const rootUrl = BASE_URL.split('/api')[0] || BASE_URL;
  return `${rootUrl}${sanitizedUrl}`;
}

// ─── Token Helpers ────────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("access_token");
  if (!token || token === "undefined" || token === "null") return null;
  return token;
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("refresh_token");
  if (!token || token === "undefined" || token === "null") return null;
  return token;
}

export function saveTokens(tokens: { access: string; refresh: string }) {
  if (!tokens?.access || !tokens?.refresh) {
    console.warn("Attempted to save invalid tokens:", tokens);
    return;
  }
  localStorage.setItem("access_token", tokens.access);
  localStorage.setItem("refresh_token", tokens.refresh);
  // Keep cookie in sync for middleware
  document.cookie = `auth_token=${tokens.access}; path=/; max-age=86400; SameSite=Strict`;
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  // Clear the auth_token cookie by setting its expiration to the past
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
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

  const fullPath = `${BASE_URL}/${path.replace(/^\/+/, "")}`;
  const res = await fetch(fullPath, { ...options, headers });

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

  const fullPath = `${BASE_URL}/${path.replace(/^\/+/, "")}`;
  const res = await fetch(fullPath, { ...options, headers });

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

  const fullPath = `${BASE_URL}/${path.replace(/^\/+/, "")}`;
  const res = await fetch(fullPath, {
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
