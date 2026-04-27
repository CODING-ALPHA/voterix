"use client";

import React, { useState } from 'react';
import { formatApiErrorMessage, verifyOtp } from "@/lib/api-client";

interface VerificationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  email: string;
  purpose: 'signup' | 'login';
  onCodeVerify?: (code: string) => Promise<void> | void;
}

export default function VerificationCodeModal({
  isOpen,
  onClose,
  onVerify,
  email,
  purpose,
  onCodeVerify,
}: VerificationCodeModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "error" | "warning" } | null>(null);
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      inputs.current[0]?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (alert) setAlert(null);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setAlert({ message: "Please enter all 6 digits", type: "warning" });
      return;
    }

    setIsLoading(true);
    try {
      if (onCodeVerify) {
        await onCodeVerify(fullCode);
        onVerify();
      } else {
        const result = await verifyOtp({ email, code: fullCode, purpose });

        if (result.status === "success") {
          onVerify();
        } else {
          setAlert({
            message: formatApiErrorMessage(
              { message: result.message, errors: result.errors },
              "Verification failed"
            ),
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      setAlert({
        message: error instanceof Error ? error.message : "An error occurred during verification",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-[560px] bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-end px-7 pt-7 pb-5">
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#EBF4FF] text-[#1E3A8A] hover:bg-blue-100 transition-colors"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center px-10 pb-12 pt-1 text-center">
            {alert && (
              <div className="mb-5 w-full max-w-md rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left text-sm font-medium text-red-700">
                {alert.message}
              </div>
            )}

            <p className="text-sm font-medium text-gray-600 max-w-md leading-relaxed">
              Please check {email} and enter the 6-digit verification code below.
            </p>
            {/* Code Inputs */}
            <div className="flex gap-2.5 mt-8 mb-9">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-[56px] h-[64px] text-center text-2xl font-bold text-gray-900 rounded-xl border focus:outline-none bg-white shadow-sm ${
                    alert ? "border-red-400 focus:border-red-500" : "border-gray-400 focus:border-blue-500"
                  }`}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={isLoading}
              className={`w-full max-w-sm py-3 font-semibold text-white transition-opacity hover:opacity-90 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              style={{
                borderRadius: '11.155px',
                border: '1.394px solid #909090',
                background: 'linear-gradient(180deg, #3457B4 0%, #4A496A 100%)',
                boxShadow: '0 1.394px 2.789px 0 rgba(16, 24, 40, 0.05)'
              }}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
