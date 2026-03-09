"use client";

import React from 'react';

interface VerificationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
}

export default function VerificationCodeModal({ isOpen, onClose, onVerify }: VerificationCodeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-bold text-black">Verification Code</h2>
          <button 
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#EBF4FF] text-[#1E3A8A] hover:bg-blue-100 transition-colors"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center px-8 pb-12 text-center">
          {/* Checkmark Icon */}
          <div className="mb-5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>

          <h3 className="text-lg font-bold text-black mb-2">
            A verification message has been sent to your inbox
          </h3>
          <p className="text-sm font-medium text-gray-600 mb-8 max-w-sm">
            Please check your inbox and enter the verification code below to reset password
          </p>

          {/* Code Inputs */}
          <div className="flex gap-4 mb-8">
            {[1, 2, 3, 4].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-[56px] h-[64px] text-center text-2xl font-bold rounded-xl border border-gray-400 focus:border-blue-500 focus:outline-none bg-white shadow-sm"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={() => onVerify('1234')}
            className="w-full max-w-sm py-3 font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              borderRadius: '11.155px',
              border: '1.394px solid #909090',
              background: 'linear-gradient(180deg, #3457B4 0%, #4A496A 100%)',
              boxShadow: '0 1.394px 2.789px 0 rgba(16, 24, 40, 0.05)'
            }}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
