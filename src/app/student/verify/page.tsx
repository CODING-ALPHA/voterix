"use client";

import React, { useEffect, Suspense, useState } from "react";
import Image from "next/image";
import { AlertCircle, KeyRound, Mail, User, Phone } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import AlertModal from "@/components/AlertModal";
import {
  formatApiErrorMessage,
  voterRequestOtp,
  getPublicElectionDetail,
  apiFetch,
  saveVoterSession
} from "@/lib/api-client";

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const assocId = searchParams.get("assoc");
  const electionId = searchParams.get("election");

  const [loginMode, setLoginMode] = useState<"otp" | "pin">("otp");
  const [name, setName] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [pin, setPin] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [matricError, setMatricError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alert, setAlert] = useState<{ message: string; type: "error" | "warning" } | null>(null);

  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    if (electionId) {
      setIsFetchingMeta(true);
      getPublicElectionDetail(electionId)
        .then((res) => {
          if (res.status === "success") {
            setMeta(res.data);
          }
        })
        .catch(console.error)
        .finally(() => setIsFetchingMeta(false));
    }
  }, [electionId]);

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assocId) {
      setAlert({ message: "Association ID is missing from URL. Please use the official voting link.", type: "error" });
      return;
    }

    setIsLoading(true);
    setMatricError(false);
    setErrorMessage("");

    try {
      const result = await voterRequestOtp(assocId, {
        name,
        matric_no: matricNo,
        email,
        whatsapp_number: whatsappNumber,
      });

      if (result.status === "success") {
        // Store name and matric in short-lived cookies for the next step
        document.cookie = `voter_name=${encodeURIComponent(name)}; path=/; max-age=3600; SameSite=Lax`;
        document.cookie = `voter_matric=${encodeURIComponent(matricNo)}; path=/; max-age=3600; SameSite=Lax`;
        router.push(`/student/verify/otp?email=${email}&matric=${matricNo}&assoc=${assocId}&election=${electionId}`);
      } else {
        setMatricError(true);
        setErrorMessage(
          formatApiErrorMessage(
            { message: result.message, errors: result.errors },
            "You are not eligible to participate in this election"
          )
        );
      }
    } catch (error) {
      console.error("OTP Authentication error:", error);
      setAlert({ message: "An error occurred. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!electionId) return;

    setIsLoading(true);
    setMatricError(false);
    setErrorMessage("");

    try {
      const result = await apiFetch<any>(`/election/voter-login/${electionId}/`, {
        method: "POST",
        body: JSON.stringify({
          matric_number: matricNo,
          pin: pin,
        }),
      });

      if (result.status === "success") {
        const { token, voter_uid, voter_name } = result.data;
        saveVoterSession({
          token,
          uid: voter_uid,
          name: voter_name,
          matric: matricNo
        });

        router.push(`/student?election=${electionId}&assoc=${assocId || ''}`);
      } else {
        setMatricError(true);
        setErrorMessage(result.message || "Invalid matric number or PIN");
      }
    } catch (error) {
      console.error("PIN Login error:", error);
      setAlert({ message: "Incorrect PIN or Matric number. Ensure you have set your PIN via the OTP flow first.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[520px] bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 md:p-14 border border-zinc-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] relative overflow-hidden">

      {/* Dynamic Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#3457B4]/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

      <div className="flex flex-col items-center mb-10 text-center relative z-10">
        <div className="relative w-40 h-14 mb-6">
          <Image
            src="/logo.svg"
            alt="Voterix Logo"
            fill
            priority
            className="object-contain"
          />
        </div>

        {isFetchingMeta ? (
          <div className="animate-pulse space-y-3 w-full">
            <div className="h-3 w-32 bg-gray-50 rounded mx-auto"></div>
            <div className="h-8 w-48 bg-gray-100 rounded mx-auto"></div>
          </div>
        ) : (
          <>
            <p className="text-[10px] md:text-xs font-black text-slate-400 tracking-[0.25em] uppercase mb-2">
              {meta?.association_name || "Association Registry"}
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-[#101828] tracking-tight uppercase leading-tight">
              {meta?.title || "Verify Identity"}
            </h1>
          </>
        )}
      </div>

      {/* Mode Toggle */}
      <div className="bg-gray-50/80 p-1 md:p-1.5 rounded-2xl mb-8 md:mb-10 flex gap-1 md:gap-2 relative z-10 border border-gray-100">
        <button
          onClick={() => setLoginMode("otp")}
          className={`flex-1 py-2.5 md:py-3 rounded-[14px] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${loginMode === 'otp' ? 'bg-white text-[#3457B4] shadow-md shadow-blue-500/5 ring-1 ring-zinc-100' : 'text-gray-400 hover:text-gray-500 hover:bg-white/50'}`}
        >
          Verification
        </button>
        <button
          onClick={() => setLoginMode("pin")}
          className={`flex-1 py-2.5 md:py-3 rounded-[14px] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${loginMode === 'pin' ? 'bg-white text-[#3457B4] shadow-md shadow-blue-500/5 ring-1 ring-zinc-100' : 'text-gray-400 hover:text-gray-500 hover:bg-white/50'}`}
        >
          Login PIN
        </button>
      </div>

      <form className="space-y-5 relative z-10" onSubmit={loginMode === "otp" ? handleOtpLogin : handlePinLogin}>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 pl-1">
            Matric No
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-300 group-focus-within:text-[#3457B4] transition-colors">
              <User size={18} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              value={matricNo}
              onChange={(e) => setMatricNo(e.target.value)}
              required
              placeholder="Enter Matric No."
              className={`w-full h-14 pl-14 pr-12 rounded-2xl border bg-white text-gray-900 text-sm font-bold focus:outline-none transition-all ${matricError
                ? "border-red-500 focus:ring-4 focus:ring-red-500/10 placeholder:text-red-200"
                : "border-zinc-200 focus:ring-4 focus:ring-[#3457B4]/5 focus:border-[#3457B4]"
                }`}
            />
            {matricError && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none uppercase">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {matricError && (
            <p className="text-[10px] text-red-500 font-black mt-2 pl-1 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {errorMessage}
            </p>
          )}
        </div>

        {loginMode === "otp" ? (
          <>
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 pl-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-300 group-focus-within:text-[#3457B4] transition-colors">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Surname - Firstname"
                  required
                  className="w-full h-14 pl-14 px-5 rounded-2xl border border-zinc-200 bg-white text-gray-900 text-sm font-bold placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-[#3457B4]/5 focus:border-[#3457B4] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 pl-1">
                Institutional Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-300 group-focus-within:text-[#3457B4] transition-colors">
                  <Mail size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="voter@institutional.edu"
                  className="w-full h-14 pl-14 px-5 rounded-2xl border border-zinc-200 bg-white text-gray-900 text-sm font-bold placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-[#3457B4]/5 focus:border-[#3457B4] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 pl-1">
                WhatsApp Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-300 group-focus-within:text-[#3457B4] transition-colors">
                  <Phone size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  required
                  placeholder="0810 000 0000"
                  className="w-full h-14 pl-14 px-5 rounded-2xl border border-zinc-200 bg-white text-gray-900 text-sm font-bold placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-[#3457B4]/5 focus:border-[#3457B4] transition-all"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 pl-1">
              Secret Voting PIN
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-300 group-focus-within:text-[#3457B4] transition-colors">
                <KeyRound size={18} strokeWidth={2.5} />
              </div>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                required
                placeholder="••••••"
                className="w-full h-14 pl-14 text-2xl tracking-[0.5em] rounded-2xl border border-zinc-200 bg-white text-gray-900 font-black placeholder:text-zinc-300 placeholder:tracking-normal focus:outline-none focus:ring-4 focus:ring-[#3457B4]/5 focus:border-[#3457B4] transition-all"
              />
            </div>
            <p className="text-[9px] text-zinc-400 font-bold mt-2 pl-1 italic">
              * Enter the 6-digit PIN sent to your Email or WhatsApp.
            </p>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || isFetchingMeta}
            className={`w-full h-14 sm:h-15 font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-[11px] text-white transition-all hover:opacity-95 active:scale-[0.98] flex items-center justify-center gap-3 ${isLoading || isFetchingMeta ? 'opacity-70' : ''}`}
            style={{
              borderRadius: '16px',
              background: 'linear-gradient(180deg, #3457B4 0%, #243160 100%)',
              boxShadow: '0 15px 35px -10px rgba(52, 87, 180, 0.4)'
            }}
          >
            {isLoading ? "Authenticating..." : loginMode === "otp" ? "Begin Verification" : "Login with PIN"}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center relative z-10">
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
          {loginMode === "otp"
            ? "First time? Complete verification to receive your PIN."
            : "Missing your PIN? Contact your Association Admin."
          }
        </p>
      </div>

      <AlertModal
        isOpen={!!alert}
        onClose={() => setAlert(null)}
        message={alert?.message || ""}
        type={alert?.type as any}
      />
    </div>
  );
}

export default function StudentVerificationEntry() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 text-zinc-900 p-6 font-sans">
      <Suspense fallback={<div className="text-gray-400 font-bold animate-pulse">Initializing Secure Verification...</div>}>
        <VerificationContent />
      </Suspense>
    </div>
  );
}
