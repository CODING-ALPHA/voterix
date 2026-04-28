/**
 * Voterix API Client
 * Base URL is read from NEXT_PUBLIC_API_URL env variable.
 * Automatically attaches JWT Bearer token from Cookies.
 */

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || ""}`.replace(/\/+$/, "");

type ApiErrorPayload = {
  success?: boolean;
  message?: unknown;
  errors?: Record<string, string[]>;
  detail?: unknown;
  error_code?: string;
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

// ─── Cookie Helpers ───────────────────────────────────────────────────────────

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, maxAge: number = 86400) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

// ─── Token Helpers ────────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return getCookie("auth_token");
}

export function getRefreshToken(): string | null {
  return getCookie("refresh_token");
}

export function saveTokens(tokens: { access: string; refresh: string }) {
  if (!tokens?.access || !tokens?.refresh) {
    console.warn("Attempted to save invalid tokens:", tokens);
    return;
  }
  setCookie("auth_token", tokens.access, 86400); // 1 day
  setCookie("refresh_token", tokens.refresh, 604800); // 7 days
}

export function clearTokens() {
  deleteCookie("auth_token");
  deleteCookie("refresh_token");
}

// ─── Voter Session Helpers ─────────────────────────────────────────────────────

export function getVoterToken(): string | null {
  return getCookie("voter_session_token");
}

export function saveVoterSession(data: { token: string; uid: string; name: string; matric: string }) {
  setCookie("voter_session_token", data.token, 86400);
  setCookie("voter_uid", data.uid, 86400);
  setCookie("voter_name", data.name, 86400);
  setCookie("voter_matric", data.matric, 86400);
}

export function clearVoterSession() {
  deleteCookie("voter_session_token");
  deleteCookie("voter_uid");
  deleteCookie("voter_name");
  deleteCookie("voter_matric");
}

// ─── API Error ────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  errorCode?: string;
  requestId?: string;

  constructor(
    status: number,
    message: string,
    errors?: Record<string, string[]>,
    errorCode?: string,
    requestId?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.errorCode = errorCode;
    this.requestId = requestId;
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

  let token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const fullPath = `${BASE_URL}/${path.replace(/^\/+/, "")}`;
  
  let res: Response;
  try {
    res = await fetch(fullPath, { ...options, headers });
  } catch (err) {
    // Handle Network Level Errors (Offline, CORS, DNS)
    throw new ApiError(0, "Unable to connect to the server. Please check your internet connection.", undefined, "NETWORK_ERROR");
  }

  const requestId = res.headers.get("X-Request-ID") || undefined;

  // Handle Token Refresh (401 Unauthorized)
  if (res.status === 401 && getRefreshToken() && !path.includes("auth/token/refresh")) {
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: getRefreshToken() }),
      });

      if (refreshRes.ok) {
        const tokens = await refreshRes.json();
        saveTokens({ access: tokens.access, refresh: getRefreshToken() || "" });

        // Retry the original request with the new token
        token = tokens.access;
        headers["Authorization"] = `Bearer ${token}`;
        res = await fetch(fullPath, { ...options, headers });
      } else {
        // Refresh failed, clear tokens and redirect to login
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login?session_expired=1";
        }
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
    }
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // empty body
  }

  if (!res.ok || (data && data.success === false)) {
    const errorPayload = toApiErrorPayload(data);

    throw new ApiError(
      res.status,
      formatApiErrorMessage(
        {
          message: errorPayload.message,
          errors: errorPayload.errors,
          detail: errorPayload.detail,
        },
        `Error ${res.status || "Unknown"}`
      ),
      errorPayload.errors,
      errorPayload.error_code,
      requestId
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
  
  let res: Response;
  try {
    res = await fetch(fullPath, { ...options, headers });
  } catch (err) {
    throw new ApiError(0, "Unable to connect to the server.", undefined, "NETWORK_ERROR");
  }

  const requestId = res.headers.get("X-Request-ID") || undefined;

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // empty body
  }

  if (!res.ok || (data && data.success === false)) {
    const errorPayload = toApiErrorPayload(data);

    throw new ApiError(
      res.status,
      formatApiErrorMessage(
        {
          message: errorPayload.message,
          errors: errorPayload.errors,
          detail: errorPayload.detail,
        },
        `Error ${res.status || "Unknown"}`
      ),
      errorPayload.errors,
      errorPayload.error_code,
      requestId
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
  
  let res: Response;
  try {
    res = await fetch(fullPath, {
      method,
      headers,
      body: formData,
    });
  } catch (err) {
    throw new ApiError(0, "Network error during upload.", undefined, "NETWORK_ERROR");
  }

  const requestId = res.headers.get("X-Request-ID") || undefined;

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // empty body
  }

  if (!res.ok || (data && data.success === false)) {
    const errorPayload = toApiErrorPayload(data);

    throw new ApiError(
      res.status,
      formatApiErrorMessage(
        {
          message: errorPayload.message,
          errors: errorPayload.errors,
          detail: errorPayload.detail,
        },
        `Upload Error ${res.status || "Unknown"}`
      ),
      errorPayload.errors,
      errorPayload.error_code,
      requestId
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
