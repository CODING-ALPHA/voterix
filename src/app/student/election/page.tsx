"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import AlertModal from "@/components/AlertModal";
import { PinModal } from "@/components/AlertModal";
import { apiFetch, formatApiErrorMessage, voterFetch, getCookie, saveVoterSession, getVoterToken } from "@/lib/api-client";

function ElectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const electionId = searchParams.get("election") || searchParams.get("id") || "DEMO-ELECTION";
  const voterUid = searchParams.get("voter_uid") || "";
  const queryToken = searchParams.get("token") || searchParams.get("session_token") || "";
  const matricNumber = searchParams.get("matric_number") || searchParams.get("matric_no") || "";

  const [positions, setPositions] = useState<any[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, number | string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "error" | "success" | "warning" | "info" } | null>(null);

  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchBallot = async () => {
      try {
        const matric = matricNumber || (typeof window !== "undefined" ? getCookie("voter_matric") || "" : "");
        
        // 1. Check Status
        const statusRes = await apiFetch<any>(`/election/public/${electionId}/?matric=${encodeURIComponent(matric)}`);
        if (statusRes.status === "success" && statusRes.data.voter_status?.has_voted) {
          setHasVoted(true);
          return;
        }

        // 2. Fetch Positions
        const result = await apiFetch<any>(`/election/live-preview/${electionId}/`);
        if (result.status === "success") {
          setPositions(result.data.positions);
        }
      } catch (error) {
        console.error("Fetch ballot error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBallot();
  }, [electionId, matricNumber]);

  // Scrub URL parameters for security/privacy
  useEffect(() => {
    if (typeof window !== "undefined" && (queryToken || matricNumber)) {
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("session_token");
      url.searchParams.delete("matric_number");
      url.searchParams.delete("matric_no");
      window.history.replaceState({}, "", url.toString());
    }
  }, [queryToken, matricNumber]);

  const handleSelect = (position: any, candidate: any) => {
    const positionKey = String(position.uid || position.id || position.title);
    const candidateValue = candidate.uid || candidate.id || candidate.name;

    setSelectedCandidates(prev => ({
      ...prev,
      [positionKey]: candidateValue
    }));
  };

  const handleCastVoteClick = () => {
    if (Object.keys(selectedCandidates).length === 0) {
      setAlert({ message: "Please select at least one candidate", type: "warning" });
      return;
    }
    setIsPinModalOpen(true);
  };

  const handlePinConfirm = async (userPin: string) => {
    setIsSubmitting(true);
    try {
      let voterToken =
        queryToken || (typeof window !== "undefined" ? getVoterToken() || "" : "");
      let resolvedVoterUid =
        voterUid || (typeof window !== "undefined" ? getCookie("voter_uid") || "" : "");

      if (!voterToken) {
        if (!matricNumber) {
          setIsPinModalOpen(false);
          setAlert({ message: "Missing voter session. Please login again.", type: "warning" });
          return;
        }

        const loginResult = await apiFetch<any>(`/election/voter-login/${electionId}/`, {
          method: "POST",
          body: JSON.stringify({
            matric_number: matricNumber,
            pin: userPin,
          }),
        });

        if (loginResult.status !== "success" || !loginResult.data?.token) {
          setIsPinModalOpen(false);
          setAlert({
            message: formatApiErrorMessage(
              { message: loginResult.message, errors: loginResult.errors },
              "Unable to start voting session"
            ),
            type: "error",
          });
          return;
        }

        voterToken = loginResult.data.token;
        resolvedVoterUid = resolvedVoterUid || loginResult.data.voter_uid || "";

        if (typeof window !== "undefined") {
          saveVoterSession({
            token: voterToken,
            uid: resolvedVoterUid,
            name: loginResult.data.voter_name || "",
            matric: matricNumber
          });
        }
      }

      if (!resolvedVoterUid) {
        setIsPinModalOpen(false);
        setAlert({ message: "Missing voter ID. Please login again.", type: "warning" });
        return;
      }

      const result = await voterFetch<any>(`/election/cast-vote/${resolvedVoterUid}/`, voterToken, {
        method: "POST",
        body: JSON.stringify({ 
          selections: selectedCandidates,
          pin: userPin
        }),
      });

      if (result.status === "success") {
        setIsPinModalOpen(false);
        setAlert({ message: "Vote successfully recorded!", type: "success" });
        setTimeout(() => {
          router.push(`/student/preview?election=${electionId}&assoc=${searchParams.get("assoc") || ""}`);
        }, 1500);
      } else {
        setIsPinModalOpen(false);
        setAlert({
          message: formatApiErrorMessage(
            { message: result.message, errors: result.errors },
            "Failed to record vote"
          ),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Cast vote error:", error);
      setIsPinModalOpen(false);
      setAlert({ message: "An error occurred while casting your vote.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3457B4]"></div>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-10 text-green-500 shadow-sm">
           <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
           </svg>
        </div>
        <h1 className="text-3xl font-black text-[#101828] tracking-tight mb-4 uppercase">Ballot Already Cast</h1>
        <p className="text-gray-500 font-medium mb-12 max-w-md leading-relaxed">
          Your secure vote has been recorded and verified. You cannot modify your ballot or vote twice in this election.
        </p>
        <button
          onClick={() => router.push(`/student/preview?election=${electionId}`)}
          className="text-white font-bold text-sm md:text-base uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center hover:opacity-95 w-full md:w-[367px] h-12 md:h-14 px-8"
          style={{
            borderRadius: '21px',
            border: '1.81px solid #676767',
            background: 'linear-gradient(180deg, #3457B4 0%, #4A496A 100%)',
            boxShadow: '0 1.81px 3.619px 0 rgba(16, 24, 40, 0.05)',
            gap: '14.476px'
          }}
        >
          View Live Results
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-6 md:p-10 lg:p-12">
      {/* Page Header */}
      <div className="mb-8 max-w-[1400px] mx-auto pt-4">
        <h1 className="text-lg md:text-xl font-semibold text-gray-900 mb-0.5">
          Election <span className="text-[#3457B4]">Voting</span>
        </h1>
        <p className="text-gray-500 text-xs font-medium">
          Select your preferred candidates and cast your vote securely.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-6 pb-6">
        {positions.map((position: any, idx: number) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-8 md:p-10 shadow-sm border border-gray-100"
          >
            {/* Position Header */}
            <h2 className="text-gray-900 font-semibold text-base mb-8 uppercase tracking-wider">
              {position.title}
            </h2>

            {/* Candidates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {position.candidates.map((candidate: any, cIdx: number) => {
                const positionKey = String(position.uid || position.id || position.title);
                const candidateValue = candidate.uid || candidate.id || candidate.name;
                const isSelected = selectedCandidates[positionKey] === candidateValue;
                return (
                  <div
                    key={cIdx}
                    onClick={() => handleSelect(position, candidate)}
                    className={`relative flex flex-col bg-white rounded-xl p-5 pb-6 cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? "border-[#3457B4] ring-4 ring-[#3457B4]/5 shadow-md -translate-y-1"
                        : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    {/* Round Checkbox Top-Left */}
                    <div className="flex w-full justify-start mb-4">
                      <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-200 ${
                        isSelected ? "border-[#3457B4] bg-[#3457B4]" : "border-gray-200 bg-white"
                      }`}>
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Candidate Image */}
                    <div className="w-full aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-50 border border-gray-50">
                      {candidate.image ? (
                        <Image
                          src={candidate.image}
                          alt={candidate.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-200 text-2xl">
                          {candidate.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Candidate Name */}
                    <div className="w-full text-center mt-4">
                      <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-tight leading-tight px-2">
                        {candidate.name}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Action Button at Bottom */}
      <div className="max-w-[1400px] mx-auto flex justify-center pb-16">
        <button
          onClick={handleCastVoteClick}
          disabled={isSubmitting}
          className={`text-white font-bold text-sm md:text-base uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center hover:opacity-95 w-full md:w-[367px] h-12 md:h-14 px-8 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          style={{
            borderRadius: '21px',
            border: '1.81px solid #676767',
            background: 'linear-gradient(180deg, #3457B4 0%, #4A496A 100%)',
            boxShadow: '0 1.81px 3.619px 0 rgba(16, 24, 40, 0.05)',
            gap: '14.476px'
          }}
        >
          {isSubmitting ? "Casting..." : "Cast Vote"}
        </button>
      </div>

      {/* Modals */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onConfirm={handlePinConfirm}
        isLoading={isSubmitting}
      />
      <AlertModal
        isOpen={!!alert}
        onClose={() => setAlert(null)}
        message={alert?.message || ""}
        type={alert?.type}
      />
    </div>
  );
}

export default function StudentElection() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3457B4]"></div>
      </div>
    }>
      <ElectionContent />
    </Suspense>
  );
}

