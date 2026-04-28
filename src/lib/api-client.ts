/**
 * Voterix API Library — Barrel Export
 *
 * Import everything from a single place:
 *   import { listElections, createElection } from "@/lib/api-client";
 *   import { ApiError, safeFetch } from "@/lib/api-client";
 */

// Core utilities
export {
  apiFetch,
  voterFetch,
  apiUpload,
  safeFetch,
  ApiError,
  formatApiErrorMessage,
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
  saveVoterSession,
  clearVoterSession,
  getVoterToken,
  getCookie,
  getMediaUrl,
} from "./api";

// Auth
export * from "./auth.api";

// Association Profile
export * from "./association.api";

// Elections (CRUD, results, voting flow)
export * from "./elections.api";

// Positions & Candidates
export * from "./positions.api";

// Voters (admin + self-registration)
export * from "./voters.api";

// Dashboard
export * from "./dashboard.api";

// Notifications
export * from "./notifications.api";
