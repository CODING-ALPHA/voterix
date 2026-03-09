"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Search, 
  ArrowUpDown, 
  Plus, 
  MoreHorizontal, 
  Upload, 
  X, 
  ChevronLeft,
  MessageSquare
} from "lucide-react";

// --- Components ---

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-8 pb-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center bg-[#F0F5FF] text-[#405189] rounded-xl hover:bg-[#E5EEFF] transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div className="px-8 pb-10">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

export default function VotersPage() {
  const [view, setView] = useState<"selection" | "voters">("selection");
  const [selectedElection, setSelectedElection] = useState<any>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock Data
  const [elections] = useState([
    { id: 1, name: "NACOS 25/26", initials: "NA", votersCount: 150 },
    { id: 2, name: "NACOS AWARDS 24/25", initials: "NA", votersCount: 150 },
    { id: 3, name: "BOWEN AWARDS 24/25", initials: "NA", votersCount: 150 },
    { id: 4, name: "NACOS 25/26", initials: "NA", votersCount: 150 },
    { id: 5, name: "NACOS 25/26", initials: "NA", votersCount: 150 },
  ]);

  const [voters] = useState([
    { 
      id: 1, 
      name: "Ojedele Oluwatomiwa", 
      matric: "BU22CSC1087", 
      email: "ojedeleoluwatomiwa@gmail.com", 
      phone: "09015245214", 
      status: "Verified" 
    },
    { 
      id: 2, 
      name: "Ojedele Oluwatomiwa", 
      matric: "BU22CSC1087", 
      email: "ojedeleoluwatomiwa@gmail.com", 
      phone: "09015245214", 
      status: "Warning" 
    },
    { 
      id: 3, 
      name: "Ojedele Oluwatomiwa", 
      matric: "BU22CSC1087", 
      email: "ojedeleoluwatomiwa@gmail.com", 
      phone: "09015245214", 
      status: "Suspicious" 
    },
  ]);

  const handleSelectElection = (election: any) => {
    setSelectedElection(election);
    setView("voters");
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-[#E7F9ED] text-[#28C76F] border-[#E7F9ED]";
      case "Warning":
        return "bg-[#FFF4E5] text-[#FF9F43] border-[#FFF4E5]";
      case "Suspicious":
        return "bg-[#FFEDED] text-[#EA5455] border-[#FFEDED]";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {view === "voters" && (
            <button 
              onClick={() => setView("selection")}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500 mr-2"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            {view === "selection" ? "Voters" : `${selectedElection?.name} Voters`}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search Voters..."
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 transition-colors text-sm font-medium text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Sort Button */}
          <button className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm shadow-sm">
            <span>Sort</span>
            <ArrowUpDown size={14} />
          </button>

          {/* Action Button */}
          {view === "selection" ? (
            <button className="flex items-center gap-2 bg-[#1C1F26] text-white h-10 px-4 rounded-lg font-medium hover:bg-black transition-all shadow-md">
              <Plus size={16} strokeWidth={2} />
              Add Election
            </button>
          ) : (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-[#1C1F26] text-white h-10 px-4 rounded-lg font-medium hover:bg-black transition-all shadow-md"
            >
              <Plus size={16} strokeWidth={2} />
              Add Voters
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`min-h-[500px] transition-all duration-300`}>
        {view === "selection" ? (
          <>
            {/* Desktop Selection Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 text-gray-400">
                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider">Number of Voter</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {elections.map((election) => (
                    <tr 
                      key={election.id} 
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                      onClick={() => handleSelectElection(election)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                            {election.initials}
                          </div>
                          <span className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{election.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-600">
                        {election.votersCount}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 hover:bg-white rounded-md transition-colors shadow-sm">
                          <MoreHorizontal size={16} className="text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Selection Cards */}
            <div className="md:hidden space-y-4">
              {elections.map((election) => (
                <div 
                  key={election.id} 
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4 active:scale-[0.98] transition-all"
                  onClick={() => handleSelectElection(election)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {election.initials}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{election.name}</h3>
                        <p className="text-[11px] text-gray-400 font-medium">Click to manage voters</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Voters</p>
                      <p className="text-sm font-bold text-gray-900">{election.votersCount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Voters Detail View */
          <div className="flex flex-col h-full">
            {voters.length === 0 ? (
              /* Empty State (No CSV) */
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col items-center justify-center p-12 text-center min-h-[450px]">
                <div className="w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center mb-8 relative">
                   <div className="absolute inset-0 bg-gray-100 rounded-full scale-110 opacity-50 animate-pulse" />
                   <div className="relative">
                      <Image 
                        src="/users-03.svg"
                        alt="No Voters"
                        width={64}
                        height={64}
                        className="opacity-20"
                      />
                   </div>
                </div>
                <h3 className="text-gray-900 text-xl font-bold mb-2">No Spreadsheet Uploaded</h3>
                <p className="text-gray-500 font-medium max-w-sm mb-8 leading-relaxed">
                  Add CSV to your institution to see CSV here.
                </p>
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-2 bg-[#1C1F26] text-white h-11 px-8 rounded-xl font-semibold hover:bg-black transition-all shadow-lg active:scale-95"
                >
                  <Upload size={18} strokeWidth={2.5} />
                  Upload CSV
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Voters Table */}
                <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-50 text-gray-400">
                        <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider">Matric_No</th>
                        <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider">Phone Number</th>
                        <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {voters.map((voter) => (
                        <tr key={voter.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-900 text-sm">{voter.name}</span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-500">{voter.matric}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-500">{voter.email}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-500">{voter.phone}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(voter.status)}`}>
                              {voter.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               {voter.status !== "Verified" && (
                                  <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors shadow-sm">
                                    <MessageSquare size={16} fill="currentColor" />
                                  </button>
                               )}
                               <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                                 <MoreHorizontal size={18} className="text-gray-400" />
                               </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Voters Cards */}
                <div className="md:hidden space-y-4">
                  {voters.map((voter) => (
                    <div key={voter.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{voter.name}</h3>
                          <p className="text-[11px] text-gray-500 font-medium mt-0.5">{voter.matric}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${getStatusStyle(voter.status)}`}>
                          {voter.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 py-1">
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Email</p>
                          <p className="mt-0.5 text-xs font-semibold text-gray-700 truncate">{voter.email}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Phone Number</p>
                          <p className="mt-0.5 text-xs font-semibold text-gray-700">{voter.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                        {voter.status !== "Verified" && (
                          <button className="flex-1 h-9 rounded-lg bg-green-50 text-green-600 text-xs font-bold hover:bg-green-100 transition-all flex items-center justify-center gap-2 border border-green-100">
                            <MessageSquare size={14} fill="currentColor" />
                            Notify WhatsApp
                          </button>
                        )}
                        <button className="h-9 px-4 rounded-lg bg-gray-50 text-gray-500 text-xs font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                          View Details
                        </button>
                        <button className="h-9 w-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* --- Modals --- */}

      {/* Upload CSV Modal */}
      <Modal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        title="Upload CSV"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">CSV Title</label>
            <input 
              type="text" 
              placeholder="e.g NACOS DECIDES STUDENTS"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#405189]/10 focus:border-[#405189] transition-all font-medium text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Upload Spreadsheet</label>
            <div className="h-14 px-4 border border-gray-200 rounded-xl flex items-center gap-3 transition-colors cursor-pointer bg-white">
               <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg shadow-sm flex items-center justify-center">
                  <Upload size={18} className="text-gray-400" />
               </div>
               <span className="text-sm font-medium text-gray-400">.xlc</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
             <button 
              onClick={() => setIsUploadModalOpen(false)}
              className="h-12 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all"
             >
               Cancel
             </button>
             <button className="h-12 rounded-xl bg-[#405189] text-white font-bold shadow-lg hover:opacity-90 transition-all">
               Add
             </button>
          </div>
        </div>
      </Modal>

      {/* Manual Add Voter Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Voter"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Name</label>
            <input 
              type="text" 
              placeholder="e.g. Ojedokun Olaniyi"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#405189]/10 focus:border-[#405189] transition-all font-medium text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Matric_No</label>
            <input 
              type="text" 
              placeholder="e.g. BU22CSC1087"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#405189]/10 focus:border-[#405189] transition-all font-medium text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input 
              type="email" 
              placeholder="e.g. example@gmail.com"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#405189]/10 focus:border-[#405189] transition-all font-medium text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Phone</label>
            <input 
              type="tel" 
              placeholder="e.g. 09012345678"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#405189]/10 focus:border-[#405189] transition-all font-medium text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
             <button 
              onClick={() => setIsAddModalOpen(false)}
              className="h-12 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all"
             >
               Cancel
             </button>
             <button className="h-12 rounded-xl bg-[#405189] text-white font-bold shadow-lg hover:opacity-90 transition-all">
               Add
             </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
