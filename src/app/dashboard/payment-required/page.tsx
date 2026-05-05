"use client";

import React from "react";
import { CreditCard, ShieldAlert, ArrowRight, CheckCircle2, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function PaymentRequiredPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-[800px] w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-zinc-100 overflow-hidden relative">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50/50 rounded-full -ml-32 -mb-32 blur-3xl" />

        <div className="relative p-8 md:p-16 flex flex-col items-center text-center space-y-10">
          {/* Icon Header */}
          <div className="relative">
            <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 animate-pulse">
              <ShieldAlert size={48} strokeWidth={1.5} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-4 border-red-50 flex items-center justify-center text-red-500 shadow-sm">
              <CheckCircle2 size={16} />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 max-w-lg">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              Action Required: <span className="text-[#3457B4]">Setup Fee Pending</span>
            </h1>
            <p className="text-gray-500 font-medium leading-relaxed">
              Welcome, <span className="text-gray-900 font-bold">{user?.name}</span>! To unlock your full voting dashboard and start creating elections, a one-time administrative setup fee is required.
            </p>
          </div>

          {/* Pricing Highlight */}
          <div className="w-full max-w-sm bg-[#F8F9FB] border border-zinc-100 rounded-[2rem] p-8 space-y-6">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mandatory One-Time Fee</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-900 italic">₦10,000</span>
                <span className="text-gray-400 font-bold text-sm">/ Setup</span>
              </div>
            </div>
            
            <ul className="space-y-3 text-left">
              {[
                "Unlimited voter registry capacity",
                "Personalized election portal",
                "Advanced security & audit logs",
                "24/7 Priority support access"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                    <CheckCircle2 size={12} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Instructions */}
          <div className="w-full max-w-lg space-y-8 pt-4">
            <div className="bg-[#243160] text-white rounded-3xl p-8 shadow-xl shadow-blue-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CreditCard size={120} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <CreditCard size={18} className="text-[#FE9431]" />
                    Transfer Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-left relative z-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Bank Name</p>
                        <p className="text-sm font-black tracking-wide">GT Bank</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Account Name</p>
                        <p className="text-sm font-black tracking-wide">Adedolapo Atiba</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Account Number</p>
                        <p className="text-2xl font-black tracking-tighter text-[#FE9431]">0729778294</p>
                    </div>
                    <div className="space-y-1 flex flex-col justify-end">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Reference</p>
                        <p className="text-xs font-bold text-white/80 italic">Setup_{user?.publik_id}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="p-6 rounded-2xl border-2 border-dashed border-blue-100 bg-blue-50/30">
                    <p className="text-sm text-gray-600 font-medium italic">
                        "After making the transfer, please send your proof of payment to our verification team. Access is usually granted within 30-60 minutes."
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <button 
                        onClick={() => window.open('mailto:support@voterix.com.ng')}
                        className="flex items-center gap-2 h-14 px-8 bg-[#3457B4] text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 w-full sm:w-auto"
                    >
                        <Mail size={18} />
                        Send Proof of Payment
                    </button>
                    <button 
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 h-14 px-8 border border-zinc-200 text-gray-900 rounded-2xl font-bold hover:bg-zinc-50 transition-all w-full sm:w-auto"
                    >
                        Check Payment Status
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
          </div>

          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pt-8">
            Need help? <Link href="mailto:support@voterix.com.ng" className="text-[#3457B4] underline">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
