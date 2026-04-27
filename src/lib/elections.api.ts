import { apiFetch, apiUpload, voterFetch } from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Election {
  uid: string;
  title: string;
  publik_id: string;
  start_time: string;
  end_time: string;
  status: "pending" | "ongoing" | "completed";
  date: string;
}

export interface ElectionDetail extends Election {
  description?: string;
  csv_file?: string;
  show_live_results: boolean;
  show_final_results: boolean;
  association: string;
  verification_link: string;
  created_at: string;
  updated_at: string;
}

export interface ElectionCreatePayload {
  title: string;
  start_time: string; // ISO 8601 e.g. "2025-06-01T08:00:00Z"
  end_time: string;
  description?: string;
  show_live_results?: boolean;
  show_final_results?: boolean;
  csv_file?: File;
}

export interface ElectionUpdatePayload {
  title?: string;
  start_time?: string;
  end_time?: string;
  description?: string;
  show_live_results?: boolean;
  show_final_results?: boolean;
  csv_file?: File;
  voter_batch_uids?: string[];
}

export interface ElectionResults {
  uid: string;
  publik_id: string;
  title: string;
  turnout: { total: number; voted: number };
  positions: Array<{
    title: string;
    candidates: Array<{ name: string; votes: number; percent: number }>;
  }>;
}

export interface ElectionVoter {
  voter_uid: string;
  name: string;
  matric_no: string;
  has_voted: boolean;
  reminder_link: string;
}

// ─── List & Detail ────────────────────────────────────────────────────────────

/** List all elections for the authenticated association. */
export function listElections() {
  return apiFetch<Election[]>("/election/");
}

/** Get full details of a specific election. */
export function getElection(publikId: string) {
  return apiFetch<{ status: string; data: ElectionDetail }>(`/election/${publikId}/`);
}

/** 🔓 Public — Get basic meta-data for an election (Login Page). */
export function getPublicElectionDetail(publikId: string, matric?: string) {
  const url = matric 
    ? `/election/public/${publikId}/?matric=${encodeURIComponent(matric)}`
    : `/election/public/${publikId}/`;
    
  return apiFetch<{ 
    status: string; 
    data: { 
      title: string; 
      association_name: string; 
      start_time: string; 
      end_time: string;
      status: string;
      total_eligible_voters: number;
      voter_status?: {
        has_voted: boolean;
        eligibility: string;
        has_pin: boolean;
      }
    } 
  }>(url);
}

// ─── Create / Update / Delete ─────────────────────────────────────────────────

/** Create a new election. Optional CSV attaches a voter list immediately. */
export function createElection(payload: ElectionCreatePayload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("start_time", payload.start_time);
  formData.append("end_time", payload.end_time);
  if (payload.description) formData.append("description", payload.description);
  if (payload.show_live_results !== undefined)
    formData.append("show_live_results", String(payload.show_live_results));
  if (payload.show_final_results !== undefined)
    formData.append("show_final_results", String(payload.show_final_results));
  if (payload.csv_file) formData.append("csv_file", payload.csv_file);

  return apiUpload<{
    status: string;
    data: { id: number; publik_id: string; verification_link: string; import_summary: object };
  }>("/election/create/", formData);
}

/** Update an existing election. All fields are optional. */
export function updateElection(publikId: string, payload: ElectionUpdatePayload) {
  const formData = new FormData();
  if (payload.title) formData.append("title", payload.title);
  if (payload.start_time) formData.append("start_time", payload.start_time);
  if (payload.end_time) formData.append("end_time", payload.end_time);
  if (payload.description) formData.append("description", payload.description);
  if (payload.show_live_results !== undefined)
    formData.append("show_live_results", String(payload.show_live_results));
  if (payload.show_final_results !== undefined)
    formData.append("show_final_results", String(payload.show_final_results));
  if (payload.csv_file) formData.append("csv_file", payload.csv_file);
  if (payload.voter_batch_uids && payload.voter_batch_uids.length > 0) {
    payload.voter_batch_uids.forEach(uid => formData.append("voter_batch_uids", uid));
  }

  return apiUpload(`/election/${publikId}/update/`, formData, "PATCH");
}

/** Delete an election permanently. */
export function deleteElection(publikId: string) {
  return apiFetch(`/election/${publikId}/delete/`, { method: "DELETE" });
}

// ─── Results & Preview ────────────────────────────────────────────────────────

/** 🔓 Public — Get final results with vote counts and percentages. */
export function getElectionResults(publikId: string) {
  return apiFetch<{ status: string; data: ElectionResults }>(`/election/results/${publikId}/`);
}

/** 🔓 Public — Live preview including candidate images (used on ballot page). */
export function getElectionLivePreview(publikId: string) {
  return apiFetch(`/election/live-preview/${publikId}/`);
}

// ─── Voter Management within an Election ──────────────────────────────────────

/** Get all voters linked to a specific election (admin view). */
export function getElectionVoters(publikId: string) {
  return apiFetch<{ status: string; data: ElectionVoter[] }>(`/election/${publikId}/voters/`);
}

/** Link existing voters (by UID) to an election. */
export function addExistingVoters(publikId: string, voterUids: string[]) {
  return apiFetch(`/election/${publikId}/add-existing-voters/`, {
    method: "POST",
    body: JSON.stringify({ voter_uids: voterUids }),
  });
}

/** Mark a voter as verified for a specific election. */
export function verifyElectionVoter(publikId: string, voterUid: string) {
  return apiFetch(`/election/${publikId}/verify-voter/`, {
    method: "POST",
    body: JSON.stringify({ voter_uid: voterUid }),
  });
}

// ─── Election Day ─────────────────────────────────────────────────────────────

/** Real-time check-in monitor for an ongoing election. */
export function getElectionMonitor(assocPublikId: string) {
  return apiFetch<{ status: string; data: ElectionVoter[] }>(
    `/election/election-monitor/${assocPublikId}/`
  );
}

/** Generate secure voting PINs for all voters in the association. */
export function generateVoterPins(assocPublikId: string) {
  return apiFetch(`/election/generate-pins/${assocPublikId}/`, { method: "POST" });
}

// ─── Voter-Facing (Voting Flow) ───────────────────────────────────────────────

/** 🔓 Public — Load voter/election data needed before rendering the ballot. */
export function getVoterLoginData(
  publikId: string,
  credentials: { matric_number: string; pin: string }
) {
  return apiFetch(`/election/voter-login/${publikId}/`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

/**
 * 🔓 Public — Cast a vote.
 * @param voterUid - The voter's unique identifier.
 * @param pin - The voter's 6-digit PIN.
 * @param selections - Map of position_uid → candidate_id (integer).
 */
export function castVote(
  voterUid: string,
  voterToken: string,
  selections: Record<string, number | string>,
  pin: string
) {
  return voterFetch(`/election/cast-vote/${voterUid}/`, voterToken, {
    method: "POST",
    body: JSON.stringify({ selections, pin }),
  });
}
