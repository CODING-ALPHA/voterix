"use client";

import React, { useEffect, useMemo, useState } from "react";
import AlertModal from "@/components/AlertModal";
import Image from "next/image";
import {
  Search,
  ArrowUpDown,
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
  sendWhatsAppReminder,
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
  electionPublikId: string | null;
};

type VoterRow = {
  id: string;
  name: string;
  matric: string;
  email: string;
  phone: string;
  status: string;
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
    electionPublikId: raw?.election_publik_id || raw?.election?.publik_id || null,
  };
}

function mapVoter(raw: any): VoterRow {
  return {
    id: String(raw?.uid || raw?.id || ""),
    name: raw?.name || [raw?.first_name, raw?.last_name].filter(Boolean).join(" ") || "N/A",
    matric: raw?.matric_no || raw?.matric_number || "N/A",
    email: raw?.email || "N/A",
    phone: raw?.whatsapp_number || raw?.phone || "N/A",
    status: toTitleCase(String(raw?.eligibility_status || raw?.status || "pending")),
  };
}

export default function VotersPage() {
  const { user, accessToken } = useAuth();
  const assocPublikId = user?.publik_id || user?.uid || "";

  const [view, setView] = useState<"selection" | "voters">("selection");
  const [selectedBatch, setSelectedBatch] = useState<BatchRow | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [voterMenu, setVoterMenu] = useState<{ id: string | null }>({
    id: null,
  });
  const [statusVoter, setStatusVoter] = useState<VoterRow | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingVoter, setIsCreatingVoter] = useState(false);
  const [isSendingReminderFor, setIsSendingReminderFor] = useState<string | null>(null);

  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning" | "info";
  } | null>(null);

  const [search, setSearch] = useState("");
  const [csvTitle, setCsvTitle] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [voterName, setVoterName] = useState("");
  const [voterMatric, setVoterMatric] = useState("");
  const [voterEmail, setVoterEmail] = useState("");
  const [voterPhone, setVoterPhone] = useState("");
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [voters, setVoters] = useState<VoterRow[]>([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchBatches = async () => {
    if (!assocPublikId) return;

    try {
      const result = await listVoterBatches(assocPublikId);
      if ((result as any).status === "success") {
        const rows = ((result as any).data || []).map(mapBatch).filter((batch: BatchRow) => !!batch.id);
        setBatches(rows);
      } else {
        const res = result as any;
        setAlert({
          message: formatApiErrorMessage(
            { message: res?.message, errors: res?.errors },
            "Could not load voter batches."
          ),
          type: "error",
        });
      }
    } catch (error) {
      setAlert({ message: formatApiErrorMessage(error, "Could not load voter batches."), type: "error" });
    }
  };

  const fetchBatchVoters = async (batch: BatchRow) => {
    if (!batch.id) return;

    setIsLoading(true);
    try {
      const result = await getVoterBatchDetail(batch.id);
      if ((result as any).status === "success") {
        const data = (result as any).data || {};
        const detailVoters = (data.voters || []).map(mapVoter);
        setVoters(detailVoters);

        const electionPublikId = data?.election_publik_id || data?.election?.publik_id || batch.electionPublikId;
        setSelectedBatch({ ...batch, electionPublikId: electionPublikId || null, votersCount: detailVoters.length });
      } else {
        const res = result as any;
        setAlert({
          message: formatApiErrorMessage(
            { message: res?.message, errors: res?.errors },
            "Could not load voters for this batch."
          ),
          type: "error",
        });
      }
    } catch (error) {
      setAlert({ message: formatApiErrorMessage(error, "Could not load voters for this batch."), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken || !assocPublikId) return;

    const bootstrap = async () => {
      setIsLoading(true);
      await fetchBatches();
      setIsLoading(false);
    };

    bootstrap();
  }, [accessToken, assocPublikId]);

  useEffect(() => {
    if (!voterMenu.id) return;

    const handlePointerDown = (event: MouseEvent) => {
      setVoterMenu({ id: null });
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setVoterMenu({ id: null });
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [voterMenu.id]);

  const handleUploadCSV = async () => {
    if (!csvFile || !assocPublikId) return;

    setIsUploading(true);
    try {
      await uploadVotersCsv(assocPublikId, csvFile, csvTitle || undefined);
      setIsUploadModalOpen(false);
      setCsvFile(null);
      setCsvTitle("");
      await fetchBatches();
      setAlert({ message: "Voters uploaded successfully.", type: "success" });
    } catch (error) {
      setAlert({ message: formatApiErrorMessage(error, "Upload failed."), type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectBatch = async (batch: BatchRow) => {
    setSelectedBatch(batch);
    setView("voters");
    await fetchBatchVoters(batch);
  };

  const handleCreateVoter = async () => {
    if (!selectedBatch?.id) {
      setAlert({ message: "Select a batch first.", type: "warning" });
      return;
    }

    if (!voterName.trim() || !voterMatric.trim()) {
      setAlert({ message: "Name and matric number are required.", type: "warning" });
      return;
    }

    const nameParts = voterName.trim().split(/\s+/);
    const first_name = nameParts.shift() || "";
    const last_name = nameParts.join(" ") || "-";

    setIsCreatingVoter(true);
    try {
      await createVoter({
        first_name,
        last_name,
        matric_number: voterMatric.trim(),
        email: voterEmail.trim() || undefined,
        whatsapp_number: voterPhone.trim() || undefined,
        batch: selectedBatch.id,
      });

      setIsAddModalOpen(false);
      setVoterName("");
      setVoterMatric("");
      setVoterEmail("");
      setVoterPhone("");

      await Promise.all([fetchBatches(), fetchBatchVoters(selectedBatch)]);
      setAlert({ message: "Voter added successfully.", type: "success" });
    } catch (error) {
      setAlert({ message: formatApiErrorMessage(error, "Could not add voter."), type: "error" });
    } finally {
      setIsCreatingVoter(false);
    }
  };

  const handleDeleteVoter = async (voterId: string) => {
    const confirmed = window.confirm("Delete this voter permanently?");
    if (!confirmed) return;

    try {
      await deleteVoter(voterId);
      if (selectedBatch) {
        await Promise.all([fetchBatches(), fetchBatchVoters(selectedBatch)]);
      }
      setAlert({ message: "Voter deleted successfully.", type: "success" });
    } catch (error) {
      setAlert({ message: formatApiErrorMessage(error, "Could not delete voter."), type: "error" });
    } finally {
      setVoterMenu({ id: null });
    }
  };

  const handleUpdateStatus = async (voterId: string, newStatus: string) => {
    try {
      if (newStatus === "Verified") {
        await manuallyVerifyVoter(voterId);
      } else {
        await updateVoter(voterId, { status: newStatus.toLowerCase() });
      }

      if (selectedBatch) {
        await Promise.all([fetchBatches(), fetchBatchVoters(selectedBatch)]);
      }
      setAlert({ message: `Voter status updated to ${newStatus}.`, type: "success" });
    } catch (error) {
      setAlert({
        message: formatApiErrorMessage(
          error,
          newStatus === "Verified"
            ? "Could not verify voter."
            : `${newStatus} status update is not available on backend yet.`
        ),
        type: "error",
      });
    } finally {
      setVoterMenu({ id: null });
    }
  };

  const handleSendReminder = async (voterId: string) => {
    if (!selectedBatch?.electionPublikId) {
      setAlert({
        message: "This batch is not linked to an election publik ID for WhatsApp reminder.",
        type: "warning",
      });
      return;
    }

    setIsSendingReminderFor(voterId);
    try {
      await sendWhatsAppReminder(selectedBatch.electionPublikId, voterId);
      setAlert({ message: "WhatsApp reminder sent successfully.", type: "success" });
    } catch (error) {
      setAlert({ message: formatApiErrorMessage(error, "Failed to send reminder."), type: "error" });
    } finally {
      setIsSendingReminderFor(null);
    }
  };

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "verified":
        return "bg-[#E7F9ED] text-[#28C76F] border-[#E7F9ED]";
      case "warning":
        return "bg-[#FFF4E5] text-[#FF9F43] border-[#FFF4E5]";
      case "suspicious":
        return "bg-[#FFEDED] text-[#EA5455] border-[#FFEDED]";
      case "pending":
        return "bg-blue-50 text-blue-600 border-blue-50";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const filteredBatches = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return batches;
    return batches.filter((batch) => batch.name.toLowerCase().includes(term));
  }, [batches, search]);

  const filteredVoters = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return voters;
    return voters.filter((voter) =>
      [voter.name, voter.matric, voter.email, voter.phone, voter.status]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [voters, search]);

  const renderMenu = (voter: VoterRow, mobile = false) => {
    if (voterMenu.id !== voter.id) return null;

    return (
      <div
        key={`${voter.id}-${mobile ? "mobile" : "desktop"}`}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className={`absolute right-0 z-30 w-44 rounded-2xl border border-gray-100 bg-white shadow-2xl overflow-hidden animate-in fade-in duration-200 ${
          mobile ? "bottom-full mb-2 slide-in-from-bottom-2" : "top-[calc(100%+0.35rem)] zoom-in-95"
        }`}
      >
        <div className="flex items-center justify-end p-2 border-b border-gray-50">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setVoterMenu({ id: null });
            }}
            className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setVoterMenu({ id: null });
              setStatusVoter(voter);
            }}
            className="w-full h-10 px-3 flex items-center gap-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Pencil size={15} />
            </div>
            <span>Edit Status</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteVoter(voter.id);
            }}
            className="w-full h-10 px-3 flex items-center gap-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <Trash2 size={15} />
            </div>
            <span>Delete</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {view === "voters" && (
            <button
              onClick={() => {
                setView("selection");
                setSearch("");
              }}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500 mr-2"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            {view === "selection" ? "Voters" : `${selectedBatch?.name || "Batch"} Voters`}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={view === "selection" ? "Search Batches..." : "Search Voters..."}
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 transition-colors text-sm font-medium text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <button className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm shadow-sm">
            <span>Sort</span>
            <ArrowUpDown size={14} />
          </button>

          {view === "selection" ? (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 bg-[#1C1F26] text-white h-10 px-4 rounded-lg font-medium hover:bg-black transition-all shadow-md"
            >
              <Plus size={16} strokeWidth={2} />
              Add Batch
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

      <div className="min-h-[500px] transition-all duration-300">
        {view === "selection" ? (
          <>
            {isLoading ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[300px] flex items-center justify-center text-sm font-semibold text-gray-500">
                Loading voter batches...
              </div>
            ) : filteredBatches.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[300px] flex flex-col items-center justify-center p-8 text-center">
                <h3 className="text-gray-900 text-lg font-bold mb-2">No voter batch yet</h3>
                <p className="text-sm text-gray-500 font-medium mb-6">Upload a CSV to create your first voter batch.</p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-2 bg-[#1C1F26] text-white h-10 px-5 rounded-lg font-medium hover:bg-black transition-all shadow-md"
                >
                  <Upload size={16} />
                  Upload CSV
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full hidden md:table">
                  <thead>
                    <tr className="border-b border-gray-50 text-gray-400">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Number of Voter</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredBatches.map((batch) => (
                      <tr
                        key={batch.id}
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                        onClick={() => handleSelectBatch(batch)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                              {batch.initials}
                            </div>
                            <span className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                              {batch.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-600">{batch.votersCount}</td>
                        <td className="px-6 py-4 text-right">
                          <MoreHorizontal size={16} className="text-gray-400 inline" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="md:hidden divide-y divide-gray-50">
                  {filteredBatches.map((batch) => (
                    <button
                      key={batch.id}
                      onClick={() => handleSelectBatch(batch)}
                      className="w-full p-4 text-left hover:bg-gray-50"
                    >
                      <p className="text-sm font-semibold text-gray-900">{batch.name}</p>
                      <p className="text-xs font-medium text-gray-500 mt-1">Voters: {batch.votersCount}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="min-h-[300px] flex items-center justify-center text-sm font-semibold text-gray-500">
                Loading voters...
              </div>
            ) : filteredVoters.length === 0 ? (
              <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center">
                <Image src="/users-03.svg" alt="No Voters" width={56} height={56} className="opacity-30 mb-4" />
                <h3 className="text-gray-900 text-lg font-bold mb-2">No voters in this batch</h3>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 flex items-center gap-2 bg-[#1C1F26] text-white h-10 px-5 rounded-lg font-medium hover:bg-black transition-all shadow-md"
                >
                  <Plus size={16} />
                  Add Voter
                </button>
              </div>
            ) : (
              <>
                <table className="w-full hidden md:table">
                  <thead>
                    <tr className="border-b border-gray-50 text-gray-400">
                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider">Name</th>
                      <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider">Matric_No</th>
                      <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider">Email</th>
                      <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider">Phone</th>
                      <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider">Status</th>
                      <th className="px-5 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredVoters.map((voter) => (
                      <tr key={voter.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5 text-xs font-bold text-gray-900">{voter.name}</td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-gray-500">{voter.matric}</td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-gray-500 max-w-[180px] truncate">{voter.email}</td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-gray-500">{voter.phone}</td>
                        <td className="px-4 py-3.5">
                          <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              setStatusVoter(voter);
                            }}
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(voter.status)} hover:opacity-80 transition-opacity cursor-pointer`}
                          >
                            {voter.status}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {voter.status !== "Verified" && (
                              <button
                                onClick={() => handleSendReminder(voter.id)}
                                disabled={isSendingReminderFor === voter.id}
                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors shadow-sm disabled:opacity-60"
                              >
                                <MessageSquare size={16} fill="currentColor" />
                              </button>
                            )}
                            <div className="relative">
                              <button
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setVoterMenu((m) => ({ id: m.id === voter.id ? null : voter.id }));
                                }}
                                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                              >
                                <MoreHorizontal size={18} className="text-gray-400" />
                              </button>
                              {renderMenu(voter)}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="md:hidden divide-y divide-gray-50">
                  {filteredVoters.map((voter) => (
                    <div key={voter.id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{voter.name}</p>
                          <p className="text-xs text-gray-500">{voter.matric}</p>
                        </div>
                        <div className="relative">
                          <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              setVoterMenu((m) => ({ id: m.id === voter.id ? null : voter.id }));
                            }}
                            className="h-9 w-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {renderMenu(voter, true)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{voter.email}</p>
                      <div className="flex items-center justify-between">
                        <button
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setStatusVoter(voter);
                          }}
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(voter.status)} hover:opacity-80 transition-opacity cursor-pointer`}
                        >
                          {voter.status}
                        </button>
                        {voter.status !== "Verified" && (
                          <button
                            onClick={() => handleSendReminder(voter.id)}
                            disabled={isSendingReminderFor === voter.id}
                            className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-lg px-2.5 py-1.5"
                          >
                            Notify WhatsApp
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload CSV">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">CSV Title</label>
            <input
              type="text"
              value={csvTitle}
              onChange={(e) => setCsvTitle(e.target.value)}
              placeholder="e.g NACOS DECIDES STUDENTS"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#405189]/10 focus:border-[#405189] transition-all font-medium text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Upload Spreadsheet</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="h-14 px-4 border border-gray-200 rounded-xl flex items-center gap-3 transition-colors cursor-pointer bg-white hover:border-[#405189]"
            >
              <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg shadow-sm flex items-center justify-center">
                <Upload size={18} className="text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-400">{csvFile ? csvFile.name : ".csv"}</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setCsvFile(e.target.files[0]);
                }
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="h-12 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadCSV}
              disabled={isUploading}
              className="h-12 rounded-xl bg-[#405189] text-white font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-60"
            >
              {isUploading ? "Uploading..." : "Add"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Voter">
        <div className="space-y-4">
          <input value={voterName} onChange={(e) => setVoterName(e.target.value)} placeholder="Name" className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm" />
          <input value={voterMatric} onChange={(e) => setVoterMatric(e.target.value)} placeholder="Matric_No" className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm" />
          <input value={voterEmail} onChange={(e) => setVoterEmail(e.target.value)} placeholder="Email" className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm" />
          <input value={voterPhone} onChange={(e) => setVoterPhone(e.target.value)} placeholder="Phone" className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm" />
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button onClick={() => setIsAddModalOpen(false)} className="h-12 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all">Cancel</button>
            <button onClick={handleCreateVoter} disabled={isCreatingVoter} className="h-12 rounded-xl bg-[#405189] text-white font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-60">{isCreatingVoter ? "Adding..." : "Add"}</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!statusVoter} onClose={() => setStatusVoter(null)} title="Change Voter Status">
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-500">
            Select a new status for <span className="text-gray-900 font-bold">{statusVoter?.name}</span>
          </p>
          <div className="grid grid-cols-1 gap-3">
            {(["Verified", "Warning", "Suspicious"] as const).map((status) => (
              <button
                key={status}
                onClick={() => statusVoter && handleUpdateStatus(statusVoter.id, status)}
                className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all ${
                  statusVoter?.status === status
                    ? "border-[#405189] bg-[#405189]/5"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(status)}`}>
                  {status}
                </span>
                {statusVoter?.status === status && (
                  <span className="text-[#405189] text-xs font-bold italic">Current Status</span>
                )}
              </button>
            ))}
          </div>
          <div className="pt-4">
            <button
              onClick={() => setStatusVoter(null)}
              className="w-full h-12 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <AlertModal isOpen={!!alert} onClose={() => setAlert(null)} message={alert?.message || ""} type={alert?.type} />
    </div>
  );
}
