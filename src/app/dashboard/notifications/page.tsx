"use client";

import React, { useState, useEffect } from "react";
import { Star, Calendar, ChevronDown, Loader2 } from "lucide-react";
import { listNotifications, markNotificationAsRead, Notification } from "@/lib/api-client";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await listNotifications();
        setNotifications(response.data || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (uid: string, isRead: boolean) => {
    if (isRead) return; // Already read

    // Optimistic update
    setNotifications(prev => 
      prev.map(n => n.uid === uid ? { ...n, isRead: true } : n)
    );
    
    try {
      await markNotificationAsRead(uid);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Revert if failed
      setNotifications(prev => 
        prev.map(n => n.uid === uid ? { ...n, isRead: false } : n)
      );
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Notification</h1>
        
        <button className="flex items-center gap-2 h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
          <Calendar size={16} className="text-gray-400" />
          <span>Last 30 Days</span>
          <ChevronDown size={14} className="ml-1 text-gray-400" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center p-8">
            <h3 className="text-lg font-bold text-gray-900">No Notification at this time</h3>
          </div>
        ) : (
          /* Notifications List */
          <div className="flex flex-col p-6 md:p-10 space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.uid}
                onClick={() => handleMarkAsRead(notification.uid, notification.is_read)}
                className={`flex items-center gap-4 md:gap-8 p-4 md:px-6 rounded-lg border transition-all cursor-pointer ${
                  notification.is_read 
                    ? "bg-white border-gray-200 hover:bg-gray-50/50" 
                    : "bg-blue-50/30 border-blue-100 shadow-sm"
                }`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 ${notification.is_read ? "text-gray-400" : "text-blue-600"}`}>
                  <Star size={20} strokeWidth={notification.is_read ? 1.5 : 2} fill={notification.is_read ? "none" : "currentColor"} />
                </div>
                
                {/* Sender/Title */}
                <div className="flex-shrink-0 w-20 md:w-32">
                  <span className={`text-sm tracking-wide ${notification.is_read ? "font-medium text-gray-900" : "font-bold text-gray-900"}`}>
                    {notification.title}
                  </span>
                </div>
                
                {/* Message Content */}
                <div className="flex-1 truncate">
                  <span className={`text-sm ${notification.is_read ? "font-medium text-gray-500" : "font-semibold text-gray-900"}`}>
                    {notification.message.includes(":") ? (
                      <>
                        <span className={notification.is_read ? "text-gray-600 font-semibold" : ""}>
                          {notification.message.split(":")[0]}:
                        </span>
                        {notification.message.split(":")[1]}
                      </>
                    ) : (
                      notification.message
                    )}
                  </span>
                </div>
                
                {/* Time */}
                <div className="flex-shrink-0 ml-auto">
                  <span className={`text-sm ${notification.is_read ? "font-medium text-gray-500" : "font-semibold text-gray-700"}`}>
                    {formatTime(notification.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
