import { apiFetch, apiUpload } from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Voter {
  uid: string;
  name: string;
  matric_no: string;
  email?: string;
  whatsapp_number?: string;
  status: string;
  enquiry_link?: string;
}

export interface VoterBatch {
  uid: string;
  name: string;
  created_at: string;
  voter_count: number;
}

export interface CreateVoterPayload {
  first_name: string;
  last_name: string;
  matric_number: string;
  email?: string;
  whatsapp_number?: string;
  batch?: string;
}

export interface CsvUploadResult {
  created_count: number;
  errors: Array<{ row: number; error: string }>;
}

export interface VoterOtpResponse {
  status: string;
  message?: string;
  errors?: Record<string, string[]>;
  data?: Record<string, unknown>;
}

// ─── Admin Voter Management ───────────────────────────────────────────────────

/** Manually create a single voter record. */
export function createVoter(payload: CreateVoterPayload) {
  return apiFetch<{ status: string; data: Voter }>("/voters/manual-create/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** List all voters registered to an association. */
export function listVoters(assocPublikId: string) {
  return apiFetch<{ status: string; data: Voter[] }>(`/voters/list/${assocPublikId}/`);
}

/** Update an existing voter's details. */
export function updateVoter(
  voterUid: string,
  payload: Partial<CreateVoterPayload> & { status?: string }
) {
  return apiFetch(`/voters/${voterUid}/update/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/** Permanently delete a voter. */
export function deleteVoter(voterUid: string) {
  return apiFetch(`/voters/${voterUid}/delete/`, { method: "DELETE" });
}

/** Manually mark a voter as verified (bypass OTP flow). */
export function manuallyVerifyVoter(voterUid: string) {
  return apiFetch(`/voters/verify/${voterUid}/manual/`, { method: "PATCH" });
}

/** Send a WhatsApp reminder to a specific voter for an election. */
export function sendWhatsAppReminder(electionPublikId: string, voterUid: string) {
  return apiFetch(`/voters/remind/${electionPublikId}/${voterUid}/`, { method: "POST" });
}

/**
 * Upload a CSV file to bulk-import voters.
 * @param assocPublikId - The association's publik_id.
 * @param csvFile - The .csv File object from a file input.
 * @param title - Optional label for this batch.
 */
export function uploadVotersCsv(assocPublikId: string, csvFile: File, title?: string) {
  const formData = new FormData();
  formData.append("csv_file", csvFile);
  if (title) formData.append("title", title);

  return apiUpload<{ status: string; data: CsvUploadResult }>(
    `/voters/upload-csv/${assocPublikId}/`,
    formData
  );
}

/**
 * Monitor voter registration status for an association.
 * Returns each voter with their verification status and any enquiry links.
 */
export function getRegistrationMonitor(assocPublikId: string) {
  return apiFetch<{ status: string; data: Voter[] }>(
    `/voters/registration-monitor/?association_publik_id=${assocPublikId}`
  );
}

// ─── Voter Batches ────────────────────────────────────────────────────────────

/** List all uploaded voter batches for an association. */
export function listVoterBatches(assocPublikId: string) {
  return apiFetch<{ status: string; data: VoterBatch[] }>(
    `/voters/batches/${assocPublikId}/`
  );
}

/** Get full detail for a single voter batch (includes individual voters). */
export function getVoterBatchDetail(batchUid: string) {
  return apiFetch<{ status: string; data: VoterBatch & { voters: Voter[] } }>(
    `/voters/batches/detail/${batchUid}/`
  );
}

// ─── Voter Self-Registration (🔓 Public) ──────────────────────────────────────

/**
 * Step 1 — Voter submits their details to receive a verification OTP.
 */
export function voterRequestOtp(
  assocPublikId: string,
  payload: {
    name: string;
    matric_no: string;
    email: string;
    whatsapp_number: string;
  }
) {
  return apiFetch<VoterOtpResponse>(`/voters/request-otp/${assocPublikId}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Step 2 — Voter confirms their identity with the OTP they received.
 */
export function voterVerifyOtp(matric_no: string, otp: string) {
  return apiFetch<VoterOtpResponse>("/voters/verify-otp/", {
    method: "POST",
    body: JSON.stringify({ matric_no, otp }),
  });
}
