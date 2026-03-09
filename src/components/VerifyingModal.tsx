"use client";

import React from 'react';

interface VerifyingModalProps {
  isOpen: boolean;
}

export default function VerifyingModal({ isOpen }: VerifyingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
      <div className="relative w-full max-w-md bg-white rounded-[2rem] p-12 shadow-xl flex flex-col items-center">
        {/* Overlapping Spinner */}
        <div className="absolute -top-[52px] left-1/2 -translate-x-1/2 w-[104px] h-[104px] rounded-full bg-white shadow-lg flex items-center justify-center">
            <div className="w-[84px] h-[84px] rounded-full border-[6px] border-[#EEF2FA] animate-spin relative">
                {/* Dots on the spinner */}
                <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#1A56DB]"></div>
                <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#1A56DB]"></div>
            </div>
        </div>

        <div className="mt-10 text-center">
          <h2 className="text-[28px] font-bold text-black mb-3">Verifying.....</h2>
          <p className="text-black text-lg font-normal">Please, wait a few moments</p>
        </div>
      </div>
    </div>
  );
}
