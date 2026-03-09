"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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

export default function StudentDashboard() {
  const TARGET_DATE = React.useMemo(() => new Date(Date.now() + (4 * 86400 + 20 * 3600 + 50 * 60 + 7) * 1000), []);
  const TOTAL_VOTES = 1750;
  const CURRENT_VOTES = 320;

  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 20, minutes: 50, seconds: 7 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, TARGET_DATE.getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [TARGET_DATE]);

  const units = [
    { label: "days", value: timeLeft.days, max: 7 },
    { label: "Hours", value: timeLeft.hours, max: 24 },
    { label: "minutes", value: timeLeft.minutes, max: 60 },
    { label: "seconds", value: timeLeft.seconds, max: 60 },
  ];

  const ringColor = "#5b7cfa";
  const dimColor = "#7a8fc9";

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 lg:p-14 max-w-[1600px] mx-auto min-h-screen">
      
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-[32px] font-medium text-gray-900 tracking-tight">
          Welcome <span className="font-black text-[#3457B4]">Olaniyi</span>
        </h1>
      </div>

      {/* NACOS Election Countdown Banner */}
      <div 
        className="w-full rounded-[1.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a2e6e 0%, #1e3a8a 40%, #2a4db0 100%)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <span className="text-white font-bold text-lg uppercase tracking-[0.08em]">
            NACOS Election Countdown
          </span>
          <span className="text-white font-bold text-base tracking-[0.04em]">
            Total Votes Casted
          </span>
        </div>

        {/* Gauges Row */}
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
          {/* Countdown circles */}
          <div className="flex flex-1 gap-6 md:gap-10 justify-center lg:justify-start">
            {units.map(({ label, value, max }) => (
              <div key={label} className="flex flex-col items-center">
                <CircleProgress value={value} max={max} size={110} strokeWidth={8} color={ringColor}>
                  <span className="text-white text-3xl font-bold leading-none">
                    {value}
                  </span>
                  <span className="text-[#adb5bd] text-[11px] mt-1 font-medium">{label}</span>
                </CircleProgress>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-24 bg-white/20 mx-4" />

          {/* Votes circle */}
          <div className="flex flex-col items-center">
            <CircleProgress value={CURRENT_VOTES} max={TOTAL_VOTES} size={110} strokeWidth={8} color={ringColor}>
              <span className="text-white text-3xl font-bold leading-none">
                {CURRENT_VOTES}
              </span>
              <span className="text-[#adb5bd] text-[11px] mt-1 font-medium">/{TOTAL_VOTES}</span>
            </CircleProgress>
          </div>
        </div>
      </div>

      {/* Content Sections - Vertically Stacked as per mockup */}
      <div className="bg-white rounded-[1.5rem] shadow-sm p-10 md:p-14 border border-zinc-50 space-y-16">
        
        {/* Your Details */}
        <div>
           <h3 className="text-[22px] font-semibold text-[#101828] mb-4 tracking-tight">
             Your Details
           </h3>
           <p className="text-gray-900 text-[16px] font-medium mb-10 max-w-4xl leading-relaxed">
             Verify that the below are your details. If the details are not yours,ensure you report to the electoral committee as soon as you can 
           </p>
           
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[15px] font-semibold text-black min-w-[120px]">Name :</span>
                <span className="text-[15px] font-medium text-black capitalize">Ojedokun Olaniyi</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[15px] font-semibold text-black min-w-[120px]">Matric No :</span>
                <span className="text-[15px] font-medium text-black uppercase">BU22CSC1087</span>
              </div>
           </div>
        </div>

        {/* Available Position */}
        <div className="pt-8 border-t border-zinc-100">
          <h3 className="text-[22px] font-semibold text-[#101828] mb-4 tracking-tight">
             Available Position
           </h3>
           <p className="text-gray-900 text-[16px] font-medium mb-10">
             Electoral Positions available for voting
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-20">
              {/* Column 1 */}
              <div className="space-y-4">
                {["President", "Vice President", "General Secretary", "Financial Secretary", "P.R.O 1"].map((pos, idx) => (
                  <div key={idx} className="text-[15px] font-normal text-black">{pos}</div>
                ))}
              </div>
              {/* Column 2 */}
              <div className="space-y-4">
                {["PRO 2", "Hardware Director", "Vice President", "Vice President", "Vice President"].map((pos, idx) => (
                  <div key={idx} className="text-[15px] font-normal text-black">{pos}</div>
                ))}
              </div>
           </div>
        </div>

        {/* Action Button - Centered/Left with exact CSS */}
        <div className="pt-10 flex justify-center md:justify-start">
          <Link 
            href="/student/election"
            className="text-white font-bold text-[15px] md:text-[14px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center hover:opacity-95 w-full md:w-[367px] h-12 md:h-14"
            style={{
              borderRadius: '21px', // Updated to 21px as per last mockup
              border: '1.81px solid #676767',
              background: 'linear-gradient(180deg, #3457B4 0%, #4A496A 100%)',
              boxShadow: '0 1.81px 3.619px 0 rgba(16, 24, 40, 0.05)',
              gap: '14.476px'
            }}
          >
            Proceed to Vote
          </Link>
        </div>
      </div>
    </div>
  );
}
