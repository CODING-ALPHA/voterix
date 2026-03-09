"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function StudentElection() {
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({});

  const handleSelect = (position: string, candidateId: string) => {
    setSelectedCandidates(prev => ({
      ...prev,
      [position]: candidateId
    }));
  };

  const positions = [
    {
      id: "president",
      title: "President",
      candidates: [
        { id: "p1", name: "OJEDOKUN OLANIYI", image: "/auth2.png" },
        { id: "p2", name: "AYOMIDE JOHN", image: "/auth3.png" },
        { id: "p3", name: "SARAH WILLIAMS", image: "/auth4.png" },
      ]
    },
    {
      id: "vice_president",
      title: "Vice-President",
      candidates: [
        { id: "vp1", name: "EMMANUEL TAIWO", image: "/office.png" },
        { id: "vp2", name: "DAVID SMITH", image: "/auth2.png" },
        { id: "vp3", name: "MARY JANE", image: "/auth3.png" },
      ]
    },
    {
      id: "general_secretary",
      title: "General Secretary", // Keeping correct spelling unless user explicitly wants the typo "Geneeal"
      candidates: [
        { id: "gs1", name: "CHIDI OPARA", image: "/auth4.png" },
        { id: "gs2", name: "SUCCESS ADE", image: "/office.png" },
        { id: "gs3", name: "BLESSING OKON", image: "/auth2.png" },
      ]
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-6 md:p-10 lg:p-12">
      {/* Page Header */}
      <div className="mb-8 max-w-[1400px] mx-auto pt-4">
        <h1 className="text-lg md:text-xl font-semibold text-gray-900 mb-0.5">
          Election <span className="text-[#3457B4]">Voting</span>
        </h1>
        <p className="text-gray-500 text-[11px] md:text-xs font-medium">
          Select your preferred candidates and cast your vote securely.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-6 pb-6">
        {positions.map((position) => (
          <div 
            key={position.id} 
            className="bg-white rounded-xl p-8 md:p-10 shadow-sm border border-gray-100"
          >
            {/* Position Header */}
            <h2 className="text-gray-900 font-semibold text-base mb-8 uppercase tracking-wider">
              {position.title}
            </h2>

            {/* Candidates Grid - 3 columns as per audit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {position.candidates.map((candidate) => {
                const isSelected = selectedCandidates[position.id] === candidate.id;
                return (
                  <div 
                    key={candidate.id}
                    onClick={() => handleSelect(position.id, candidate.id)}
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
                      <Image
                        src={candidate.image}
                        alt={candidate.name}
                        fill
                        className="object-cover"
                      />
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
          className="text-white font-bold text-[15px] md:text-[14px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center hover:opacity-95 w-full md:w-[367px] h-12 md:h-14 px-8"
          style={{
            borderRadius: '21px', // Updated to match dashboard standard
            border: '1.81px solid #676767',
            background: 'linear-gradient(180deg, #3457B4 0%, #4A496A 100%)',
            boxShadow: '0 1.81px 3.619px 0 rgba(16, 24, 40, 0.05)',
            gap: '14.476px'
          }}
        >
          Cast Vote
        </button>
      </div>
    </div>
  );
}
