"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  Upload, 
  ChevronLeft,
  ChevronRight,
  ChevronDown, 
  Plus, 
  Trash2, 
  UserPlus,
  X,
  Copy,
  Check,
  CheckCircle2
} from "lucide-react";

// --- Sub-components ---

const SuccessModal = ({
  isOpen,
  onClose,
  verificationLink,
}: {
  isOpen: boolean;
  onClose: () => void;
  verificationLink: string;
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!verificationLink) return;
    try {
      await navigator.clipboard.writeText(verificationLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy link error:", error);
    }
  };
  
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
             value={verificationLink || "Verification link unavailable"}
             className="w-full bg-[#f8f9fc] border border-gray-200 h-10 px-3 rounded-lg text-xs sm:text-sm font-semibold text-[#405189] focus:outline-none pr-10"
           />
           <button
             type="button"
             onClick={handleCopy}
             disabled={!verificationLink}
             className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
             aria-label="Copy verification link"
             title={copied ? "Copied" : "Copy link"}
           >
             {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
           </button>
        </div>
        
        <p className="text-gray-500 font-medium text-xs sm:text-xs mb-6 italic">
          Use the link above to check for Voters&apos; Eligibility
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

import { apiUpload, formatApiErrorMessage } from "@/lib/api-client";
import AlertModal from "@/components/AlertModal";
import { createCandidate, createPosition } from "@/lib/positions.api";

// --- Sub-components ---
// ... (SuccessModal remains same)

type PickerType = "date" | "startTime" | "endTime";

type CalendarDay = {
  key: string;
  iso: string;
  label: number;
  isCurrentMonth: boolean;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const padNumber = (value: number) => value.toString().padStart(2, "0");

const formatDisplayDate = (value: string) => {
  if (!value) return "dd/mm/yyyy";

  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

const formatMonthLabel = (value: Date) =>
  value.toLocaleDateString("en-US", { month: "long", year: "numeric" });

const buildCalendarDays = (monthDate: Date): CalendarDay[] => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPreviousMonth = new Date(year, month, 0).getDate();
  const calendarDays: CalendarDay[] = [];

  for (let index = firstDayOfMonth - 1; index >= 0; index -= 1) {
    const day = daysInPreviousMonth - index;
    const prevMonthDate = new Date(year, month - 1, day);

    calendarDays.push({
      key: `prev-${prevMonthDate.toISOString()}`,
      iso: `${prevMonthDate.getFullYear()}-${padNumber(prevMonthDate.getMonth() + 1)}-${padNumber(prevMonthDate.getDate())}`,
      label: day,
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    calendarDays.push({
      key: `current-${year}-${month}-${day}`,
      iso: `${year}-${padNumber(month + 1)}-${padNumber(day)}`,
      label: day,
      isCurrentMonth: true,
    });
  }

  let nextMonthDay = 1;
  while (calendarDays.length < 42) {
    const nextMonthDate = new Date(year, month + 1, nextMonthDay);

    calendarDays.push({
      key: `next-${nextMonthDate.toISOString()}`,
      iso: `${nextMonthDate.getFullYear()}-${padNumber(nextMonthDate.getMonth() + 1)}-${padNumber(nextMonthDate.getDate())}`,
      label: nextMonthDay,
      isCurrentMonth: false,
    });

    nextMonthDay += 1;
  }

  return calendarDays;
};

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) => padNumber(index));
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) => padNumber(index));

export default function AddElectionPage() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const pickerContainerRef = React.useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [publikId, setPublikId] = useState<string | null>(null);
  const [verificationLink, setVerificationLink] = useState("");
  const [alert, setAlert] = useState<{ message: string; type: "error" | "success" | "warning" | "info" } | null>(null);
  const [openPicker, setOpenPicker] = useState<PickerType | null>(null);
  
  // Form State - Step 1
  const [electionTitle, setElectionTitle] = useState("");
  const [electionDate, setElectionDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [spreadsheetFile, setSpreadsheetFile] = useState<File | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Form State - Step 2
  const [positions, setPositions] = useState([
    { id: 1, title: "", description: "", candidates: [{ id: 1, name: "", bio: "", image: null as File | null }] }
  ]);

  const addPosition = () => {
    setPositions([...positions, { 
      id: Date.now(), 
      title: "", 
      description: "", 
      candidates: [{ id: Date.now() + 1, name: "", bio: "", image: null }] 
    }]);
  };

  const removePosition = (id: number) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  const addCandidate = (positionId: number) => {
    setPositions(positions.map(p => {
      if (p.id === positionId) {
        return { ...p, candidates: [...p.candidates, { id: Date.now(), name: "", bio: "", image: null }] };
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

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSpreadsheetFile(e.target.files[0]);
    }
  };

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        pickerContainerRef.current &&
        !pickerContainerRef.current.contains(event.target as Node)
      ) {
        setOpenPicker(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleDateSelect = (dateValue: string) => {
    setElectionDate(dateValue);
    const [year, month] = dateValue.split("-").map(Number);
    setCalendarMonth(new Date(year, month - 1, 1));
    setOpenPicker(null);
  };

  const getTimeParts = (value: string) => {
    const [hour = "00", minute = "00"] = value ? value.split(":") : ["00", "00"];
    return { hour, minute };
  };

  const handleTimeSelect = (
    field: "startTime" | "endTime",
    part: "hour" | "minute",
    value: string
  ) => {
    const currentValue = field === "startTime" ? startTime : endTime;
    const currentParts = getTimeParts(currentValue);
    const nextValue =
      part === "hour"
        ? `${value}:${currentParts.minute}`
        : `${currentParts.hour}:${value}`;

    if (field === "startTime") {
      setStartTime(nextValue);
    } else {
      setEndTime(nextValue);
    }
  };

  const handleNextStep = async () => {
    if (!electionTitle || !electionDate || !startTime || !endTime) {
      setAlert({ message: "Please fill in all election details", type: "warning" });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", electionTitle);
      const startIso = `${electionDate}T${startTime}:00Z`;
      const endIso = `${electionDate}T${endTime}:00Z`;
      
      formData.append("start_time", startIso);
      formData.append("end_time", endIso);
      if (spreadsheetFile) {
        formData.append("csv_file", spreadsheetFile);
      }

      const result = await apiUpload<{
        status: string;
        message?: string;
        errors?: Record<string, string[]>;
        data?: { publik_id?: string; verification_link?: string };
      }>("/election/create/", formData, "POST");

      if (result.status === "success" && result.data?.publik_id) {
        setPublikId(result.data.publik_id);
        setVerificationLink(result.data.verification_link || "");
        setStep(2);
      } else {
        setAlert({
          message: formatApiErrorMessage(
            { message: result.message, errors: result.errors },
            "Failed to create election base"
          ),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Create election error:", error);
      setAlert({ message: "An error occurred. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!publikId) return;

    setIsLoading(true);
    try {
      // Loop through positions and candidates to create them
      for (const pos of positions) {
        // 1. Create Position
        const posResult = await createPosition(publikId, {
          title: pos.title,
          description: pos.description,
        });
        
        if (posResult.status === "success") {
          const positionUid = posResult.data.uid;
          
          // 2. Create Candidates for this position
          for (const cand of pos.candidates) {
            await createCandidate(positionUid, {
              name: cand.name,
              bio: cand.bio,
              image: cand.image || undefined,
            });
          }
        }
      }
      setShowSuccess(true);
    } catch (error) {
      console.error("Save positions/candidates error:", error);
      setAlert({ message: "An error occurred while saving positions. Some might have been missed.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const pickerTriggerClassName =
    "flex h-12 w-full items-center rounded-xl border border-zinc-200 bg-white pl-11 pr-11 text-left text-sm font-semibold text-[#101828] shadow-sm outline-none transition-all hover:border-[#C7D7FE] focus-visible:border-[#3457B4] focus-visible:ring-4 focus-visible:ring-[#3457B4]/10";

  const pickerPopoverClassName =
    "absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full rounded-2xl border border-[#D9E2F2] bg-white p-3 shadow-[0_18px_45px_-20px_rgba(36,49,96,0.35)]";

  const calendarDays = buildCalendarDays(calendarMonth);

  const renderTimePicker = (
    field: "startTime" | "endTime",
    label: string,
    value: string
  ) => {
    const selectedTime = getTimeParts(value);

    return (
      <div className={pickerPopoverClassName}>
        <div className="mb-3 flex items-center justify-between rounded-2xl bg-[linear-gradient(180deg,#F7F9FC_0%,#EEF4FF_100%)] px-4 py-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#98A2B3]">
              {label}
            </span>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-[#243160]">
              {selectedTime.hour}:{selectedTime.minute}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpenPicker(null)}
            className="rounded-xl bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#405189] shadow-sm transition-colors hover:bg-[#F8FBFF]"
          >
            Done
          </button>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
          <div className="rounded-2xl border border-[#E4EAF5] bg-[#FBFCFE] p-2">
            <div className="mb-2 px-2 text-xs font-bold uppercase tracking-[0.18em] text-[#98A2B3]">
              Hour
            </div>
            <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
              {HOUR_OPTIONS.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => handleTimeSelect(field, "hour", hour)}
                  className={`flex h-11 w-full items-center justify-center rounded-xl text-base font-semibold transition-all ${
                    selectedTime.hour === hour
                      ? "bg-[#3457B4] text-white shadow-sm"
                      : "text-[#243160] hover:bg-[#EEF4FF]"
                  }`}
                >
                  {hour}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-20 text-3xl font-semibold text-[#98A2B3]">:</div>

          <div className="rounded-2xl border border-[#E4EAF5] bg-[#FBFCFE] p-2">
            <div className="mb-2 px-2 text-xs font-bold uppercase tracking-[0.18em] text-[#98A2B3]">
              Minute
            </div>
            <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
              {MINUTE_OPTIONS.map((minute) => (
                <button
                  key={minute}
                  type="button"
                  onClick={() => handleTimeSelect(field, "minute", minute)}
                  className={`flex h-11 w-full items-center justify-center rounded-xl text-base font-semibold transition-all ${
                    selectedTime.minute === minute
                      ? "bg-[#3457B4] text-white shadow-sm"
                      : "text-[#243160] hover:bg-[#EEF4FF]"
                  }`}
                >
                  {minute}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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
          <div className="space-y-5" ref={pickerContainerRef}>
            <div className="space-y-1.5">
              <label className="text-gray-900 font-medium text-xs">Election Title</label>
              <input
                type="text"
                value={electionTitle}
                onChange={(e) => setElectionTitle(e.target.value)}
                placeholder="e.g. NACOS DECIDES 25/26"
                className="w-full bg-white border border-gray-300 h-10 px-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-900 font-medium text-xs">Date</label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" size={17} />
                <button
                  type="button"
                  onClick={() => setOpenPicker(openPicker === "date" ? null : "date")}
                  className={pickerTriggerClassName}
                >
                  <span className={electionDate ? "text-[#101828]" : "text-[#98A2B3]"}>
                    {formatDisplayDate(electionDate)}
                  </span>
                </button>
                <ChevronDown
                  className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] transition-transform ${
                    openPicker === "date" ? "rotate-180" : ""
                  }`}
                  size={17}
                />
                {openPicker === "date" && (
                  <div className={pickerPopoverClassName}>
                    <div className="mb-3 flex items-center justify-between px-1">
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarMonth(
                            new Date(
                              calendarMonth.getFullYear(),
                              calendarMonth.getMonth() - 1,
                              1
                            )
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#405189] transition-colors hover:bg-[#EEF4FF]"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <p className="text-sm font-semibold text-[#243160]">
                        {formatMonthLabel(calendarMonth)}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarMonth(
                            new Date(
                              calendarMonth.getFullYear(),
                              calendarMonth.getMonth() + 1,
                              1
                            )
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#405189] transition-colors hover:bg-[#EEF4FF]"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="mb-2 grid grid-cols-7 gap-1 text-center">
                      {WEEKDAY_LABELS.map((day) => (
                        <span
                          key={day}
                          className="py-2 text-xs font-bold uppercase tracking-wide text-[#98A2B3]"
                        >
                          {day}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day) => {
                        const isSelected = electionDate === day.iso;

                        return (
                          <button
                            key={day.key}
                            type="button"
                            onClick={() => handleDateSelect(day.iso)}
                            className={`flex h-10 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                              isSelected
                                ? "bg-[#3457B4] text-white shadow-sm"
                                : day.isCurrentMonth
                                ? "text-[#243160] hover:bg-[#EEF4FF]"
                                : "text-[#B8C2D7] hover:bg-[#F7F9FC]"
                            }`}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-gray-900 font-medium text-xs">Start Time</label>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" size={17} />
                  <button
                    type="button"
                    onClick={() => setOpenPicker(openPicker === "startTime" ? null : "startTime")}
                    className={pickerTriggerClassName}
                  >
                    <span className={startTime ? "text-[#101828]" : "text-[#98A2B3]"}>
                      {startTime || "--:--"}
                    </span>
                  </button>
                  <ChevronDown
                    className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] transition-transform ${
                      openPicker === "startTime" ? "rotate-180" : ""
                    }`}
                    size={17}
                  />
                  {openPicker === "startTime" &&
                    renderTimePicker("startTime", "Select Start Time", startTime)}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-900 font-medium text-xs">End Time</label>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" size={17} />
                  <button
                    type="button"
                    onClick={() => setOpenPicker(openPicker === "endTime" ? null : "endTime")}
                    className={pickerTriggerClassName}
                  >
                    <span className={endTime ? "text-[#101828]" : "text-[#98A2B3]"}>
                      {endTime || "--:--"}
                    </span>
                  </button>
                  <ChevronDown
                    className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] transition-transform ${
                      openPicker === "endTime" ? "rotate-180" : ""
                    }`}
                    size={17}
                  />
                  {openPicker === "endTime" &&
                    renderTimePicker("endTime", "Select End Time", endTime)}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-900 font-medium text-xs">Add/Upload Spreadsheet (CSV)</label>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleFileClick}
                  className="flex items-center gap-2 h-10 px-4 border border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all w-fit text-sm"
                >
                  <Upload size={16} />
                  <span>{spreadsheetFile ? spreadsheetFile.name : "Select CSV file"}</span>
                </button>
                {spreadsheetFile && (
                  <button onClick={() => setSpreadsheetFile(null)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv" 
                className="hidden" 
              />
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Link
                href="/dashboard/elections"
                className="h-10 px-8 rounded-lg border border-gray-300 font-semibold text-gray-600 hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
              >
                Cancel
              </Link>
              <button
                onClick={handleNextStep}
                disabled={isLoading}
                className={`h-10 px-8 rounded-lg bg-[#405189] text-white font-medium hover:opacity-90 transition-all shadow-md text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? "Creating..." : "Next"}
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
                      value={pos.title}
                      onChange={(e) => {
                        const newPos = [...positions];
                        newPos[idx].title = e.target.value;
                        setPositions(newPos);
                      }}
                      placeholder="e.g. President"
                      className="w-full bg-white border border-gray-300 h-10 px-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-900 font-medium placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-gray-900 font-medium text-xs">Description</label>
                    <input
                      type="text"
                      value={pos.description}
                      onChange={(e) => {
                        const newPos = [...positions];
                        newPos[idx].description = e.target.value;
                        setPositions(newPos);
                      }}
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
                           <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-[#405189] font-bold text-xs shrink-0">
                             {cIdx + 1}
                           </div>
                           <input
                             type="text"
                             value={cand.name}
                             onChange={(e) => {
                               const newPos = [...positions];
                               newPos[idx].candidates[cIdx].name = e.target.value;
                               setPositions(newPos);
                             }}
                             placeholder="e.g. Ojedokun Olaniyi"
                             className="flex-1 bg-white border border-gray-300 h-9 px-3 rounded-lg text-sm focus:outline-none text-gray-900 font-medium placeholder:text-gray-400"
                           />
                         </div>
                         <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
                           <label className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 h-9 px-3 bg-white border border-gray-300 rounded-lg text-gray-500 font-semibold hover:border-gray-400 transition-all cursor-pointer">
                             <Upload size={14} />
                             <span className="text-xs">{cand.image ? cand.image.name.substring(0, 10) + "..." : "Upload Photo"}</span>
                             <input 
                               type="file" 
                               className="hidden" 
                               accept="image/*"
                               onChange={(e) => {
                                 if (e.target.files && e.target.files[0]) {
                                   const newPos = [...positions];
                                   newPos[idx].candidates[cIdx].image = e.target.files[0];
                                   setPositions(newPos);
                                 }
                               }}
                             />
                           </label>
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
                disabled={isLoading}
                className={`h-10 px-8 rounded-lg bg-[#405189] text-white font-medium hover:opacity-90 transition-all shadow-md text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? "Saving..." : "Save Election"}
              </button>
            </div>
          </div>
        )}
      </div>

      <SuccessModal 
        isOpen={showSuccess} 
        verificationLink={verificationLink}
        onClose={() => {
          setShowSuccess(false);
          window.location.href = "/dashboard/elections";
        }} 
      />

      <AlertModal
        isOpen={!!alert}
        onClose={() => setAlert(null)}
        message={alert?.message || ""}
        type={alert?.type}
      />
    </div>
  );
}

