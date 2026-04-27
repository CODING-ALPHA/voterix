import React from "react";
import { X, Calendar, Clock, Upload, Loader2, Check } from "lucide-react";
import {
  formatApiErrorMessage,
  updateElection,
  listVoterBatches,
  VoterBatch,
} from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";

interface EditElectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  election?: any;
  onSaved?: () => Promise<void> | void;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toDateInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toTimeInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EditElectionModal({
  isOpen,
  onClose,
  election,
  onSaved,
}: EditElectionModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [csvFile, setCsvFile] = React.useState<File | null>(null);
  const [availableBatches, setAvailableBatches] = React.useState<VoterBatch[]>([]);
  const [selectedBatchUids, setSelectedBatchUids] = React.useState<string[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoadingBatches, setIsLoadingBatches] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!isOpen || !election) return;
    setTitle(election.name || election.title || "");
    setDate(toDateInput(election.start_time));
    setStartTime(toTimeInput(election.start_time));
    setEndTime(toTimeInput(election.end_time));
    setCsvFile(null);
    setSelectedBatchUids([]);
    setError("");

    const loadBatches = async () => {
      const assocId = user?.publik_id || user?.uid;
      if (!assocId) return;
      setIsLoadingBatches(true);
      try {
        const res = await listVoterBatches(assocId);
        setAvailableBatches(res.data || []);
      } catch (err) {
        console.error("Failed to load batches:", err);
      } finally {
        setIsLoadingBatches(false);
      }
    };
    loadBatches();
  }, [isOpen, election, user]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!election?.publik_id) {
      setError("Election reference is missing.");
      return;
    }
    if (!title.trim() || !date || !startTime || !endTime) {
      setError("Please complete all required fields.");
      return;
    }

    const startDate = new Date(`${date}T${startTime}`);
    const endDate = new Date(`${date}T${endTime}`);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setError("Please provide valid date and time values.");
      return;
    }
    if (endDate <= startDate) {
      setError("End time must be after start time.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await updateElection(election.publik_id, {
        title: title.trim(),
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        csv_file: csvFile || undefined,
        voter_batch_uids: selectedBatchUids.length > 0 ? selectedBatchUids : undefined,
      });
      if (onSaved) {
        await onSaved();
      }
      onClose();
    } catch (err) {
      setError(formatApiErrorMessage(err, "Failed to update election."));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleBatch = (uid: string) => {
    setSelectedBatchUids(prev => 
      prev.includes(uid) ? prev.filter(i => i !== uid) : [...prev, uid]
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl w-full max-w-[500px] p-5 md:p-6 shadow-2xl animate-in slide-in-from-bottom-5 sm:slide-in-from-top-5 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">Edit Election</h2>
          <button 
            onClick={onClose}
            className="p-1.5 bg-gray-50 text-gray-500 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5">
          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </p>
          ) : null}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-900">Election Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-300 h-10 px-3 rounded-xl text-sm focus:outline-none focus:border-[#405189] font-medium text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-900">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-gray-300 h-10 pl-10 pr-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-semibold text-gray-900 placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-900">Start Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-white border border-gray-300 h-10 pl-10 pr-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-semibold text-gray-900"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-900">End Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-white border border-gray-300 h-10 pl-10 pr-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-semibold text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
             <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-900">Upload New Spreadsheet (CSV)</label>
              <label className="flex items-center px-4 h-10 border border-gray-300 rounded-lg relative w-full cursor-pointer hover:bg-gray-50 transition-colors">
                 <div className="flex items-center gap-2">
                   <Upload size={16} className="text-gray-400" />
                   <span className="text-xs font-semibold text-gray-400 truncate max-w-[200px]">
                    {csvFile?.name || "Select new file..."}
                   </span>
                 </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            {availableBatches.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Attach Previous Batches</label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
                  {availableBatches.map(batch => {
                    const selected = selectedBatchUids.includes(batch.uid);
                    return (
                      <button
                        key={batch.uid}
                        onClick={() => toggleBatch(batch.uid)}
                        className={`group flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                          selected ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${selected ? "text-blue-700" : "text-gray-900"}`}>{batch.name}</p>
                          <p className="text-[10px] font-medium text-gray-400">{batch.voter_count} voters</p>
                        </div>
                        {selected && <Check size={14} className="text-blue-600 shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-4 sticky bottom-0 bg-white pb-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto h-10 px-8 rounded-lg border border-gray-300 font-semibold text-gray-600 hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto h-10 px-8 rounded-lg bg-[#405189] text-white font-medium hover:opacity-90 transition-all shadow-md text-sm"
            >
              {isSaving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
