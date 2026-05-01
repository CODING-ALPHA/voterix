"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { apiFetch, formatApiErrorMessage } from "@/lib/api-client";

type CandidateRow = {
  name: string;
  votes: number;
  percentage: number;
  color: string;
  image?: string;
};

type PositionRow = {
  title: string;
  uid: string;
  show_live_results: boolean;
  candidates: CandidateRow[];
};

const COLORS = ["#243160", "#5E6993", "#94A3B8", "#B3C2DD", "#D7DFEE"];

const Switch = ({ enabled, onChange, disabled, label, subLabel, activeColor = "bg-blue-600" }: any) => (
  <div className="flex items-center gap-3">
    <div className="flex flex-col min-w-[70px]">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 opacity-80">{label}</span>
      <span className={`text-[9px] font-bold ${enabled ? "text-[#405189]" : "text-gray-400"} transition-colors whitespace-nowrap`}>
        {subLabel}
      </span>
    </div>
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${
        enabled ? activeColor : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105 active:scale-95"}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
          enabled ? "translate-x-6" : "translate-x-0.5"
        }`}
      />
    </button>
  </div>
);

const PieChart = ({ candidates }: { candidates: CandidateRow[] }) => {
  const [hoveredCandidate, setHoveredCandidate] = useState<CandidateRow | null>(null);
  let acc = 0;
  
  if (candidates.length === 0 || candidates.every(c => c.votes === 0)) {
    return (
      <div className="relative w-full aspect-square max-w-[180px] md:max-w-[220px] mx-auto flex items-center justify-center rounded-full bg-gray-50 border-2 border-dashed border-gray-200">
        <span className="text-gray-300 font-bold text-xs uppercase tracking-widest">No Votes</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square max-w-[220px] md:max-w-[260px] mx-auto group">
      {/* Center Image/Info (Donut Style) */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="w-[60%] h-[60%] bg-white rounded-full shadow-inner flex flex-col items-center justify-center overflow-hidden border-4 border-gray-50/50">
           {hoveredCandidate ? (
             <>
               <div className="relative w-full h-full">
                 <Image 
                   src={hoveredCandidate.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(hoveredCandidate.name)}`} 
                   alt={hoveredCandidate.name} 
                   fill 
                   className="object-contain animate-in fade-in zoom-in-95 duration-300"
                    style={{ objectFit: "contain" }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">{Math.round(hoveredCandidate.percentage)}%</span>
                 </div>
               </div>
             </>
           ) : (
             <div className="text-center p-4 animate-in fade-in duration-500">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">Hover to Inspect</p>
             </div>
           )}
        </div>
      </div>

      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-xl overflow-visible">
        {candidates.map((cand, i) => {
          if (cand.percentage === 0) return null;
          
          const isHovered = hoveredCandidate?.name === cand.name;
          const start = acc;
          acc += cand.percentage;

          // Special case for 100%
          if (cand.percentage === 100) {
            return (
              <circle
                key={`${cand.name}-${i}`}
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={cand.color}
                strokeWidth={isHovered ? "12" : "10"}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredCandidate(cand)}
                onMouseLeave={() => setHoveredCandidate(null)}
              />
            );
          }

          const startAngle = (start / 100) * 360;
          const endAngle = (acc / 100) * 360;

          // Calculate path for donut segment
          const radius = 45;
          const x1 = 50 + radius * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + radius * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + radius * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 50 + radius * Math.sin((endAngle * Math.PI) / 180);
          const largeArc = cand.percentage > 50 ? 1 : 0;

          return (
            <path
              key={`${cand.name}-${i}`}
              d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
              fill="none"
              stroke={cand.color}
              strokeWidth={isHovered ? "12" : "10"}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer hover:opacity-90"
              style={{ 
                filter: isHovered ? 'brightness(1.1) drop-shadow(0 0 4px rgba(0,0,0,0.1))' : 'none',
                transform: isHovered ? 'scale(1.02)' : 'none',
                transformOrigin: '50% 50%'
              }}
              onMouseEnter={() => setHoveredCandidate(cand)}
              onMouseLeave={() => setHoveredCandidate(null)}
            />
          );
        })}
      </svg>
    </div>
  );
};

function PreviewContent() {
  const searchParams = useSearchParams();
  const queryPublikId = searchParams.get("id");

  const [elections, setElections] = useState<Array<{ publik_id: string; title: string }>>([]);
  const [selectedPublikId, setSelectedPublikId] = useState<string>(queryPublikId || "");
  const [positions, setPositions] = useState<PositionRow[]>([]);
  const [turnoutText, setTurnoutText] = useState("0");
  const [electionTitle, setElectionTitle] = useState("Live Preview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [turnoutData, setTurnoutData] = useState<{ percent: number; voted: number; eligible: number } | null>(null);
  const [globalShowLive, setGlobalShowLive] = useState(true);
  const [globalShowFinal, setGlobalShowFinal] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const selectedElectionTitle = useMemo(() => {
    const hit = elections.find((item) => item.publik_id === selectedPublikId);
    return hit?.title || electionTitle;
  }, [elections, selectedPublikId, electionTitle]);

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);
      setError("");
      try {
        const list = await apiFetch<any>("/election/");
        if (list.status === "success") {
          const rows = (list.data || []).map((item: any) => ({
            publik_id: String(item.publik_id || item.uid || ""),
            title: String(item.title || "Election"),
          }));
          setElections(rows);
          const fallbackId = queryPublikId || rows[0]?.publik_id || "";
          setSelectedPublikId((current) => current || fallbackId);
        }
      } catch (err) {
        setError(formatApiErrorMessage(err, "Could not load elections."));
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, [queryPublikId]);

  useEffect(() => {
    if (!selectedPublikId) return;
    const fetchPreview = async () => {
      setIsLoading(true);
      setError("");
      try {
        const result = await apiFetch<any>(`/election/live-preview/${selectedPublikId}/`);
        if (result.status === "success") {
          const data = result.data || {};
          const turnout = data.turnout || {};
          const voted = Number(turnout.total_voted ?? turnout.voted ?? 0);
          const eligible = Number(turnout.total_eligible ?? turnout.total ?? 0);
          const percent = turnout.percent != null ? Number(turnout.percent) : eligible > 0 ? Math.round((voted / eligible) * 100) : 0;

          const mappedPositions = (data.positions || []).map((position: any) => ({
            title: String(position.title || "Position"),
            uid: String(position.uid || ""),
            show_live_results: !!position.show_live_results,
            candidates: (position.candidates || []).map((candidate: any, index: number) => ({
              name: String(candidate.name || "Candidate"),
              votes: Number(candidate.votes ?? candidate.vote_count ?? 0),
              percentage: Number(candidate.percent ?? candidate.percentage ?? 0),
              image: candidate.image || undefined,
              color: COLORS[index % COLORS.length],
            })),
          }));
          setPositions(mappedPositions);
          setElectionTitle(String(data.election_title || data.title || selectedElectionTitle || "Live Preview"));
          setTurnoutText(`${percent}% (${voted} / ${eligible})`);
          setTurnoutData({ percent, voted, eligible });
          setGlobalShowLive(!!data.show_live_results);
          setGlobalShowFinal(!!data.show_final_results);
        }
      } catch (err) {
        setError(formatApiErrorMessage(err, "Could not load live preview."));
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreview();
  }, [selectedPublikId, selectedElectionTitle]);

  const handleToggleGlobal = async (field: "show_live_results" | "show_final_results") => {
    if (!selectedPublikId) return;
    setIsUpdating(true);
    try {
      const newValue = field === "show_live_results" ? !globalShowLive : !globalShowFinal;
      const res = await apiFetch<any>(`/election/${selectedPublikId}/update/`, {
        method: "PATCH",
        body: JSON.stringify({ [field]: newValue })
      });
      if (res.status === "success") {
        if (field === "show_live_results") setGlobalShowLive(newValue);
        else setGlobalShowFinal(newValue);
      }
    } catch (err) {
      console.error("Failed to update election visibility:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTogglePosition = async (posIdx: number) => {
    const pos = positions[posIdx];
    if (!pos.uid) return;
    setIsUpdating(true);
    try {
      const newValue = !pos.show_live_results;
      const res = await apiFetch<any>(`/election/positions/${pos.uid}/update/`, {
        method: "PATCH",
        body: JSON.stringify({ show_live_results: newValue })
      });
      if (res.status === "success") {
        const newPos = [...positions];
        newPos[posIdx].show_live_results = newValue;
        setPositions(newPos);
      }
    } catch (err) {
      console.error("Failed to update position visibility:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto space-y-6 md:space-y-8 mb-20 px-4 pt-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-xl md:text-3xl font-black text-[#101828] tracking-tight leading-tight">
            Live Preview : <span className="text-[#405189] block sm:inline">{selectedElectionTitle}</span>
          </h1>
          <div className="flex items-center gap-4">
             <Link 
               href={`/dashboard/election/voters?election=${selectedPublikId}`}
               className="group flex flex-col xs:flex-row xs:items-center gap-2 px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all w-full xs:w-auto"
             >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Turnout:</span>
                </div>
                <span className="text-sm font-black text-[#101828] group-hover:text-[#405189] transition-colors">
                    {turnoutText}
                </span>
             </Link>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-white border border-gray-100 p-4 px-6 rounded-[28px] shadow-sm">
                <Switch 
                  label="Live Results"
                  subLabel={globalShowLive ? "Public" : "Hidden"}
                  enabled={globalShowLive}
                  onChange={() => handleToggleGlobal("show_live_results")}
                  disabled={isUpdating}
                  activeColor="bg-blue-600"
                />

                <div className="hidden sm:block w-px h-6 bg-gray-100" />

                <Switch 
                  label="Final Winner"
                  subLabel={globalShowFinal ? "Visible" : "Hidden"}
                  enabled={globalShowFinal}
                  onChange={() => handleToggleGlobal("show_final_results")}
                  disabled={isUpdating}
                  activeColor="bg-indigo-900"
                />
              </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 min-w-full md:min-w-[280px]">
           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Switch Election</label>
           <div className="relative">
             <select
               value={selectedPublikId}
               onChange={(e) => setSelectedPublikId(e.target.value)}
               className="h-12 w-full appearance-none rounded-[20px] bg-white border border-gray-200 px-5 text-sm font-bold text-[#101828] shadow-sm focus:outline-none focus:border-[#405189] focus:ring-4 focus:ring-[#405189]/5 transition-all cursor-pointer pr-10"
             >
               {elections.map((item) => (
                 <option key={item.publik_id} value={item.publik_id}>
                   {item.title}
                 </option>
               ))}
             </select>
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
             </div>
           </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-[24px] border border-red-100 bg-red-50/50 p-6 flex items-center gap-4 text-red-700 animate-in fade-in slide-in-from-top-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
             <X size={20} />
          </div>
          <div>
             <p className="text-sm font-black uppercase tracking-wider">Loading Error</p>
             <p className="text-sm font-medium opacity-80">{error}</p>
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
           <div className="flex flex-col items-center gap-4 text-gray-400">
              <div className="w-12 h-12 border-4 border-gray-100 border-t-[#243160] rounded-full animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Synchronizing Results</span>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {positions.map((position, pIdx) => (
            <div
              key={`${position.title}-${pIdx}`}
              className="bg-white rounded-[40px] p-6 sm:p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-8 md:gap-12 lg:items-center relative overflow-hidden group/card"
            >
              {/* Background Accents (Hidden on small mobile) */}
              <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 bg-[#F8FAFF] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover/card:scale-110 transition-transform duration-700" />
              
              <div className="xl:w-[45%] flex flex-col gap-6 md:gap-8 relative z-10 w-full text-center xl:text-left">
                <div className="space-y-1">
                   <h2 className="text-xl md:text-3xl font-black text-[#101828] tracking-tight">{position.title}</h2>
                   <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Position Results</p>
                      <Switch 
                        label="Voter View"
                        subLabel={position.show_live_results ? "Visible" : "Hidden"}
                        enabled={position.show_live_results}
                        onChange={() => handleTogglePosition(pIdx)}
                        disabled={isUpdating}
                        activeColor="bg-blue-600"
                      />
                   </div>
                </div>
                <div className="flex-1 flex items-center justify-center py-4">
                  <PieChart candidates={position.candidates} />
                </div>
              </div>

              <div className="xl:w-[55%] flex flex-col gap-4 md:gap-6 relative z-10 w-full">
                {position.candidates.map((cand, cIdx) => (
                  <div key={`${cand.name}-${cIdx}`} className="bg-[#F8FAFF] p-4 sm:p-6 rounded-[28px] md:rounded-[32px] border border-transparent hover:border-[#405189]/20 hover:bg-white hover:shadow-xl hover:shadow-[#405189]/5 transition-all duration-300 group/cand">
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4 mb-4">
                       <div className="flex items-center gap-3 sm:gap-4">
                          <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white shadow-md">
                             <Image 
                               src={cand.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cand.name)}`} 
                               alt={cand.name} 
                               fill 
                    unoptimized
                               className="object-contain"
                               style={{ objectFit: "contain" }}
                             />
                          </div>
                          <div className="min-w-0">
                             <h3 className="text-sm sm:text-base font-black text-[#101828] group-hover/cand:text-[#405189] transition-colors truncate">{cand.name}</h3>
                             <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                                <span className="text-[10px] sm:text-xs font-black text-[#405189] whitespace-nowrap">{cand.votes} votes</span>
                                <span className="hidden xs:block w-1 h-1 rounded-full bg-gray-300" />
                                <span className="text-[10px] sm:text-xs font-bold text-gray-400 capitalize">Candidate</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center justify-between xs:justify-end xs:flex-col xs:items-end gap-2 xs:gap-0 bg-white/50 xs:bg-transparent p-2 xs:p-0 rounded-xl xs:rounded-none">
                          <span className="xs:hidden text-[9px] font-black text-gray-400 uppercase tracking-widest">Share %</span>
                          <div className="flex flex-col items-end">
                            <p className="text-lg sm:text-xl font-black text-[#101828] leading-none mb-1">{Math.round(cand.percentage)}%</p>
                            <div className={`h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden hidden xs:block`}>
                               <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${cand.percentage}%`, backgroundColor: cand.color }} />
                            </div>
                          </div>
                       </div>
                    </div>

                    <div className="h-2 w-full bg-gray-100/50 rounded-full overflow-hidden border border-white relative">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.05)]"
                        style={{ width: `${cand.percentage}%`, backgroundColor: cand.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
           <div className="w-12 h-12 border-4 border-gray-100 border-t-[#243160] rounded-full animate-spin" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Loading Preview...</span>
        </div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  );
}
