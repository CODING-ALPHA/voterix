"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Calendar, 
  Clock, 
  Upload, 
  ChevronDown, 
  Plus, 
  Trash2, 
  UserPlus,
  ArrowLeft,
  X,
  MoreHorizontal,
  CheckCircle2
} from "lucide-react";

// --- Sub-components ---

const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl w-full max-w-[500px] p-6 flex flex-col items-center text-center shadow-2xl animate-in slide-in-from-bottom-5 sm:slide-in-from-top-5 duration-300">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Success Icon */}
        <div className="mb-5 relative">
           <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                 <CheckCircle2 size={20} className="text-white" />
              </div>
           </div>
        </div>

        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
          Election Added Successfully
        </h2>

        {/* Link Input Container */}
        <div className="w-full relative mb-3">
           <input 
             type="text" 
             readOnly
             value="http://ww.voterix.com/voters/eligibility"
             className="w-full bg-[#f8f9fc] border border-gray-200 h-10 px-3 rounded-lg text-xs sm:text-sm font-semibold text-[#405189] focus:outline-none pr-10"
           />
           <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-900">
             <MoreHorizontal size={16} />
           </button>
        </div>
        
        <p className="text-gray-500 font-medium text-[10px] sm:text-[11px] mb-6 italic">
          Use the link above to check for Voter's Eligibility
        </p>

        <button 
          onClick={onClose}
          className="w-full h-10 bg-[#405189] text-white rounded-lg font-medium text-sm hover:opacity-90 transition-all shadow-md"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function AddElectionPage() {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form State
  const [positions, setPositions] = useState([
    { id: 1, title: "", description: "", candidates: [{ id: 1, name: "", image: null }] }
  ]);

  const addPosition = () => {
    setPositions([...positions, { 
      id: Date.now(), 
      title: "", 
      description: "", 
      candidates: [{ id: Date.now() + 1, name: "", image: null }] 
    }]);
  };

  const removePosition = (id: number) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  const addCandidate = (positionId: number) => {
    setPositions(positions.map(p => {
      if (p.id === positionId) {
        return { ...p, candidates: [...p.candidates, { id: Date.now(), name: "", image: null }] };
      }
      return p;
    }));
  };

  const removeCandidate = (positionId: number, candidateId: number) => {
    setPositions(positions.map(p => {
      if (p.id === positionId) {
        return { ...p, candidates: p.candidates.filter(c => c.id !== candidateId) };
      }
      return p;
    }));
  };

  const handleSave = () => {
    setShowSuccess(true);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold text-gray-900">
          {step === 1 ? "Add New Election" : "Positions & Candidates"}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        {step === 1 ? (
          /* STEP 1: General Details */
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-gray-900 font-medium text-xs">Election Title</label>
              <input
                type="text"
                placeholder="e.g. NACOS DECIDES 25/26"
                className="w-full bg-white border border-gray-300 h-10 px-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-900 font-medium text-xs">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="DD / MM / YYYY"
                  className="w-full bg-white border border-gray-300 h-10 pl-10 pr-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-900 font-medium placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-gray-900 font-medium text-xs">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select className="w-full bg-white border border-gray-300 h-10 pl-10 pr-8 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-900 font-medium appearance-none">
                    <option disabled selected>Select Start Time</option>
                    <option>10:00AM</option>
                    <option>11:00AM</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-900 font-medium text-xs">End Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select className="w-full bg-white border border-gray-300 h-10 pl-10 pr-8 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-900 font-medium appearance-none">
                    <option disabled selected>Select End Time</option>
                    <option>10:00PM</option>
                    <option>11:00PM</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-900 font-medium text-xs">Add/Upload Spreadsheet</label>
              <button className="flex items-center gap-2 h-10 px-4 border border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all w-fit text-sm">
                <Upload size={16} />
                <span>.xlc</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Link
                href="/dashboard/elections"
                className="h-10 px-8 rounded-lg border border-gray-300 font-semibold text-gray-600 hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
              >
                Cancel
              </Link>
              <button
                onClick={() => setStep(2)}
                className="h-10 px-8 rounded-lg bg-[#405189] text-white font-medium hover:opacity-90 transition-all shadow-md text-sm"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: Positions & Candidates */
          <div className="space-y-10">
            {positions.map((pos, idx) => (
              <div key={pos.id} className="space-y-5 pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Position {idx + 1}</h3>
                  <button 
                    onClick={() => removePosition(pos.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-gray-900 font-medium text-xs">Position Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. President"
                      className="w-full bg-white border border-gray-300 h-10 px-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-900 font-medium placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-gray-900 font-medium text-xs">Description</label>
                    <input
                      type="text"
                      placeholder="e.g. The lead executive of the association"
                      className="w-full bg-white border border-gray-300 h-10 px-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-900 font-medium placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <h4 className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Candidates ({pos.candidates.length})</h4>
                     <button 
                       onClick={() => addCandidate(pos.id)}
                       className="flex items-center gap-1.5 text-gray-900 font-semibold text-xs hover:text-[#405189] transition-colors"
                     >
                       <UserPlus size={16} />
                       Add Candidate
                     </button>
                   </div>

                   <div className="space-y-2.5">
                     {pos.candidates.map((cand, cIdx) => (
                       <div key={cand.id} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-50/50 p-2 md:p-3 rounded-lg border border-gray-200/50">
                         <div className="flex items-center gap-3 flex-1">
                           <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-[#405189] font-bold text-[11px] shrink-0">
                             {cIdx + 1}
                           </div>
                           <input
                             type="text"
                             placeholder="e.g. Ojedokun Olaniyi"
                             className="flex-1 bg-white border border-gray-300 h-9 px-3 rounded-lg text-sm focus:outline-none text-gray-900 font-medium placeholder:text-gray-400"
                           />
                         </div>
                         <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
                           <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 h-9 px-3 bg-white border border-gray-300 rounded-lg text-gray-500 font-semibold hover:border-gray-400 transition-all">
                             <Upload size={14} />
                             <span className="text-[10px]">.jpeg</span>
                           </button>
                           <button 
                             onClick={() => removeCandidate(pos.id, cand.id)}
                             className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                           >
                             <Trash2 size={14} />
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-1">
              <button 
                onClick={addPosition}
                className="flex items-center gap-1.5 border border-[#405189] text-[#405189] h-9 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-sm text-xs"
              >
                <Plus size={14} strokeWidth={2} />
                Add Position
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 pt-8">
              <button
                onClick={() => setStep(1)}
                className="h-10 px-8 rounded-lg border border-gray-300 font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                className="h-10 px-8 rounded-lg bg-[#405189] text-white font-medium hover:opacity-90 transition-all shadow-md text-sm"
              >
                Save Election
              </button>
            </div>
          </div>
        )}
      </div>

      <SuccessModal 
        isOpen={showSuccess} 
        onClose={() => {
          setShowSuccess(false);
          window.location.href = "/dashboard/elections";
        }} 
      />
    </div>
  );
}
