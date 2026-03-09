"use client";

import React, { useState } from "react";
import { Star, Calendar, ChevronDown } from "lucide-react";

export default function NotificationsPage() {
  // Toggle this state to see the empty view
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Voterix", message: "SUCCESSFUL: You have successfully created an Election. Please click on the link below to c...", time: "5:00 PM", isRead: true },
    { id: 2, title: "Voterix", message: "SUCCESSFUL: You have successfully created an Election. Please click on the link below to c...", time: "5:00 PM", isRead: false },
    { id: 3, title: "Voterix", message: "SUCCESSFUL: You have successfully created an Election. Please click on the link below to c...", time: "5:00 PM", isRead: true },
    { id: 4, title: "Voterix", message: "SUCCESSFUL: You have successfully created an Election. Please click on the link below to c...", time: "5:00 PM", isRead: true },
    { id: 5, title: "Voterix", message: "SUCCESSFUL: You have successfully created an Election. Please click on the link below to c...", time: "5:00 PM", isRead: true },
    { id: 6, title: "Voterix", message: "SUCCESSFUL: You have successfully created an Election. Please click on the link below to c...", time: "5:00 PM", isRead: true },
    { id: 7, title: "Voterix", message: "SUCCESSFUL: You have successfully created an Election. Please click on the link below to c...", time: "5:00 PM", isRead: true },
    { id: 8, title: "Voterix", message: "SUCCESSFUL: You have successfully created an Election. Please click on the link below to c...", time: "5:00 PM", isRead: true },
    { id: 9, title: "Voterix", message: "SUCCESSFUL: You have successfully created an Election. Please click on the link below to c...", time: "5:00 PM", isRead: true },
    { id: 10, title: "Voterix", message: "SUCCESSFUL: You have successfully created an Election. Please click on the link below to c...", time: "5:00 PM", isRead: true },
  ]);

  const toggleReadStatus = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: !n.isRead } : n
    ));
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
        {notifications.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center p-8">
            <h3 className="text-lg font-bold text-gray-900">No Notification at this time</h3>
          </div>
        ) : (
          /* Notifications List */
          <div className="flex flex-col p-6 md:p-10 space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                onClick={() => toggleReadStatus(notification.id)}
                className={`flex items-center gap-4 md:gap-8 p-4 md:px-6 rounded-lg border transition-all cursor-pointer ${
                  notification.isRead 
                    ? "bg-white border-gray-400 hover:bg-gray-50/50" 
                    : "bg-gray-300 border-gray-400 shadow-sm"
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0 text-gray-700">
                  <Star size={20} strokeWidth={1.5} />
                </div>
                
                {/* Sender/Title */}
                <div className="flex-shrink-0 w-20 md:w-32">
                  <span className={`text-sm tracking-wide ${notification.isRead ? "font-medium text-gray-900" : "font-bold text-gray-900"}`}>
                    {notification.title}
                  </span>
                </div>
                
                {/* Message Content */}
                <div className="flex-1 truncate">
                  <span className={`text-sm ${notification.isRead ? "font-medium text-gray-500" : "font-semibold text-gray-900"}`}>
                    <span className={notification.isRead ? "text-gray-600 font-semibold" : ""}>
                      {notification.message.split(":")[0]}:
                    </span>
                    {notification.message.split(":")[1]}
                  </span>
                </div>
                
                {/* Time */}
                <div className="flex-shrink-0 ml-auto">
                  <span className={`text-sm ${notification.isRead ? "font-medium text-gray-500" : "font-semibold text-gray-700"}`}>
                    {notification.time}
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
