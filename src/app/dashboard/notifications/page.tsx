"use client";

import React, { useState, useEffect } from "react";
import { Star, Calendar, ChevronDown, Loader2, X } from "lucide-react";
import { listNotifications, markNotificationAsRead, Notification } from "@/lib/api-client";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await listNotifications();
        setNotifications(response.data?.notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleNotificationClick = async (notification: Notification) => {
    setSelectedNotification(notification);
    if (notification.is_read) return;

    // Optimistic update
    setNotifications(prev => 
      prev.map(n => n.uid === notification.uid ? { ...n, is_read: true } : n)
    );
    
    try {
      await markNotificationAsRead(notification.uid);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Notifications</h1>
        
        <button className="flex items-center gap-2 h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
          <Calendar size={16} className="text-gray-400" />
          <span>Recent Updates</span>
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
            <h3 className="text-lg font-bold text-gray-900">No Notifications at this time</h3>
          </div>
        ) : (
          /* Notifications List */
          <div className="flex flex-col p-6 md:p-10 space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.uid}
                onClick={() => handleNotificationClick(notification)}
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
                    {notification.message}
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

      {/* Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" onClick={() => setSelectedNotification(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-8 pb-4">
              <h2 className="text-xl font-bold text-gray-900">Notification Detail</h2>
              <button
                onClick={() => setSelectedNotification(null)}
                className="w-10 h-10 flex items-center justify-center bg-[#F0F5FF] text-[#405189] rounded-xl hover:bg-[#E5EEFF] transition-colors"
                aria-label="Close modal"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="px-8 pb-10">
               <div className="bg-[#F8FAFF] border border-[#E8EEFF] rounded-2xl p-6 mb-6">
                  <p className="text-xs font-black text-[#405189] uppercase tracking-widest mb-2">Subject</p>
                  <h3 className="text-lg font-bold text-[#101828] mb-4">{selectedNotification.title}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Received</p>
                  <p className="text-sm font-bold text-slate-600">{formatDate(selectedNotification.created_at)} at {formatTime(selectedNotification.created_at)}</p>
               </div>
               <div className="prose prose-sm max-w-none">
                  <p className="text-base font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedNotification.message}
                  </p>
               </div>
               <div className="mt-8 pt-6 border-t border-gray-100">
                  <button onClick={() => setSelectedNotification(null)} className="w-full h-12 bg-[#405189] text-white rounded-2xl font-bold shadow-lg shadow-[#405189]/10 hover:opacity-95 transition-all active:scale-95">
                     Dismiss Detail
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
