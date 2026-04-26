import { apiFetch, apiUpload } from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AssociationProfile {
  uid: string;
  name: string;
  slug: string;
  publik_id: string;
  email: string;
  is_staff: boolean;
  uploaded_elections: string;
  completed_elections: string;
  profile_picture?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  new_password?: string;
  confirm_password?: string;
  otp: string;
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

/**
 * Get the authenticated association's profile.
 */
export function getProfile() {
  return apiFetch<{ status: string; data: AssociationProfile }>("/association/profile/");
}

/**
 * Request an OTP to be sent to the authenticated user's email
 * before making profile changes.
 */
export function requestProfileOtp() {
  return apiFetch("/association/profile/request-otp/", { method: "POST" });
}

/**
 * Update the association profile (name and/or password).
 * OTP is always required.
 */
export function updateProfile(payload: UpdateProfilePayload) {
  return apiFetch("/association/profile/update/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Upload/change the association's profile picture.
 * @param file - The image File object from a file input.
 */
export function updateProfilePicture(file: File) {
  const formData = new FormData();
  formData.append("profile_picture", file);
  return apiUpload("/association/profile/picture/", formData, "PATCH");
}
