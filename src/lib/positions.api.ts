import { apiFetch, apiUpload } from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Position {
  uid: string;
  title: string;
  description?: string;
}

export interface Candidate {
  uid: string;
  name: string;
  bio?: string;
  image?: string;
  vote_count?: number;
}

// ─── Positions ────────────────────────────────────────────────────────────────

/** List all positions for a given election. */
export function listPositions(electionPublikId: string) {
  return apiFetch<{ status: string; data: Position[] }>(
    `/election/${electionPublikId}/positions/`
  );
}

/** Create a new position inside an election. */
export function createPosition(
  electionPublikId: string,
  payload: { title: string; description?: string }
) {
  return apiFetch<{ status: string; data: Position }>(
    `/election/${electionPublikId}/positions/create/`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

/** Get a single position by its UID. */
export function getPosition(positionUid: string) {
  return apiFetch<{ status: string; data: Position }>(
    `/election/positions/${positionUid}/`
  );
}

/** Update a position's title or description. */
export function updatePosition(
  positionUid: string,
  payload: { title?: string; description?: string }
) {
  return apiFetch(`/election/positions/${positionUid}/update/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/** Delete a position (and all its candidates). */
export function deletePosition(positionUid: string) {
  return apiFetch(`/election/positions/${positionUid}/delete/`, { method: "DELETE" });
}

// ─── Candidates ───────────────────────────────────────────────────────────────

/** List all candidates for a given position. */
export function listCandidates(positionId: string) {
  return apiFetch<{ status: string; data: Candidate[] }>(
    `/election/positions/${positionId}/candidates/`
  );
}

/**
 * Create a candidate for a position.
 * @param image - Optional photo file.
 */
export function createCandidate(
  positionId: string,
  payload: { name: string; bio?: string; image?: File }
) {
  const formData = new FormData();
  formData.append("name", payload.name);
  if (payload.bio) formData.append("bio", payload.bio);
  if (payload.image) formData.append("image", payload.image);

  return apiUpload<{ status: string; data: Candidate }>(
    `/election/positions/${positionId}/candidates/create/`,
    formData
  );
}

/** Get a single candidate by UID. */
export function getCandidate(candidateUid: string) {
  return apiFetch<{ status: string; data: Candidate }>(
    `/election/candidates/${candidateUid}/`
  );
}

/** Update a candidate — all fields optional. */
export function updateCandidate(
  candidateUid: string,
  payload: { name?: string; bio?: string; image?: File }
) {
  const formData = new FormData();
  if (payload.name) formData.append("name", payload.name);
  if (payload.bio) formData.append("bio", payload.bio);
  if (payload.image) formData.append("image", payload.image);

  return apiUpload(`/election/candidates/${candidateUid}/update/`, formData, "PATCH");
}

/** Delete a candidate. */
export function deleteCandidate(candidateUid: string) {
  return apiFetch(`/election/candidates/${candidateUid}/delete/`, { method: "DELETE" });
}
