"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api-client";

function PreviewContent() {
  const searchParams = useSearchParams();
  const electionPublikId = searchParams.get("election") || searchParams.get("id");
  
  const [positions, setPositions] = useState<any[]>([]);
  const [turnout, setTurnout] = useState<any>(null);
  const [electionTitle, setElectionTitle] = useState("Loading Results...");
  const [isLoading, setIsLoading] = useState(true);
  const [electionInfo, setElectionInfo] = useState<{
    show_live_results: boolean;
    show_final_results: boolean;
    status: string;
  } | null>(null);

  const fetchResults = async () => {
    if (!electionPublikId) return;
    
    try {
      const result = await apiFetch<any>(`/election/live-preview/${electionPublikId}/`);
      if (result.status === "success") {
        setPositions(result.data.positions || []);
        setTurnout(result.data.turnout);
        setElectionTitle(result.data.election_title || result.data.title);
        setElectionInfo({
          show_live_results: result.data.show_live_results,
          show_final_results: result.data.show_final_results,
          status: result.data.status,
        });
      }
    } catch (error) {
      console.error("Fetch results error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 30000); // 30s polling
    return () => clearInterval(interval);
  }, [electionPublikId]);

  if (!electionPublikId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-white rounded-3xl border border-zinc-100 shadow-sm max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Election Selected</h2>
          <p className="text-gray-500 text-sm">Please select an election from your dashboard to view the live results.</p>
        </div>
      </div>
    );
  }

  const isHidden = electionInfo && (
    (electionInfo.status === "ongoing" && !electionInfo.show_live_results) ||
    (electionInfo.status === "completed" && !electionInfo.show_final_results)
  );

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto min-h-screen">
      {/* Page Header */}
      <div className="mb-8 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-gray-900 mb-0.5">
            {electionTitle} <span className="text-[#3457B4]">Results</span>
          </h1>
          <p className="text-gray-500 text-xs font-medium">
            Live real-time monitoring of the ongoing election.
          </p>
        </div>
        {!isHidden && turnout && (
          <div className="bg-[#3457B4]/5 px-4 py-2 rounded-xl border border-[#3457B4]/10">
            <span className="text-xs font-bold text-[#3457B4] uppercase tracking-wider block mb-1">Total Turnout</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-[#3457B4]">{turnout.percent}%</span>
              <span className="text-xs font-semibold text-gray-500">({turnout.total_voted}/{turnout.total_eligible})</span>
            </div>
          </div>
        )}
      </div>

      {/* Container Card */}
      <div 
        className="bg-white rounded-[35px] p-8 md:p-12 border border-blue-50/50 flex flex-col min-h-[70vh]"
        style={{ boxShadow: "0px 10px 40px -10px rgba(54, 74, 99, 0.08)" }}
      >
        
        {/* Positions and Results */}
        <div className="flex-1 space-y-16 max-w-5xl w-full">
          {isLoading && positions.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-[#3457B4]/10 border-t-[#3457B4] rounded-full animate-spin" />
                <span className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Fetching live data...</span>
             </div>
          ) : isHidden ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Results are currently hidden</h3>
              <p className="text-gray-500 max-w-sm text-sm">
                The election administrator has disabled live result viewing for this period. 
                Please check back later once the official results are released.
              </p>
            </div>
          ) : positions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-gray-400 font-medium">No results data available yet.</span>
            </div>
          ) : (
            positions.map((position: any, idx: number) => (
              <div key={idx} className="relative">
                {/* Position Title */}
                <div className="mb-10 flex items-center gap-4">
                  <div className="h-6 w-1 bg-[#3457B4] rounded-full" />
                  <h2 className="text-black font-bold text-2xl tracking-tight uppercase">
                    {position.title}
                  </h2>
                </div>

                {/* Candidates Progress Bars / Hidden Placeholder */}
                {!position.show_live_results ? (
                  <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">Results Hidden</h4>
                    <p className="text-[11px] text-gray-500 font-medium max-w-[240px]">
                      The standings for this position are currently suppressed by the administrator.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {position.candidates.map((candidate: any, cIdx: number) => (
                      <div key={cIdx} className="flex flex-col gap-4">
                        
                        {/* Header: Info & Votes */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white shadow-md relative shrink-0 bg-gray-50">
                              {candidate.image ? (
                                <Image 
                                  src={candidate.image}
                                  alt={candidate.name}
                                  fill
                                  unoptimized
                                  className="object-contain"
                                  style={{ objectFit: "contain" }}
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-300 text-[10px] md:text-sm">
                                  {candidate.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[9px] md:text-xs font-black text-[#FF4D4C] uppercase tracking-[0.2em] mb-0.5">Candidate</span>
                              <span className="text-sm md:text-base font-black text-[#101828] uppercase tracking-tight truncate">
                                {candidate.name}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end bg-gray-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-gray-100">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest sm:mb-0.5">Votes</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs md:text-base font-black text-gray-900 uppercase">
                                {candidate.votes} VOTES
                              </span>
                              <div className="h-4 w-px bg-zinc-200" />
                              <span className="text-sm md:text-base font-black text-[#3457B4]">
                                {candidate.percent}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar (Gradient) */}
                        <div className="relative w-full h-[12px] bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
                          <div 
                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(52,87,180,0.2)]" 
                            style={{ 
                              width: `${candidate.percent}%`,
                              background: 'linear-gradient(90deg, #3457B4 0%, #4A496A 100%)'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudentPreview() {
  return (
    <Suspense fallback={
       <div className="flex items-center justify-center min-h-[60vh] text-zinc-300 font-bold text-xs uppercase tracking-widest">
         Loading Results Engine...
       </div>
    }>
      <PreviewContent />
    </Suspense>
  );
}
