"use client";

import React from "react";
import Image from "next/image";

interface Candidate {
  name: string;
  votes: number;
  percentage: number;
  color: string;
}

interface PositionResult {
  title: string;
  candidates: Candidate[];
}

const previewData: PositionResult[] = [
  {
    title: "President",
    candidates: [
      { name: "Olaniyi ojedokun", votes: 107, percentage: 72, color: "#243160" },
      { name: "Aanu Adigun", votes: 84, percentage: 24, color: "#5E6993" },
      { name: "Emmanuel Jesubamirin", votes: 12, percentage: 4, color: "#94A3B8" },
    ],
  },
  {
    title: "General Secretary",
    candidates: [
      { name: "Olaniyi ojedokun", votes: 107, percentage: 72, color: "#243160" },
      { name: "Aanu Adigun", votes: 84, percentage: 24, color: "#5E6993" },
      { name: "Emmanuel Jesubamirin", votes: 12, percentage: 4, color: "#94A3B8" },
    ],
  },
  {
    title: "Asst.General Secretary",
    candidates: [
      { name: "Olaniyi ojedokun", votes: 107, percentage: 72, color: "#243160" },
      { name: "Aanu Adigun", votes: 84, percentage: 24, color: "#5E6993" },
      { name: "Emmanuel Jesubamirin", votes: 12, percentage: 4, color: "#94A3B8" },
    ],
  },
];

const PieChart = ({ candidates }: { candidates: Candidate[] }) => {
  let accumulatedPercentage = 0;
  
  return (
    <div className="relative w-full aspect-square max-w-[180px] md:max-w-[220px] mx-auto group">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {candidates.map((cand, i) => {
          const startPercentage = accumulatedPercentage;
          accumulatedPercentage += cand.percentage;
          
          const startAngle = (startPercentage / 100) * 360;
          const endAngle = (accumulatedPercentage / 100) * 360;
          
          const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);
          
          const largeArcFlag = cand.percentage > 50 ? 1 : 0;
          
          const midAngle = startAngle + (endAngle - startAngle) / 2;
          const lx = 50 + 32 * Math.cos((midAngle * Math.PI) / 180);
          const ly = 50 + 32 * Math.sin((midAngle * Math.PI) / 180);
          
          return (
            <React.Fragment key={i}>
              <path
                d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={cand.color}
                className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                stroke="white"
                strokeWidth="0.5"
              />
              <text 
                x={lx} 
                y={ly} 
                fill="white" 
                fontSize="4" 
                fontWeight="900" 
                textAnchor="middle" 
                dominantBaseline="middle"
                className="pointer-events-none transform rotate-90 select-none opacity-90"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              >
                {cand.percentage}%
              </text>
            </React.Fragment>
          );
        })}
      </svg>
    </div>
  );
};

export default function PreviewPage() {
  return (
    <div className="flex flex-col gap-6 mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Live Preview : <span className="text-gray-600 font-semibold">NACOS DECIDES 24/25</span>
        </h1>
        <p className="text-gray-500 font-medium text-sm mt-1">
          Total Voted : <span className="text-gray-900 font-bold">195 votes</span>
        </p>
      </div>

      {/* Results Content */}
      <div className="flex flex-col gap-5">
        {previewData.map((position, pIdx) => (
          <div key={pIdx} className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-8 lg:items-center">
            
            {/* Left Column: Title & Chart */}
            <div className="lg:w-[45%] flex flex-col gap-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900">{position.title}</h2>
              <div className="flex-1 flex items-center justify-center py-2">
                <PieChart candidates={position.candidates} />
              </div>
            </div>

            {/* Right Column: Candidates List */}
            <div className="lg:w-[55%] flex flex-col gap-6">
              {position.candidates.map((cand, cIdx) => (
                <div key={cIdx} className="space-y-3">
                  <div className="flex items-center gap-3">
                    {/* Placeholder Avatar */}
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0 relative">
                       <Image 
                         src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cand.name)}`}
                         alt={cand.name}
                         fill
                         className="object-cover"
                       />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-none mb-1">{cand.name}</h3>
                      <p className="text-[11px] font-semibold text-gray-500">{cand.votes} votes</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${cand.percentage}%`, 
                          backgroundColor: cand.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
