"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowUpDown, Plus, MoreHorizontal } from "lucide-react";
import EditElectionModal from "@/components/EditElectionModal";

export default function ElectionsPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState<any>(null);
  
  const [elections] = useState([
    {
      id: 1,
      name: "NACOS 25/26",
      initials: "NA",
      date: "27/05/26",
      startTime: "12:00 AM",
      endTime: "5:00 PM",
      status: "Pending",
    },
  ]);

  // For UI demonstration, we can toggle this
  const isEmpty = elections.length === 0;

  const handleEdit = (election: any) => {
    setSelectedElection(election);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-lg md:text-xl font-semibold text-gray-900">Elections</h1>
        
        {!isEmpty && (
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search Elections..."
                className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 transition-colors text-sm font-medium text-gray-900 placeholder:text-gray-500"
              />
            </div>

            {/* Sort Button */}
            <button className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-300 bg-white text-gray-600 font-semibold hover:bg-gray-50 transition-colors text-sm shadow-sm">
              <span className="text-gray-900">Sort</span>
              <ArrowUpDown size={14} />
            </button>

            {/* Add Election Button */}
            <Link
              href="/dashboard/elections/add"
              className="flex items-center gap-2 bg-[#1C1F26] text-white h-10 px-4 rounded-lg font-medium hover:bg-black transition-all shadow-md"
            >
              <Plus size={16} strokeWidth={2} />
              Add Election
            </Link>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className={`${isEmpty ? "bg-white border border-gray-200 shadow-sm rounded-xl" : "bg-transparent md:bg-white md:border md:border-gray-200 md:shadow-sm md:rounded-xl"} min-h-[400px] md:min-h-[500px] overflow-hidden p-0 transition-all duration-300`}>
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center mt-8 md:mt-12">
            {/* Central Illustration */}
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-50 rounded-full flex items-center justify-center mb-6 md:mb-8 overflow-hidden">
               <Image 
                 src="/users-03.svg"
                 alt="No Elections"
                 width={48}
                 height={48}
                 className="opacity-40"
               />
            </div>

            <h3 className="text-gray-900 text-base md:text-lg font-semibold mb-2 tracking-tight">
              No Election created at this time
            </h3>
            <p className="text-gray-500 font-medium max-w-[280px] leading-relaxed mb-6 md:mb-8 text-[11px] md:text-xs">
              Create election for your institution to see election here
            </p>

            <Link
              href="/dashboard/elections/add"
              className="flex items-center gap-2 bg-[#405189] text-white h-10 px-6 rounded-lg font-medium hover:opacity-90 transition-all shadow-md"
            >
              <Plus size={16} strokeWidth={2} />
              Create Election
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4">
              {elections.map((election) => (
                <div key={election.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {election.initials}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{election.name}</h3>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">{election.date}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#FFFAF0] px-2.5 py-1 text-[11px] font-semibold text-[#FE9431] border border-[#FE9431]/20">
                      {election.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-1">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Start Time</p>
                      <p className="mt-1 text-xs font-semibold text-gray-700">{election.startTime}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">End Time</p>
                      <p className="mt-1 text-xs font-semibold text-gray-700">{election.endTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-gray-50 pt-4">
                    <button 
                      onClick={() => handleEdit(election)}
                      className="flex-1 h-9 rounded-lg bg-[#1C1F26] text-white text-xs font-semibold hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                      Edit Election
                    </button>
                    <button className="h-9 w-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Start time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">End time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right">
                      <button className="p-1.5 hover:bg-gray-50 rounded-md">
                        <MoreHorizontal size={16} className="text-gray-500" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {elections.map((election) => (
                    <tr key={election.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px]">
                            {election.initials}
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">{election.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm font-medium text-gray-600">{election.date}</td>
                      <td className="px-6 py-3.5 text-sm font-medium text-gray-600">{election.startTime}</td>
                      <td className="px-6 py-3.5 text-sm font-medium text-gray-600">{election.endTime}</td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FFFAF0] text-[#FE9431] border border-[#FFFAF0]">
                          {election.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button 
                          onClick={() => handleEdit(election)}
                          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <MoreHorizontal size={16} className="text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <EditElectionModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        election={selectedElection}
      />
    </div>
  );
}
