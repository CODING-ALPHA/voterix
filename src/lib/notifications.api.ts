import { apiFetch } from "./api";

export interface Notification {
  uid: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationResponse {
  status: string;
  data: {
    notifications: Notification[];
    pagination: {
      total_count: number;
      total_pages: number;
      current_page: number;
      page_size: number;
    };
  };
}

export function listNotifications(page = 1, pageSize = 10) {
  return apiFetch<NotificationResponse>(`/auth/notifications/?page=${page}&page_size=${pageSize}`);
}

export function markNotificationAsRead(uid: string) {
  return apiFetch<{ status: string; message: string }>(`/auth/notifications/${uid}/mark-read/`, { method: "POST" });
}

export function markAllNotificationsAsRead() {
  return apiFetch<{ status: string; message: string }>("/auth/notifications/mark-all-read/", { method: "POST" });
}
