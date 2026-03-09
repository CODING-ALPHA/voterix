"use client";

import React from "react";
import { X, Calendar, Clock, ChevronDown, Upload } from "lucide-react";

interface EditElectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  election?: any;
}

export default function EditElectionModal({ isOpen, onClose, election }: EditElectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl w-full max-w-[500px] p-5 md:p-6 shadow-2xl animate-in slide-in-from-bottom-5 sm:slide-in-from-top-5 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Edit Election</h2>
          <button 
            onClick={onClose}
            className="p-1.5 bg-gray-50 text-gray-500 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-900">Election Title</label>
            <input
              type="text"
              defaultValue={election?.name || "NACOS DECIDES 25/26"}
              className="w-full bg-white border border-gray-300 h-10 px-3 rounded-xl text-sm focus:outline-none focus:border-[#405189] font-medium text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-900">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                defaultValue={election?.date || "12/05/2026"}
                className="w-full bg-white border border-gray-300 h-10 pl-10 pr-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-semibold text-gray-900 placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-900">Start Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select className="w-full bg-white border border-gray-300 h-10 pl-10 pr-8 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-semibold text-gray-900 appearance-none">
                  <option>10:00AM</option>
                  <option>11:00AM</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-900">End Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select className="w-full bg-white border border-gray-300 h-10 pl-10 pr-8 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-semibold text-gray-900 appearance-none">
                  <option>10:00PM</option>
                  <option>11:00PM</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-900">Upload Spreadsheet</label>
            <div className="flex items-center px-4 h-10 border border-gray-300 rounded-lg relative w-full sm:w-fit">
               <div className="flex items-center gap-2">
                 <Upload size={16} className="text-gray-400" />
                 <span className="text-xs font-semibold text-gray-400">.xlc</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-4">
            <button
              onClick={onClose}
              className="w-full sm:w-auto h-10 px-8 rounded-lg border border-gray-300 font-semibold text-gray-600 hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              className="w-full sm:w-auto h-10 px-8 rounded-lg bg-[#405189] text-white font-medium hover:opacity-90 transition-all shadow-md text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
