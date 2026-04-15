import { apiFetch } from "./api";

export interface Notification {
  uid: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function listNotifications() {
  return apiFetch<{ status: string; data: Notification[] }>("/auth/notifications/");
}

export function markNotificationAsRead(uid: string) {
  return apiFetch(`/auth/notifications/${uid}/mark-read/`, { method: "POST" });
}

export function markAllNotificationsAsRead() {
  return apiFetch("/auth/notifications/mark-all-read/", { method: "POST" });
}
