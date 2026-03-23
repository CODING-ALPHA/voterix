"use client";

import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onDashboard: () => void;
}

export default function SuccessModal({ isOpen, onDashboard }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
      <div className="relative w-full max-w-md bg-white rounded-[2rem] p-12 shadow-xl flex flex-col items-center">
        {/* Overlapping Check Circle */}
        <div className="absolute -top-[64px] left-1/2 -translate-x-1/2 w-[128px] h-[128px] rounded-full bg-white shadow-lg flex items-center justify-center">
            <div className="w-[104px] h-[104px] rounded-full bg-[#3B82F6] flex items-center justify-center shadow-md">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
        </div>

        <div className="mt-12 text-center flex flex-col items-center w-full">
          <h2 className="text-4xl font-bold text-black mb-4">Done!</h2>
          <p className="text-black text-xl font-normal mb-8">You have successfully created your account</p>
          
          <button
            onClick={onDashboard}
            className="w-full py-4 font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              borderRadius: '11.155px',
              border: '1.394px solid #909090',
              background: 'linear-gradient(180deg, #3457B4 0%, #4A496A 100%)',
              boxShadow: '0 1.394px 2.789px 0 rgba(16, 24, 40, 0.05)'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

