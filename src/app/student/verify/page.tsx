"use client";

import React, { useEffect, Suspense } from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AlertModal from "@/components/AlertModal";
import { formatApiErrorMessage, voterVerifyOtp, saveVoterSession } from "@/lib/api-client";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get("email") || "";
  const matric = searchParams.get("matric") || "";
  const assocId = searchParams.get("assoc") || "";
  const queryElectionId = searchParams.get("election") || "";

  const [step, setStep] = useState<1 | 2>(1); // 1: OTP, 2: Success
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const [targetElectionId, setTargetElectionId] = useState(queryElectionId);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (value && !/^\d+$/.test(value)) return;

    const currentValues = [...otp];
    currentValues[index] = value;
    setOtp(currentValues);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setAlert({ message: "Please enter the full 6-digit OTP.", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const result = await voterVerifyOtp(matric, otpString);

      if (result.status === "success") {
        // Save session data returned from backend
        const { token, voter_uid, voter_name, election_id } = result.data as any;
        
        saveVoterSession({
          token,
          uid: voter_uid,
          name: voter_name,
          matric: matric
        });
        
        const finalEid = election_id || queryElectionId;
        setTargetElectionId(finalEid);

        setStep(2);
        // Automatically redirect after 3 seconds
        setTimeout(() => {
          router.push(`/student?election=${finalEid}&assoc=${assocId || ""}`);
        }, 3000);
      } else {
        setAlert({ 
          message: formatApiErrorMessage({ message: result.message, errors: result.errors }, "Invalid OTP. Please try again."),
          type: "error" 
        });
      }
    } catch (error) {
      setAlert({ message: "An error occurred. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 2) {
    return (
        <div className="w-full max-w-[480px] bg-white rounded-3xl p-10 md:p-14 border border-zinc-100 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center text-center font-sans">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-8 text-green-500">
                <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-black text-[#101828] tracking-tight mb-4 uppercase">Verification Success</h1>
            <p className="text-zinc-500 font-medium mb-10">
                Your identity has been confirmed. You're all set for the upcoming election! Redirecting to your dashboard...
            </p>
            <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 animate-[progress_3s_linear_forwards]" />
            </div>
            <style jsx>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </div>
    );
  }

  return (
    <div className="w-full max-w-[480px] bg-white rounded-3xl p-10 md:p-14 border border-zinc-100 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] relative font-sans">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="relative w-40 h-16 mb-8">
          <Image
            src="/logo.svg"
            alt="Voterix Logo"
            fill
            priority
            className="object-contain"
          />
        </div>

        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-[#3457B4]/10 text-[#3457B4]">
           <ShieldCheck size={28} />
        </div>

        <h1 className="text-3xl font-black text-[#101828] tracking-tight mb-3">
          Verify Identity
        </h1>
        <p className="text-sm text-zinc-500 font-medium px-4 leading-relaxed">
          We've sent a 6-digit verification code to <span className="text-zinc-900 font-bold block mt-1">{email}</span>
        </p>
      </div>

      <form className="space-y-10" onSubmit={handleVerifyOtp}>
        <div className="flex justify-between gap-2 md:gap-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              inputMode="numeric"
              value={digit}
              autoComplete="one-time-code"
              onChange={(e) => handleInputChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-bold bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3457B4]/10 focus:border-[#3457B4] transition-all"
              required
            />
          ))}
        </div>

        <div className="space-y-4">
            <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-14 font-black uppercase tracking-[0.22em] text-xs text-white transition-all hover:opacity-95 active:scale-[0.98] ${isLoading ? 'opacity-70' : ''}`}
            style={{
                borderRadius: '16px',
                background: 'linear-gradient(180deg, #3457B4 0%, #243160 100%)',
                boxShadow: '0 10px 25px -5px rgba(52, 87, 180, 0.4)'
            }}
            >
            {isLoading ? "Processing..." : "Verify Identity"}
            </button>

            <div className="text-center">
            <button 
                type="button" 
                className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-[#3457B4] transition-colors"
                onClick={() => router.back()}
            >
                Entered wrong details? Go Back
            </button>
            </div>
        </div>
      </form>

      <AlertModal
        isOpen={!!alert}
        onClose={() => setAlert(null)}
        message={alert?.message || ""}
        type={alert?.type as any}
      />
    </div>
  );
}

export default function StudentVerify() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] text-zinc-900 p-6 font-sans">
      <Suspense fallback={<div className="text-zinc-300 font-bold animate-pulse text-xs uppercase tracking-widest">Initialising Verification Service...</div>}>
         <VerifyContent />
      </Suspense>
    </div>
  );
}
