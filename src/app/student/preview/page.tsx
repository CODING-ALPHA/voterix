import React from "react";
import Image from "next/image";

export default function StudentPreview() {

  const positions = [
    {
      id: "president",
      title: "President",
      candidates: [
        { id: "p1", name: "OJEDOKUN OLANIYI", image: "/auth2.png", votes: 44, percentage: 65 },
        { id: "p2", name: "AYOMIDE JOHN", image: "/auth3.png", votes: 24, percentage: 35 },
      ]
    },
    {
      id: "vice_president",
      title: "Vice-President",
      candidates: [
        { id: "vp1", name: "SARAH WILLIAMS", image: "/auth4.png", votes: 50, percentage: 80 },
        { id: "vp2", name: "DAVID SMITH", image: "/office.png", votes: 12, percentage: 20 },
      ]
    },
    {
      id: "general_secretary",
      title: "General Secretary",
      candidates: [
        { id: "gs1", name: "EMMANUEL TAIWO", image: "/auth2.png", votes: 34, percentage: 45 },
        { id: "gs2", name: "MARY JANE", image: "/auth3.png", votes: 41, percentage: 55 },
      ]
    }
  ];

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto min-h-screen">
      {/* Page Header */}
      <div className="mb-8 pt-4">
        <h1 className="text-lg md:text-xl font-semibold text-gray-900 mb-0.5">
          Election <span className="text-[#3457B4]">Results</span>
        </h1>
        <p className="text-gray-500 text-[11px] md:text-xs font-medium">
          Live real-time monitoring of the ongoing NACOS election.
        </p>
      </div>

      {/* Container Card */}
      <div 
        className="bg-white rounded-[35px] p-8 md:p-12 border border-blue-50/50 flex flex-col min-h-[70vh]"
        style={{ boxShadow: "0px 10px 40px -10px rgba(54, 74, 99, 0.08)" }}
      >
        
        {/* Positions and Results */}
        <div className="flex-1 space-y-16 max-w-5xl w-full">
          {positions.map((position) => (
            <div key={position.id} className="relative">
               {/* Position Title */}
               <div className="mb-10 flex items-center gap-4">
                <div className="h-6 w-1 bg-[#3457B4] rounded-full" />
                <h2 className="text-black font-bold text-[22px] tracking-tight uppercase">
                  {position.title}
                </h2>
              </div>

              {/* Candidates Progress Bars */}
              <div className="space-y-10">
                {position.candidates.map((candidate) => (
                  <div key={candidate.id} className="flex flex-col gap-4">
                    
                    {/* Header: Info & Votes (LEGIBILITY FIX: Text outside bar) */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md relative shrink-0">
                          <Image 
                            src={candidate.image}
                            alt={candidate.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[#FF4D4C] uppercase tracking-[0.2em] mb-0.5">Candidate</span>
                          <span className="text-[15px] font-black text-[#101828] uppercase tracking-tight">
                            {candidate.name}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Votes</span>
                        <div className="flex items-center gap-3">
                           <span className="text-[15px] font-black text-gray-900 uppercase">
                            {candidate.votes} VOTES
                          </span>
                          <div className="h-4 w-px bg-zinc-200" />
                          <span className="text-[15px] font-black text-[#3457B4]">
                            {candidate.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar (Gradient) */}
                    <div className="relative w-full h-[12px] bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
                      <div 
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(52,87,180,0.2)]" 
                        style={{ 
                          width: `${candidate.percentage}%`,
                          background: 'linear-gradient(90deg, #3457B4 0%, #4A496A 100%)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
