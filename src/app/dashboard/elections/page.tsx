"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowUpDown, Plus, MoreHorizontal, Link as LinkIcon, Copy, Check, Users } from "lucide-react";
import EditElectionModal from "@/components/EditElectionModal";
import ManageCandidatesModal from "@/components/ManageCandidatesModal";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api-client";

export default function ElectionsPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState<any>(null);
  const [elections, setElections] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { accessToken, user } = useAuth();

  const fetchElections = async () => {
    try {
      const result = await apiFetch<any>("/election/");
      if (result.status === "success") {
        const formattedElections = result.data.map((el: any) => ({
          id: el.uid,
          uid: el.uid,
          publik_id: el.publik_id,
          name: el.title,
          initials: el.title.substring(0, 2).toUpperCase(),
          date: new Date(el.start_time).toLocaleDateString(),
          startTime: new Date(el.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          endTime: new Date(el.end_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          start_time: el.start_time,
          end_time: el.end_time,
          status: `${el.status.charAt(0).toUpperCase()}${el.status.slice(1)}`,
        }));
        setElections(formattedElections);
      }
    } catch (error) {
      console.error("Failed to fetch elections", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchElections();
    }
  }, [accessToken]);

  const filteredElections = elections.filter(el =>
    el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    el.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isEmpty = elections.length === 0;
  const isFilterEmpty = !isEmpty && filteredElections.length === 0;

  const handleEdit = (election: any) => {
    setSelectedElection(election);
    setIsEditModalOpen(true);
  };

  const handleManageCandidates = (election: any) => {
    setSelectedElection(election);
    setIsManageModalOpen(true);
  };

  const handleCopyLink = (election: any) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const assocId = user?.publik_id || "";

    // Format: /student/verify?assoc=ASSOC_ID&election=ELECT_ID
    const link = `${baseUrl}/student/verify?assoc=${assocId}&election=${election.publik_id}`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedId(election.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
      <div className={`${(isEmpty || isLoading) ? "bg-white border border-gray-200 shadow-sm rounded-xl" : "bg-transparent md:bg-white md:border md:border-gray-200 md:shadow-sm md:rounded-xl"} min-h-[400px] md:min-h-[500px] overflow-hidden p-0 transition-all duration-300 flex flex-col`}>
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium text-sm animate-pulse">Loading elections...</p>
          </div>
        ) : isEmpty ? (
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
            <p className="text-gray-500 font-medium max-w-[280px] leading-relaxed mb-6 md:mb-8 text-xs">
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
        ) : isFilterEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-gray-500 font-medium">No elections match "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-blue-600 text-sm font-semibold hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4 p-4">
              {filteredElections.map((election) => (
                <div key={election.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {election.initials}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{election.name}</h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{election.date}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#FFFAF0] px-2.5 py-1 text-xs font-semibold text-[#FE9431] border border-[#FE9431]/20">
                      {election.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                    <p className="text-[10px] font-medium text-gray-500 truncate flex-1 leading-none">
                      {window.location.origin}/student/verify?assoc={user?.publik_id}&election={election.publik_id}
                    </p>
                    <button
                      onClick={() => handleCopyLink(election)}
                      className="text-indigo-600 hover:text-indigo-700 transition-colors shrink-0"
                    >
                      {copiedId === election.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-1">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Start Time</p>
                      <p className="mt-1 text-xs font-semibold text-gray-700">{election.startTime}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">End Time</p>
                      <p className="mt-1 text-xs font-semibold text-gray-700">{election.endTime}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleManageCandidates(election)}
                        className="flex-1 h-9 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Users size={14} />
                        Candidates
                      </button>
                      <button
                        onClick={() => handleEdit(election)}
                        className="flex-1 h-9 rounded-lg bg-[#1C1F26] text-white text-xs font-semibold hover:bg-black transition-all flex items-center justify-center gap-2"
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider w-full">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Start time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">End time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left">
                      <button className="p-1.5 hover:bg-gray-50 rounded-md">
                        <MoreHorizontal size={16} className="text-gray-500" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredElections.map((election) => (
                    <tr key={election.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5 w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                            {election.initials}
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">{election.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm font-medium text-gray-600">{election.date}</td>
                      <td className="px-6 py-3.5 text-sm font-medium text-gray-600">{election.startTime}</td>
                      <td className="px-6 py-3.5 text-sm font-medium text-gray-600">{election.endTime}</td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFFAF0] text-[#FE9431] border border-[#FFFAF0]">
                          {election.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyLink(election)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${copiedId === election.id
                                ? "bg-green-50 text-green-600 border-green-100"
                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 whitespace-nowrap"
                              }`}
                            title="Copy Voting Link"
                          >
                            {copiedId === election.id ? <Check size={14} /> : <LinkIcon size={14} />}
                            {copiedId === election.id ? "Copied" : "Copy Link"}
                          </button>
                          <button
                            onClick={() => handleManageCandidates(election)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 whitespace-nowrap"
                            title="Manage Candidates & Positions"
                          >
                            <Users size={14} />
                            Candidates
                          </button>
                          <button
                            onClick={() => handleEdit(election)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 whitespace-nowrap"
                            title="Edit Election Details"
                          >
                            Edit
                          </button>
                        </div>
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
        onSaved={fetchElections}
      />




      <ManageCandidatesModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        election={selectedElection}
      />
    </div>
  );
}

