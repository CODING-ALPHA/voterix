"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import AlertModal from "@/components/AlertModal";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  MessageSquare,
  X,
  ChevronLeft,
  Circle,
  CheckCircle2,
  RefreshCw,
  Plus,
} from "lucide-react";
import { apiFetch, formatApiErrorMessage } from "@/lib/api-client";

function ElectionMonitoringContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eid = searchParams.get("election");

  const [isLoading, setIsLoading] = useState(true);
  const [electionSummary, setElectionSummary] = useState<any>(null);
  const [voters, setVoters] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning" | "info";
  } | null>(null);

  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total_items: 0,
    total_pages: 1,
  });

  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (page = 1) => {
    if (!eid) return;
    setIsLoading(true);
    try {
      const url = `/election/${eid}/voters/?page=${page}&search=${search}&status=${statusFilter}`;
      const result = await apiFetch<any>(url);
      if (result.status === "success") {
        setElectionSummary(result.data.summary);
        setVoters(result.data.voters || []);
        if (result.data.pagination) {
          setPagination(result.data.pagination);
          setCurrentPage(result.data.pagination.page);
        }
      }
    } catch (e) {
      setAlert({ message: formatApiErrorMessage(e, "Failed to load election voters."), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [eid, search, statusFilter]);

  const handleRefresh = () => fetchData(currentPage);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
       {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
             <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
                   <ChevronLeft size={20} />
                </button>
                <div className="min-w-0">
                   <h1 className="text-xl md:text-2xl font-black text-[#101828] tracking-tight truncate leading-tight">
                     {electionSummary?.election_title || "Election Monitor"}
                   </h1>
                   <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-0.5">
                      Status
                      {electionSummary && (
                         <span className="inline-flex px-2 py-0.5 bg-green-50 text-green-600 rounded text-[9px] sm:text-[10px] border border-green-100/50">
                            {electionSummary.total_voted} / {electionSummary.total_eligible} Voted
                         </span>
                      )}
                   </p>
                </div>
             </div>
             
             <button onClick={handleRefresh} className="h-10 w-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#405189] transition-all active:rotate-180 md:hidden">
                <RefreshCw size={18} />
             </button>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
             <div className="relative group flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#405189]" />
                <input 
                   type="text" value={search} onChange={e => setSearch(e.target.value)}
                   placeholder="Search voters..."
                   className="h-12 w-full md:w-[320px] pl-11 pr-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#101828] placeholder:text-gray-400 focus:outline-none focus:border-[#405189] transition-all shadow-sm" 
                />
             </div>
             
             <div className="flex items-center gap-2">
                <select 
                  value={statusFilter} 
                  onChange={e => setStatusFilter(e.target.value)}
                  className="h-12 flex-1 md:flex-none px-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 focus:outline-none focus:border-[#405189] cursor-pointer shadow-sm appearance-none"
                >
                   <option value="all">All Participation</option>
                   <option value="voted">Voted Only</option>
                   <option value="pending">Pending Only</option>
                </select>

                <button onClick={handleRefresh} className="hidden md:flex h-12 w-12 items-center justify-center bg-white border border-gray-200 rounded-2xl text-gray-500 hover:text-[#405189] transition-all active:rotate-180 shadow-sm">
                   <RefreshCw size={20} />
                </button>
             </div>

             <button 
                onClick={async () => {
                  if(!eid) return;
                  try {
                    const res = await apiFetch<any>(`/election/${eid}/generate-pins/`, { method: "POST" });
                    setAlert({ message: res.message || "PINs generated successfully.", type: "success" });
                    fetchData(currentPage);
                  } catch (e) {
                    setAlert({ message: formatApiErrorMessage(e, "Failed to generate PINs."), type: "error" });
                  }
                }}
                className="h-12 px-6 bg-[#243160] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#243160]/10 hover:opacity-95 transition-all text-sm"
             >
                <Plus size={18} /> Generate PINs
             </button>
          </div>
       </div>

       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Tunout</p>
             <h3 className="text-2xl font-black text-[#101828]">{((electionSummary?.total_voted / (electionSummary?.total_eligible || 1)) * 100).toFixed(1)}%</h3>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Votes Cast</p>
             <h3 className="text-2xl font-black text-green-600">{electionSummary?.total_voted || 0}</h3>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Voters</p>
             <h3 className="text-2xl font-black text-blue-600">{(electionSummary?.total_eligible || 0) - (electionSummary?.total_voted || 0)}</h3>
          </div>
       </div>

       {/* Table */}
       <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
          {isLoading ? (
             <div className="h-[500px] flex items-center justify-center font-bold text-gray-400 uppercase tracking-widest animate-pulse">
                Syncing Live Data...
             </div>
          ) : (
             <>
               <div className="flex-1">
                  {/* Table View (Desktop) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="border-b border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                             <th className="px-8 py-5 text-gray-400">Voter Name</th>
                             <th className="px-6 py-5">Matric No</th>
                             <th className="px-6 py-5">Email Address</th>
                             <th className="px-6 py-5">WhatsApp</th>
                             <th className="px-6 py-5">Status</th>
                             <th className="px-8 py-5 text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {voters.map((v, idx) => (
                             <tr key={idx} className="group hover:bg-[#F8F9FB] transition-colors">
                                <td className="px-8 py-4 font-black text-sm text-[#101828] group-hover:text-[#405189]">
                                   {v.first_name} {v.last_name}
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-gray-500 tracking-tight">{v.matric_number}</td>
                                <td className="px-6 py-4 text-xs font-semibold text-gray-600">{v.email}</td>
                                <td className="px-6 py-4 text-xs font-bold text-gray-400">{v.whatsapp_number}</td>
                                <td className="px-6 py-4">
                                   {v.has_voted ? (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-100">
                                         <CheckCircle2 size={12} /> Voted
                                      </span>
                                   ) : (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100">
                                         <Circle size={10} strokeWidth={3} /> Pending
                                      </span>
                                   )}
                                </td>
                                <td className="px-8 py-4 text-right">
                                   {!v.has_voted && v.reminder_link && (
                                      <a 
                                        href={v.reminder_link} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
                                      >
                                         <MessageSquare size={14} /> Send Reminder
                                      </a>
                                   )}
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>

                  {/* Card View (Mobile) */}
                  <div className="md:hidden divide-y divide-gray-50">
                    {voters.map((v, idx) => (
                      <div key={idx} className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-black text-[#101828] truncate">{v.first_name} {v.last_name}</p>
                            <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-wider">{v.matric_number}</p>
                          </div>
                          {v.has_voted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-green-100 flex-shrink-0">
                               <CheckCircle2 size={10} /> Voted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-red-100 flex-shrink-0">
                               <Circle size={8} strokeWidth={3} /> Pending
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-2 border-t border-gray-50 pt-3">
                           <div className="flex items-center justify-between text-[11px] font-medium">
                              <span className="text-gray-400">Email:</span>
                              <span className="text-[#101828] font-bold truncate max-w-[200px]">{v.email || "N/A"}</span>
                           </div>
                           <div className="flex items-center justify-between text-[11px] font-medium">
                              <span className="text-gray-400">WhatsApp:</span>
                              <span className="text-[#101828] font-black">{v.whatsapp_number || "N/A"}</span>
                           </div>
                        </div>

                        {!v.has_voted && v.reminder_link && (
                          <div className="pt-2">
                             <a 
                               href={v.reminder_link} target="_blank" rel="noopener noreferrer"
                               className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md shadow-[#25D366]/20"
                             >
                                <MessageSquare size={16} /> Send Reminder
                             </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {voters.length === 0 && (
                    <div className="py-20 text-center">
                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search size={24} className="text-gray-300" />
                       </div>
                       <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">No voters matched your filter</p>
                    </div>
                  )}
               </div>
               
               {/* Pagination Footer */}
                {pagination.total_pages > 1 && (
                  <div className="px-6 sm:px-8 py-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Page {pagination.page} of {pagination.total_pages} ({pagination.total_items} total)
                     </p>
                     <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          disabled={pagination.page === 1}
                          onClick={() => fetchData(pagination.page - 1)}
                          className="flex-1 sm:flex-none h-10 px-4 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#405189] hover:bg-[#405189] hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#405189]"
                        >
                           Previous
                        </button>
                        <button 
                          disabled={pagination.page === pagination.total_pages}
                          onClick={() => fetchData(pagination.page + 1)}
                          className="flex-1 sm:flex-none h-10 px-4 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#405189] hover:bg-[#405189] hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#405189]"
                        >
                           Next
                        </button>
                     </div>
                  </div>
                )}
             </>
          )}
       </div>

       {alert && <AlertModal isOpen={!!alert} message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
    </div>
  );
}

export default function ElectionVotersPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-gray-400 uppercase tracking-widest animate-pulse">Initializing Monitor...</div>}>
      <ElectionMonitoringContent />
    </Suspense>
  );
}
