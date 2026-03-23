import { apiFetch, voterFetch } from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminDashboard {
  total_elections: number;
  ongoing_elections: number;
  completed_elections: number;
  total_voters: number;
  verified_voters: number;
  // The API may return more fields — add as needed.
  [key: string]: any;
}

export interface VoterDashboard {
  voter_uid: string;
  name: string;
  elections: Array<{
    title: string;
    publik_id: string;
    status: string;
    has_voted: boolean;
  }>;
  [key: string]: any;
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

/**
 * 🔒 Admin dashboard — summary stats for the authenticated association.
 * Returns election counts, voter totals, recent activity, etc.
 */
export function getAdminDashboard() {
  return apiFetch<{ status: string; data: AdminDashboard }>("/dashboard/admin/");
}

/**
 * Voter dashboard — election status and voting history for a specific voter.
 * @param voterUid - The voter's UID (obtained after voter login/verification).
 */
export function getVoterDashboard(
  voterUid: string,
  voterToken: string,
  electionUid?: string
) {
  const query = electionUid ? `?election_uid=${encodeURIComponent(electionUid)}` : "";

  return voterFetch<{ status: string; data: VoterDashboard }>(
    `/dashboard/voter/${voterUid}/${query}`,
    voterToken
  );
}
