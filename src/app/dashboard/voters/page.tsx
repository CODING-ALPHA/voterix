"use client";

import React, { useEffect, useMemo, useState } from "react";
import AlertModal from "@/components/AlertModal";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Upload,
  X,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  createVoter,
  deleteVoter,
  formatApiErrorMessage,
  getVoterBatchDetail,
  listVoterBatches,
  manuallyVerifyVoter,
  updateVoter,
  uploadVotersCsv,
} from "@/lib/api-client";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

type BatchRow = {
  id: string;
  name: string;
  initials: string;
  votersCount: number;
};

type VoterRow = {
  id: string;
  name: string;
  matric: string;
  email: string;
  phone: string;
  status: string;
  whatsappLink?: string;
};

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
        <div className="px-8 pb-10">{children}</div>
      </div>
    </div>
  );
};

function toTitleCase(value: string) {
  if (!value) return "Pending";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function mapBatch(raw: any): BatchRow {
  const name = String(raw?.name || raw?.title || "Voter Batch");
  const words = name.split(/\s+/).filter(Boolean);
  const initials =
    words
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "VB";

  return {
    id: String(raw?.uid || raw?.id || ""),
    name,
    initials,
    votersCount: Number(raw?.voter_count ?? raw?.voters_count ?? 0),
  };
}

function mapVoter(raw: any): VoterRow {
  return {
    id: String(raw?.uid || raw?.id || raw?.voter_uid || ""),
    name: raw?.name || [raw?.first_name, raw?.last_name].filter(Boolean).join(" ") || "N/A",
    matric: raw?.matric_no || raw?.matric_number || "N/A",
    email: raw?.email || "",
    phone: raw?.whatsapp_number || raw?.phone_number || "",
    status: toTitleCase(String(raw?.eligibility_status || raw?.status || "pending")),
    whatsappLink: raw?.verification_link || raw?.enquiry_link || undefined,
  };
}

const getStatusStyles = (status: string) => {
  const s = status.toLowerCase();
  if (s === "verified") return "bg-green-50 text-green-600 border-green-100";
  if (s === "suspicious" || s === "warning") return "bg-amber-50 text-amber-600 border-amber-100";
  if (s === "ineligible" || s === "rejected") return "bg-red-50 text-red-600 border-red-100";
  return "bg-blue-50 text-blue-600 border-blue-100"; // Pending / Default
};

export default function VotersRegistryPage() {
  const { user, accessToken } = useAuth();
  const assocPublikId = user?.publik_id || user?.uid || "";

  const [view, setView] = useState<"batches" | "voters">("batches");
  const [selectedBatch, setSelectedBatch] = useState<BatchRow | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [voterMenu, setVoterMenu] = useState<{ id: string | null; x: number; y: number }>({ id: null, x: 0, y: 0 });
  const [editingVoter, setEditingVoter] = useState<VoterRow | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingVoter, setIsCreatingVoter] = useState(false);

  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning" | "info";
  } | null>(null);

  const [search, setSearch] = useState("");
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [voters, setVoters] = useState<VoterRow[]>([]);

  // Form states
  const [csvTitle, setCsvTitle] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [voterName, setVoterName] = useState("");
  const [voterMatric, setVoterMatric] = useState("");
  const [voterEmail, setVoterEmail] = useState("");
  const [voterPhone, setVoterPhone] = useState("");

  const [editName, setEditName] = useState("");
  const [editMatric, setEditMatric] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [pagination, setPagination] = useState({
    total_count: 0,
    total_pages: 0,
    current_page: 1,
    page_size: 10,
    has_next: false,
    has_prev: false
  });

  const fetchBatches = async (page = 1) => {
    if (!assocPublikId) return;
    setIsLoading(true);
    try {
      const result = await listVoterBatches(assocPublikId, {
        page,
        page_size: 12,
        search: search || undefined
      });
      if ((result as any).status === "success") {
        const rawData = (result as any).data;
        // Handle both direct array and paginated structure
        const items = Array.isArray(rawData) ? rawData : (rawData?.items || rawData?.batches || []);
        const paginationData = Array.isArray(rawData) ? null : rawData?.pagination;

        setBatches(items.map(mapBatch));
        if (paginationData) {
          setPagination(paginationData);
        } else {
          setPagination(prev => ({ ...prev, total_count: items.length, total_pages: 1 }));
        }
      }
    } catch (e) {}
    setIsLoading(false);
  };

  const fetchBatchVoters = async (batchId: string, page = 1) => {
    setIsLoading(true);
    try {
      const result = await getVoterBatchDetail(batchId, {
        page,
        page_size: 10,
        search: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter
      });
      if ((result as any).status === "success") {
        const rawData = (result as any).data;
        // Batch detail returns voters array and pagination
        const items = rawData?.voters || rawData?.items || [];
        const paginationData = rawData?.pagination;

        setVoters(items.map(mapVoter));
        if (paginationData) {
          setPagination(paginationData);
        }
      }
    } catch (e) {}
    setIsLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (accessToken && assocPublikId) {
        if (view === "batches") fetchBatches(1);
        else if (selectedBatch) fetchBatchVoters(selectedBatch.id, 1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [accessToken, assocPublikId, search, statusFilter, view, selectedBatch]);

  const handlePageChange = (newPage: number) => {
    if (view === "batches") fetchBatches(newPage);
    else if (selectedBatch) fetchBatchVoters(selectedBatch.id, newPage);
  };

  const handleSelectBatch = (batch: BatchRow) => {
    setSelectedBatch(batch);
    setView("voters");
  };

  const handleUploadCSV = async () => {
    if (!csvFile || !assocPublikId) return;
    setIsUploading(true);
    try {
      await uploadVotersCsv(assocPublikId, csvFile, csvTitle || undefined);
      setIsUploadModalOpen(false);
      setCsvFile(null); setCsvTitle("");
      await fetchBatches(1);
      setAlert({ message: "Registry batch uploaded successfully.", type: "success" });
    } catch (error) {
       setAlert({ message: formatApiErrorMessage(error, "Upload failed."), type: "error" });
    } finally { setIsUploading(false); }
  };

  const handleCreateVoter = async () => {
     if (!selectedBatch?.id) return;
     setIsCreatingVoter(true);
     try {
       const parts = voterName.trim().split(/\s+/);
       await createVoter({
         first_name: parts.shift() || "",
         last_name: parts.join(" ") || "-",
         matric_number: voterMatric,
         email: voterEmail,
         whatsapp_number: voterPhone,
         batch: selectedBatch.id
       });
       setIsAddModalOpen(false);
       setVoterName(""); setVoterMatric(""); setVoterEmail(""); setVoterPhone("");
       await fetchBatchVoters(selectedBatch.id, 1);
       setAlert({ message: "Voter added manually.", type: "success" });
     } catch (e) {
       setAlert({ message: formatApiErrorMessage(e, "Add voter failed."), type: "error" });
     } finally { setIsCreatingVoter(false); }
  };

  const handleUpdateVoter = async () => {
    if (!editingVoter) return;
    try {
      const parts = editName.trim().split(/\s+/);
      await updateVoter(editingVoter.id, {
        first_name: parts.shift() || "",
        last_name: parts.join(" ") || "-",
        matric_number: editMatric,
        email: editEmail,
        whatsapp_number: editPhone,
        eligibility_status: editStatus.toLowerCase()
      });
      if (selectedBatch) await fetchBatchVoters(selectedBatch.id, pagination.current_page);
      setEditingVoter(null);
      setAlert({ message: "Record updated.", type: "success" });
    } catch (e) {
      setAlert({ message: formatApiErrorMessage(e, "Update failed."), type: "error" });
    }
  };

  const handleDeleteVoter = async (voterId: string) => {
    if (!confirm("Are you sure you want to delete this voter?")) return;
    setIsDeleting(true);
    try {
      await deleteVoter(voterId);
      if (selectedBatch) await fetchBatchVoters(selectedBatch.id, pagination.current_page);
      setVoterMenu({ id: null, x: 0, y: 0 });
      setAlert({ message: "Voter record deleted.", type: "success" });
    } catch (e) {
      setAlert({ message: formatApiErrorMessage(e, "Delete failed."), type: "error" });
    } finally { setIsDeleting(false); }
  };

  const openEditModal = (voter: VoterRow) => {
    setEditingVoter(voter);
    setEditName(voter.name);
    setEditMatric(voter.matric);
    setEditEmail(voter.email);
    setEditPhone(voter.phone);
    setEditStatus(voter.status);
    setVoterMenu({ id: null, x: 0, y: 0 });
  };

  const currentVoters = voters;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Responsive Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              {view === "voters" && (
                 <button 
                   onClick={() => setView("batches")}
                   className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#405189] hover:border-[#405189] transition-all"
                 >
                    <ChevronLeft size={20} />
                 </button>
              )}
              <div>
                 <h1 className="text-xl md:text-2xl font-black text-[#101828] tracking-tight">
                   {view === "batches" ? "Voter Registry" : selectedBatch?.name}
                 </h1>
                 <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    {view === "batches" ? "Association Database" : "Total: " + pagination.total_count + " Records"}
                 </p>
              </div>
           </div>

           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative group flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#405189]" />
                  <input 
                     type="text" value={search} onChange={e => setSearch(e.target.value)}
                     placeholder="Search registry..."
                     className="h-12 w-full md:w-[320px] pl-11 pr-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#101828] placeholder:text-gray-400 focus:outline-none focus:border-[#405189] transition-all shadow-sm" 
                  />
               </div>
              
              <div className="flex flex-row items-center gap-3">
                {view === "voters" && (
                   <select 
                     value={statusFilter} 
                     onChange={e => setStatusFilter(e.target.value)}
                     className="h-12 flex-1 sm:flex-initial px-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 focus:outline-none focus:border-[#405189] cursor-pointer appearance-none"
                   >
                      <option value="all">All Status</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                   </select>
                )}

                {view === "batches" && (
                   <button onClick={() => setIsUploadModalOpen(true)} className="h-12 px-6 flex-1 sm:flex-initial bg-[#243160] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#243160]/10 hover:opacity-95 transition-all active:scale-95">
                      <Plus size={18} /> <span className="whitespace-nowrap">Import CSV</span>
                   </button>
                )}
                {view === "voters" && (
                   <button onClick={() => setIsAddModalOpen(true)} className="h-12 px-6 flex-1 sm:flex-initial bg-[#405189] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#405189]/10 hover:opacity-95 transition-all">
                      <Plus size={18} /> <span className="whitespace-nowrap">Add Voter</span>
                   </button>
                )}
              </div>
           </div>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
           {isLoading ? (
              <div className="h-[500px] flex items-center justify-center font-bold text-gray-400 uppercase tracking-widest animate-pulse">
                 Loading Registry...
              </div>
           ) : view === "batches" ? (
              <div className="p-4 md:p-8">
                 {batches.length === 0 ? (
                    <div className="h-[400px] flex flex-col items-center justify-center text-center max-w-[400px] mx-auto p-6">
                       <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-6">
                          <Upload size={32} />
                       </div>
                       <h3 className="text-xl font-bold text-gray-900 mb-3">No Batches Yet</h3>
                       <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
                          Upload your association's voter list to get started. You can group them by department or level.
                       </p>
                       <button onClick={() => setIsUploadModalOpen(true)} className="h-12 px-8 bg-[#405189] text-white rounded-2xl font-bold">
                          Upload CSV Batch
                       </button>
                    </div>
                 ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {batches.map(batch => (
                            <button key={batch.id} onClick={() => handleSelectBatch(batch)} className="group p-6 md:p-8 bg-[#F8FAFF] border border-[#E8EEFF] rounded-[32px] text-left hover:border-[#405189] hover:bg-white transition-all shadow-sm hover:shadow-xl">
                               <div className="flex items-center justify-between mb-6">
                                  <div className="w-12 h-12 bg-[#243160] rounded-2xl flex items-center justify-center text-white font-black">
                                     {batch.initials}
                                  </div>
                                  <div className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-black text-[#405189] uppercase tracking-wider group-hover:bg-[#405189] group-hover:text-white transition-colors">
                                     {batch.votersCount} Voters
                                  </div>
                               </div>
                               <h3 className="text-lg font-black text-[#101828] mb-1 truncate">{batch.name}</h3>
                               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registry Batch</p>
                            </button>
                         ))}
                      </div>
                      
                      {pagination.total_pages > 1 && (
                       <div className="px-6 sm:px-8 py-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center sm:text-left">
                             Page {pagination.current_page} of {pagination.total_pages || 1} ({pagination.total_count} records)
                          </p>
                          <div className="flex gap-2 w-full sm:w-auto">
                             <button 
                               disabled={!pagination.has_prev}
                               onClick={() => handlePageChange(pagination.current_page - 1)}
                               className="flex-1 sm:flex-none h-10 px-4 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#405189] hover:bg-[#405189] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                             >
                                Previous
                             </button>
                             <button 
                               disabled={!pagination.has_next}
                               onClick={() => handlePageChange(pagination.current_page + 1)}
                               className="flex-1 sm:flex-none h-10 px-4 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#405189] hover:bg-[#405189] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                             >
                                Next
                             </button>
                          </div>
                       </div>
                    )}
                    </>
                 )}
              </div>
           ) : (
              <>
                <div className="flex-1">
                   {/* Desktop View */}
                   <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="border-b border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                               <th className="px-8 py-5">Full Name</th>
                               <th className="px-6 py-5">Matric No</th>
                               <th className="px-6 py-5">Email Address</th>
                               <th className="px-6 py-5">WhatsApp</th>
                               <th className="px-6 py-5">Status</th>
                               <th className="px-8 py-5"></th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-50">
                            {currentVoters.map(voter => (
                               <tr key={voter.id} className="group hover:bg-[#F8F9FB] transition-colors relative">
                                  <td className="px-8 py-4 font-black text-sm text-[#101828] group-hover:text-[#405189]">{voter.name}</td>
                                  <td className="px-6 py-4 font-mono text-xs text-gray-500 tracking-tight">{voter.matric}</td>
                                  <td className="px-6 py-4 text-xs font-semibold text-gray-600">{voter.email}</td>
                                  <td className="px-6 py-4 text-xs font-bold text-gray-400">{voter.phone}</td>
                                  <td className="px-6 py-4">
                                     <div className="flex items-center gap-3">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(voter.status)}`}>
                                           {voter.status}
                                        </span>
                                        {voter.status.toLowerCase() !== "verified" && voter.whatsappLink && (
                                           <a 
                                             href={voter.whatsappLink} 
                                             target="_blank" 
                                             rel="noopener noreferrer"
                                             className="p-1.5 bg-[#25D366]/10 text-[#25D366] rounded-lg hover:bg-[#25D366]/20 transition-all"
                                             title="Verify via WhatsApp"
                                           >
                                              <MessageSquare size={14} fill="currentColor" />
                                           </a>
                                        )}
                                     </div>
                                  </td>
                                  <td className="px-8 py-4 text-right relative">
                                     <button 
                                       onClick={(e) => {
                                         const rect = e.currentTarget.getBoundingClientRect();
                                         setVoterMenu(prev => prev.id === voter.id ? { id: null, x: 0, y: 0 } : { id: voter.id, x: rect.left - 120, y: rect.top + 30 });
                                       }}
                                       className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                                     >
                                        <MoreHorizontal size={18} />
                                     </button>
      
                                     {voterMenu.id === voter.id && (
                                        <>
                                          <div className="fixed inset-0 z-[60]" onClick={() => setVoterMenu({ id: null, x: 0, y: 0 })} />
                                          <div 
                                            className="fixed z-[70] w-36 bg-white border border-gray-100 shadow-xl rounded-2xl py-2 animate-in fade-in zoom-in-95 duration-100"
                                            style={{ left: voterMenu.x, top: voterMenu.y }}
                                          >
                                             <button onClick={() => openEditModal(voter)} className="w-full px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-gray-600">
                                                <Pencil size={14} /> Edit
                                             </button>
                                             <button onClick={() => handleDeleteVoter(voter.id)} className="w-full px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-red-600">
                                                <Trash2 size={14} /> Delete
                                             </button>
                                          </div>
                                        </>
                                     )}
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>

                   {/* Mobile List View */}
                   <div className="md:hidden divide-y divide-gray-50">
                      {currentVoters.map(voter => (
                         <div key={voter.id} className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                               <div className="space-y-1">
                                  <h3 className="font-black text-sm text-[#101828]">{voter.name}</h3>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-[#405189]/60">{voter.matric}</p>
                               </div>
                               <button onClick={() => openEditModal(voter)} className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl">
                                  <Pencil size={14} />
                               </button>
                            </div>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusStyles(voter.status)}`}>
                                     {voter.status}
                                  </span>
                                  {voter.status.toLowerCase() !== "verified" && voter.whatsappLink && (
                                     <a 
                                       href={voter.whatsappLink} 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       className="p-1 bg-[#25D366]/10 text-[#25D366] rounded-md"
                                     >
                                        <MessageSquare size={12} fill="currentColor" />
                                     </a>
                                  )}
                               </div>
                               <p className="text-[10px] font-bold text-gray-400">{voter.phone}</p>
                            </div>
                         </div>
                      ))}
                   </div>

                   {currentVoters.length === 0 && (
                      <div className="py-20 text-center font-bold text-gray-400 uppercase tracking-widest">No voters matched your filter</div>
                   )}
                </div>
                
                {/* Pagination Footer */}
                <div className="px-6 md:px-8 py-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Page {pagination.current_page} of {pagination.total_pages || 1}
                   </p>
                   <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        disabled={!pagination.has_prev}
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        className="flex-1 sm:flex-none h-10 px-4 border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-[#405189] hover:bg-[#405189] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                         Previous
                      </button>
                      <button 
                        disabled={!pagination.has_next}
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        className="flex-1 sm:flex-none h-10 px-4 border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-[#405189] hover:bg-[#405189] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                         Next
                      </button>
                   </div>
                </div>
              </>
           )}
        </div>

        {/* Modals */}
        <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Import Registry Batch">
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Batch Context</label>
                 <input type="text" value={csvTitle} onChange={e => setCsvTitle(e.target.value)} 
                    placeholder="e.g. Engineering Level 200" 
                    className="w-full h-12 px-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-[#101828] focus:border-[#405189] transition-all" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CSV Selection</label>
                 <div onClick={() => fileInputRef.current?.click()} className="h-32 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-2 hover:border-[#405189] cursor-pointer">
                    <Upload size={24} className="text-gray-300" />
                    <span className="text-sm font-bold">{csvFile ? csvFile.name : "Select CSV Personnel List"}</span>
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={e => e.target.files && setCsvFile(e.target.files[0])} />
              </div>
              <button onClick={handleUploadCSV} disabled={isUploading} className="w-full h-12 bg-[#243160] text-white rounded-2xl font-bold shadow-lg shadow-[#243160]/20 disabled:opacity-50">
                 {isUploading ? "Uploading Data..." : "Finalize Import"}
              </button>
           </div>
        </Modal>

        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Manual Voter Entry">
           <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <input type="text" placeholder="Full Name" value={voterName} onChange={e => setVoterName(e.target.value)} className="w-full h-12 px-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#101828]" />
                 <input type="text" placeholder="Matric No" value={voterMatric} onChange={e => setVoterMatric(e.target.value)} className="w-full h-12 px-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#101828]" />
              </div>
              <input type="email" placeholder="Email Address" value={voterEmail} onChange={e => setVoterEmail(e.target.value)} className="w-full h-12 px-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#101828]" />
              <input type="tel" placeholder="WhatsApp Number" value={voterPhone} onChange={e => setVoterPhone(e.target.value)} className="w-full h-12 px-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#101828]" />
              <button onClick={handleCreateVoter} disabled={isCreatingVoter} className="w-full h-12 bg-[#405189] text-white rounded-2xl font-bold shadow-lg shadow-[#405189]/20">
                 {isCreatingVoter ? "Saving..." : "Add to Registry"}
              </button>
           </div>
        </Modal>

        <Modal isOpen={!!editingVoter} onClose={() => setEditingVoter(null)} title="Modify Registry Record">
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                      <input type="text" value={editName} onChange={e => setEditName(e.target.value)} 
                         className="w-full h-12 px-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#101828] focus:border-[#405189] transition-all" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Matric No</label>
                      <input type="text" value={editMatric} onChange={e => setEditMatric(e.target.value)} 
                         className="w-full h-12 px-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#101828] focus:border-[#405189] transition-all" />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                   <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} 
                      className="w-full h-12 px-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#101828] focus:border-[#405189] transition-all" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">WhatsApp Number</label>
                   <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} 
                      className="w-full h-12 px-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#101828] focus:border-[#405189] transition-all" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Verification Status</label>
                   <select value={editStatus} onChange={e => setEditStatus(e.target.value)} 
                      className="w-full h-12 px-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#101828] focus:border-[#405189] transition-all appearance-none cursor-pointer">
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspicious">Suspicious</option>
                      <option value="Warning">Warning</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Ineligible">Ineligible</option>
                   </select>
                </div>
                <div className="flex gap-4 pt-4">
                    <button onClick={() => setEditingVoter(null)} className="flex-1 h-12 font-bold text-gray-500">Cancel</button>
                    <button onClick={handleUpdateVoter} className="flex-1 h-12 bg-[#405189] text-white rounded-2xl font-bold">Update Account</button>
                </div>
            </div>
        </Modal>

        {alert && <AlertModal isOpen={!!alert} message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
    </div>
  );
}
