"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getPublicElectionDetail, apiFetch } from "@/lib/api-client";

const CircleProgress = ({ value, max, size = 120, strokeWidth = 8, color = "#4f6ef7", children }: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = max > 0 ? (value / max) * circumference : 0;
  const dash = circumference - progress;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dash}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}>
        {children}
      </div>
    </div>
  );
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const electionId = searchParams.get("election");

  const [meta, setMeta] = useState<any>(null);
  const [ballot, setBallot] = useState<any>(null);
  const [voter, setVoter] = useState({ name: "Voter", matric: "" });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setVoter({
        name: localStorage.getItem("voter_name") || "Voter",
        matric: localStorage.getItem("voter_matric") || "",
      });
    }

    if (electionId) {
      const matric = typeof window !== "undefined" ? localStorage.getItem("voter_matric") || "" : "";
      getPublicElectionDetail(electionId, matric).then(res => {
        if (res.status === "success") setMeta(res.data);
      });
      apiFetch<any>(`/election/live-preview/${electionId}/`).then(res => {
        if (res.status === "success") setBallot(res.data);
      });
    }
  }, [electionId]);

  useEffect(() => {
    const startTime = meta?.start_time ? new Date(meta.start_time).getTime() : 0;
    const endTime = meta?.end_time ? new Date(meta.end_time).getTime() : 0;
    const isOngoing = meta?.status === "ongoing";
    const isCompleted = meta?.status === "completed";

    // Target is end_time if ongoing, start_time if pending
  // Target is end_time if ongoing, start_time if pending
    const target = (isOngoing || meta?.status === "ongoing") ? endTime : startTime;
    
    if (!target) return;
    if (isCompleted || meta?.status === "completed") {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
    }

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    
    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
  }, [meta]);

  const units = [
    { label: "days", value: timeLeft.days, max: 7 },
    { label: "Hours", value: timeLeft.hours, max: 24 },
    { label: "minutes", value: timeLeft.minutes, max: 60 },
    { label: "seconds", value: timeLeft.seconds, max: 60 },
  ];

  const ringColor = "#5b7cfa";
  const isOngoing = meta?.status === "ongoing";

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 lg:p-14 max-w-[1600px] mx-auto min-h-screen font-sans">
      
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-4xl font-medium text-gray-900 tracking-tight">
          Welcome <span className="font-black text-[#3457B4]">{voter.name.split(" ")[0]}</span>
        </h1>
      </div>

      {/* Election Countdown Banner */}
      <div 
        className="w-full rounded-[1.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a2e6e 0%, #1e3a8a 40%, #2a4db0 100%)" }}
      >
        <div className="flex justify-between items-center mb-10">
          <span className="text-white font-bold text-lg uppercase tracking-[0.08em]">
            {meta?.title || "Election"} {isOngoing ? "Closes In" : "Starts In"}
          </span>
          <span className="text-white font-bold text-base tracking-[0.04em]">
            Current Participation
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="w-full grid grid-cols-2 sm:flex sm:flex-row flex-1 gap-4 md:gap-8 justify-items-center justify-center lg:justify-start">
            {units.map(({ label, value, max }) => (
              <div key={label} className="flex flex-col items-center">
                <CircleProgress value={value} max={max || 1} size={90} strokeWidth={5} color={ringColor}>
                  <span className="text-white text-xl md:text-2xl font-black leading-none tracking-tighter">
                    {value}
                  </span>
                  <span className="text-[#adb5bd] text-[8px] md:text-[10px] mt-1 font-bold uppercase tracking-widest">{label}</span>
                </CircleProgress>
              </div>
            ))}
          </div>

          <div className="hidden lg:block w-px h-16 bg-white/10 mx-2" />

          <div className="flex flex-col items-center pt-6 lg:pt-0 border-t lg:border-t-0 border-white/10 w-full lg:w-auto">
            <span className="lg:hidden text-[9px] font-black text-[#adb5bd] uppercase tracking-widest mb-4">Total Turnout</span>
            <CircleProgress 
                value={ballot?.total_voted || ballot?.turnout?.total_voted || 0} 
                max={ballot?.total_eligible || ballot?.turnout?.total_eligible || meta?.total_eligible_voters || 100} 
                size={90} 
                strokeWidth={5} 
                color="#FE9431"
            >
              <span className="text-white text-xl md:text-2xl font-black leading-none">
                {ballot?.total_voted || ballot?.turnout?.total_voted || 0}
              </span>
              <span className="text-[#adb5bd] text-[8px] md:text-[10px] mt-1 font-bold">
                /{ballot?.total_eligible || ballot?.turnout?.total_eligible || meta?.total_eligible_voters || "?"}
              </span>
            </CircleProgress>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm p-10 md:p-14 border border-zinc-50 space-y-16">
        
        <div>
           <h3 className="text-2xl font-semibold text-[#101828] mb-4 tracking-tight">
             Your Details
           </h3>
           <p className="text-gray-900 text-base font-medium mb-10 max-w-4xl leading-relaxed">
             Verify that the below are your details. If the details are not yours, ensure you report to the electoral committee as soon as you can 
           </p>
           
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold text-black min-w-[120px]">Name:</span>
                <span className="text-base font-medium text-black capitalize">{voter.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold text-black min-w-[120px]">Matric No:</span>
                <span className="text-base font-medium text-black uppercase">{voter.matric}</span>
              </div>
              {meta?.voter_status?.has_voted && (
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-100 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Election Completed (for you)</span>
                  </div>
                </div>
              )}
           </div>
        </div>

        <div className="pt-8 border-t border-zinc-100">
          <h3 className="text-2xl font-semibold text-[#101828] mb-4 tracking-tight">
             Available Position
           </h3>
           <p className="text-gray-900 text-base font-medium mb-10">
             Electoral Positions available for voting
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-20">
              {ballot?.positions?.map((pos: any, idx: number) => (
                <div key={idx} className="text-base font-normal text-black">{pos.title}</div>
              )) || (
                <div className="text-gray-400">Loading positions...</div>
              )}
           </div>
        </div>

        <div className="pt-10 flex justify-center md:justify-start">
          <Link 
            href={meta?.voter_status?.has_voted ? `/student/preview?election=${electionId}` : `/student/election?election=${electionId}`}
            className="text-white font-bold text-sm md:text-base uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center hover:opacity-95 w-full md:w-[367px] h-12 md:h-14"
            style={{
              borderRadius: '21px',
              border: '1.81px solid #676767',
              background: 'linear-gradient(180deg, #3457B4 0%, #4A496A 100%)',
              boxShadow: '0 1.81px 3.619px 0 rgba(16, 24, 40, 0.05)',
              gap: '14.476px'
            }}
          >
            {meta?.voter_status?.has_voted ? "View Live Results" : "Proceed to Vote"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
