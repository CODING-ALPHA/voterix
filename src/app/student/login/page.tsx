"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export default function StudentLogin() {
  const [matricError, setMatricError] = useState(true);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-zinc-900 p-6">
      {/* Centered White Card */}
      <div className="w-full max-w-[480px] bg-white rounded-3xl p-10 md:p-14 border border-zinc-100 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] relative">
        
        {/* Branding */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#243160] flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xl font-black text-[#243160] tracking-tighter">VOTERIX</span>
          </div>
          <p className="text-[11px] font-bold text-slate-500 tracking-[0.2em] uppercase mb-2">
            National Association of Computing Students
          </p>
          <h1 className="text-4xl font-black text-[#101828] tracking-tight">
            NACOS DECIDES 24/25
          </h1>
        </div>

        {/* Form fields */}
        <form className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
              Name
            </label>
            <input
              type="text"
              placeholder="Surname - Firstname"
              className="w-full h-12 px-5 rounded-xl border border-zinc-200 bg-white text-gray-900 text-sm font-semibold placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-[#3457B4]/10 focus:border-[#3457B4] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
              Matric No
            </label>
            <div className="relative">
              <input
                type="text"
                defaultValue="BU22CSC1087"
                className={`w-full h-12 px-5 rounded-xl border bg-white text-gray-900 text-sm font-semibold focus:outline-none transition-all pr-12 ${
                  matricError 
                    ? "border-red-500 focus:ring-4 focus:ring-red-500/10 placeholder:text-red-200" 
                    : "border-zinc-200 focus:ring-4 focus:ring-[#3457B4]/10 focus:border-[#3457B4]"
                }`}
              />
              {matricError && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {matricError && (
              <p className="text-[11px] text-red-500 font-bold mt-1.5 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-red-500"></span>
                You are not eligible to participate in this election
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
              Email
            </label>
            <input
              type="email"
              placeholder="abc@email.com"
              className="w-full h-12 px-5 rounded-xl border border-zinc-200 bg-white text-gray-900 text-sm font-semibold placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-[#3457B4]/10 focus:border-[#3457B4] transition-all"
            />
          </div>

          <div className="pt-2 flex items-center">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4 h-4 rounded border-zinc-300 text-[#3457B4] focus:ring-[#3457B4]"
              defaultChecked
            />
            <label htmlFor="remember" className="ml-3 text-sm text-zinc-600 font-bold">
              Remember me
            </label>
          </div>

          <div className="pt-6">
            <button
              type="button"
              className="w-full h-14 font-black uppercase tracking-[0.2em] text-[13px] text-white transition-all hover:opacity-95 active:scale-[0.98]"
              style={{
                borderRadius: '16px',
                background: 'linear-gradient(180deg, #3457B4 0%, #243160 100%)',
                boxShadow: '0 10px 25px -5px rgba(52, 87, 180, 0.4)'
              }}
            >
              Authenticate
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
