"use client";

import React, { useEffect } from "react";
import { X, AlertCircle, CheckCircle2, Info, Eye, EyeOff } from "lucide-react";

type AlertType = "error" | "success" | "info" | "warning";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: AlertType;
  confirmLabel?: string;
}

const iconMap: Record<AlertType, React.ReactNode> = {
  error: <AlertCircle size={28} className="text-red-500" />,
  success: <CheckCircle2 size={28} className="text-green-500" />,
  info: <Info size={28} className="text-blue-500" />,
  warning: <AlertCircle size={28} className="text-amber-500" />,
};

const colorMap: Record<AlertType, string> = {
  error: "bg-red-50",
  success: "bg-green-50",
  info: "bg-blue-50",
  warning: "bg-amber-50",
};

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmLabel = "OK",
}: AlertModalProps) {
  useEffect(() => {
    if (isOpen) {
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape" || e.key === "Enter") onClose();
      };
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultTitles: Record<AlertType, string> = {
    error: "Error",
    success: "Success",
    info: "Notice",
    warning: "Warning",
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-full ${colorMap[type]} flex items-center justify-center mb-4`}>
            {iconMap[type]}
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {title || defaultTitles[type]}
          </h2>

          {/* Message */}
          <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
            {message}
          </p>

          {/* Confirm button */}
          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
            style={{
              background:
                type === "error"
                  ? "linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)"
                  : type === "success"
                  ? "linear-gradient(180deg, #22c55e 0%, #15803d 100%)"
                  : type === "warning"
                  ? "linear-gradient(180deg, #f59e0b 0%, #b45309 100%)"
                  : "linear-gradient(180deg, #3457B4 0%, #4A496A 100%)",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── PIN Prompt Modal ────────────────────────────────────────────────────────

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => void;
  isLoading?: boolean;
  description?: string;
}

export function PinModal({ isOpen, onClose, onConfirm, isLoading, description }: PinModalProps) {
  const [pin, setPin] = React.useState("");
  const [showPin, setShowPin] = React.useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPin("");
      setShowPin(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 6) onConfirm(pin);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-1">Enter Voting PIN</h2>
          <p className="text-sm text-gray-500 font-medium mb-6">
            {description || "Enter your 6-digit secure voting PIN to cast your vote."}
          </p>

          <div className="w-full mb-6 space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 text-left">
              6-Digit PIN
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
                maxLength={6}
                autoFocus
                className="w-full h-12 px-4 pr-11 rounded-xl border border-gray-300 bg-white text-gray-900 text-center text-xl font-bold tracking-widest placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                title={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pin.length < 6 || isLoading}
              className="flex-1 h-11 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(180deg, #3457B4 0%, #4A496A 100%)" }}
            >
              {isLoading ? "Submitting..." : "Confirm Vote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
