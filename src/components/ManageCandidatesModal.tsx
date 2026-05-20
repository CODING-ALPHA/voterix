import React, { useState, useEffect } from "react";
import { 
  X, Plus, Edit2, Trash2, ChevronDown, ChevronRight, 
  Image as ImageIcon, Loader2, Save, Sparkles, User, Briefcase
} from "lucide-react";
import { 
  listPositions, createPosition, updatePosition, deletePosition,
  listCandidates, createCandidate, updateCandidate, deleteCandidate,
  Position, Candidate
} from "@/lib/positions.api";

interface ManageCandidatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  election?: any;
}

export default function ManageCandidatesModal({ isOpen, onClose, election }: ManageCandidatesModalProps) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [expandedPositionUid, setExpandedPositionUid] = useState<string | null>(null);
  const [candidatesMap, setCandidatesMap] = useState<Record<string, Candidate[]>>({});
  
  // Loading states
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mode states for positions
  const [editingPositionUid, setEditingPositionUid] = useState<string | null>(null);
  const [positionTitle, setPositionTitle] = useState("");
  const [positionDesc, setPositionDesc] = useState("");
  const [isAddingPosition, setIsAddingPosition] = useState(false);
  
  // Mode states for candidates
  const [editingCandidateUid, setEditingCandidateUid] = useState<string | null>(null);
  const [candidateName, setCandidateName] = useState("");
  const [candidateBio, setCandidateBio] = useState("");
  const [candidateImage, setCandidateImage] = useState<File | null>(null);
  const [candidateImagePreview, setCandidateImagePreview] = useState<string | null>(null);
  const [isAddingCandidateToPosition, setIsAddingCandidateToPosition] = useState<string | null>(null);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all positions when modal opens or election changes
  const fetchAllPositions = async () => {
    if (!election?.publik_id) return;
    setIsLoadingPositions(true);
    setError("");
    try {
      const res = await listPositions(election.publik_id);
      if (res.status === "success") {
        setPositions(res.data || []);
      }
    } catch (err: any) {
      setError("Failed to load positions.");
    } finally {
      setIsLoadingPositions(false);
    }
  };

  useEffect(() => {
    if (isOpen && election) {
      fetchAllPositions();
      setExpandedPositionUid(null);
      setCandidatesMap({});
      resetPositionForm();
      resetCandidateForm();
      setError("");
      setSuccess("");
    }
  }, [isOpen, election]);

  // Fetch candidates for a specific position
  const fetchCandidates = async (positionUid: string) => {
    setLoadingCandidates(prev => ({ ...prev, [positionUid]: true }));
    try {
      const res = await listCandidates(positionUid);
      if (res.status === "success") {
        setCandidatesMap(prev => ({ ...prev, [positionUid]: res.data || [] }));
      }
    } catch (err) {
      console.error("Failed to load candidates", err);
    } finally {
      setLoadingCandidates(prev => ({ ...prev, [positionUid]: false }));
    }
  };

  const handleToggleExpand = (positionUid: string) => {
    if (expandedPositionUid === positionUid) {
      setExpandedPositionUid(null);
    } else {
      setExpandedPositionUid(positionUid);
      if (!candidatesMap[positionUid]) {
        fetchCandidates(positionUid);
      }
    }
  };

  // Position CRUD
  const resetPositionForm = () => {
    setEditingPositionUid(null);
    setIsAddingPosition(false);
    setPositionTitle("");
    setPositionDesc("");
  };

  const handleAddPosition = async () => {
    if (!positionTitle.trim()) {
      setError("Position title is required.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const res = await createPosition(election.publik_id, {
        title: positionTitle.trim(),
        description: positionDesc.trim(),
        show_live_results: true
      });
      if (res.status === "success") {
        setSuccess("Position created successfully!");
        resetPositionForm();
        fetchAllPositions();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create position.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEditPosition = (pos: Position) => {
    resetPositionForm();
    setEditingPositionUid(pos.uid);
    setPositionTitle(pos.title);
    setPositionDesc(pos.description || "");
  };

  const handleUpdatePosition = async (uid: string) => {
    if (!positionTitle.trim()) {
      setError("Position title is required.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await updatePosition(uid, {
        title: positionTitle.trim(),
        description: positionDesc.trim()
      });
      setSuccess("Position updated successfully!");
      resetPositionForm();
      fetchAllPositions();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError("Failed to update position.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePosition = async (uid: string) => {
    if (!window.confirm("Are you sure you want to delete this position and all its candidates? This action cannot be undone.")) return;
    setIsSubmitting(true);
    setError("");
    try {
      await deletePosition(uid);
      setSuccess("Position deleted successfully.");
      fetchAllPositions();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete position.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Candidate CRUD
  const resetCandidateForm = () => {
    setEditingCandidateUid(null);
    setIsAddingCandidateToPosition(null);
    setCandidateName("");
    setCandidateBio("");
    setCandidateImage(null);
    if (candidateImagePreview) {
      URL.revokeObjectURL(candidateImagePreview);
      setCandidateImagePreview(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image file is too large. Maximum is 10MB.");
        return;
      }
      setCandidateImage(file);
      setCandidateImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleAddCandidate = async (positionUid: string) => {
    if (!candidateName.trim()) {
      setError("Candidate name is required.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const res = await createCandidate(positionUid, {
        name: candidateName.trim(),
        bio: candidateBio.trim(),
        image: candidateImage || undefined
      });
      if (res.status === "success") {
        setSuccess("Candidate added successfully!");
        resetCandidateForm();
        fetchCandidates(positionUid);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to add candidate. Note: Cloudinary has a 10MB image limit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEditCandidate = (cand: Candidate, positionUid: string) => {
    resetCandidateForm();
    setEditingCandidateUid(cand.uid);
    setIsAddingCandidateToPosition(positionUid); // set position context
    setCandidateName(cand.name);
    setCandidateBio(cand.bio || "");
    setCandidateImagePreview(cand.image || null);
  };

  const handleUpdateCandidate = async (candidateUid: string, positionUid: string) => {
    if (!candidateName.trim()) {
      setError("Candidate name is required.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await updateCandidate(candidateUid, {
        name: candidateName.trim(),
        bio: candidateBio.trim(),
        image: candidateImage || undefined
      });
      setSuccess("Candidate updated successfully!");
      resetCandidateForm();
      fetchCandidates(positionUid);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to update candidate. Note: Cloudinary has a 10MB image limit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCandidate = async (candidateUid: string, positionUid: string) => {
    if (!window.confirm("Are you sure you want to delete this candidate? This action cannot be undone.")) return;
    setIsSubmitting(true);
    setError("");
    try {
      await deleteCandidate(candidateUid);
      setSuccess("Candidate deleted successfully.");
      fetchCandidates(positionUid);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete candidate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative bg-slate-900 text-slate-100 rounded-3xl w-full max-w-[800px] shadow-2xl border border-slate-800/80 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header with slick gradient */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-800/60 bg-gradient-to-r from-slate-900 via-slate-950 to-[#243160]/20 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-blue-400 animate-pulse" />
              <h2 className="text-xl font-bold text-white tracking-tight">Candidates & Positions</h2>
            </div>
            <p className="text-xs font-medium text-slate-400">
              Manage ballot structures and candidate portfolios for <span className="text-indigo-400 font-bold">{election?.name || "this election"}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-800/80 text-slate-400 rounded-xl hover:bg-slate-700 hover:text-white transition-all shadow-md"
          >
            <X size={18} />
          </button>
        </div>

        {/* Inner Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Success/Error Alerts */}
          {error && (
            <div className="rounded-xl border border-red-900/40 bg-red-950/40 px-4 py-3 text-sm font-medium text-red-300 animate-in slide-in-from-top-2">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/40 px-4 py-3 text-sm font-medium text-emerald-300 animate-in slide-in-from-top-2">
              {success}
            </div>
          )}

          {/* Position Addition Trigger */}
          {!isAddingPosition && editingPositionUid === null && (
            <button
              onClick={() => setIsAddingPosition(true)}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2 group hover:scale-[1.01] active:scale-95"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform" />
              Add New Position
            </button>
          )}

          {/* Position Input Form (Add / Edit) */}
          {(isAddingPosition || editingPositionUid !== null) && (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Briefcase size={12} className="text-indigo-400" />
                  {editingPositionUid ? "Edit Position" : "Create Position"}
                </h3>
                <button 
                  onClick={resetPositionForm}
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. President, General Secretary"
                    value={positionTitle}
                    onChange={(e) => setPositionTitle(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-700/80 h-10 px-3.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 font-medium text-white placeholder:text-slate-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Chief Executive Officer of the association"
                    value={positionDesc}
                    onChange={(e) => setPositionDesc(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-700/80 h-10 px-3.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 font-medium text-white placeholder:text-slate-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => editingPositionUid ? handleUpdatePosition(editingPositionUid) : handleAddPosition()}
                  disabled={isSubmitting}
                  className="h-9 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md hover:shadow-indigo-500/10 transition-all flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  {editingPositionUid ? "Save Position" : "Create Position"}
                </button>
              </div>
            </div>
          )}

          {/* Positions & Candidates List */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Ballot Structures</h3>
            
            {isLoadingPositions ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 size={24} className="text-indigo-400 animate-spin" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Loading positions...</span>
              </div>
            ) : positions.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-6 bg-slate-900/20">
                <Briefcase size={32} className="text-slate-700 mb-3" />
                <p className="text-slate-400 font-bold text-sm">No positions created yet</p>
                <p className="text-slate-500 text-xs mt-1 max-w-[280px]">Add positions like President or Secretary to build your ballot paper.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {positions.map((pos) => {
                  const isExpanded = expandedPositionUid === pos.uid;
                  const isEditingThis = editingPositionUid === pos.uid;
                  const candidates = candidatesMap[pos.uid] || [];
                  const isLoadingCands = loadingCandidates[pos.uid];

                  return (
                    <div 
                      key={pos.uid}
                      className={`border border-slate-800/80 rounded-2xl overflow-hidden transition-all bg-slate-950/20 hover:bg-slate-950/40`}
                    >
                      {/* Position Header Row */}
                      <div className="p-4 flex items-center justify-between gap-4">
                        <button 
                          onClick={() => handleToggleExpand(pos.uid)}
                          className="flex-1 flex items-center gap-3 text-left focus:outline-none"
                        >
                          <div className="p-2 bg-slate-900 rounded-xl text-slate-400">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
                              {pos.title}
                            </h4>
                            {pos.description && (
                              <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">{pos.description}</p>
                            )}
                          </div>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStartEditPosition(pos)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all"
                            title="Edit Position"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeletePosition(pos.uid)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-all"
                            title="Delete Position"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Section (Candidates) */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-900/60 bg-slate-950/10 space-y-4 animate-in slide-in-from-top-1 duration-200">
                          
                          {/* Candidates Grid Header */}
                          <div className="flex items-center justify-between">
                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                              <User size={10} className="text-slate-400" />
                              Candidates ({candidates.length})
                            </h5>
                            
                            {isAddingCandidateToPosition !== pos.uid && editingCandidateUid === null && (
                              <button
                                onClick={() => setIsAddingCandidateToPosition(pos.uid)}
                                className="flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest"
                              >
                                <Plus size={10} /> Add Candidate
                              </button>
                            )}
                          </div>

                          {/* Candidate Add/Edit Form Contextual */}
                          {isAddingCandidateToPosition === pos.uid && (
                            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4 animate-in slide-in-from-top-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                  {editingCandidateUid ? "Edit Portfolio" : "Add Portfolio"}
                                </span>
                                <button 
                                  onClick={resetCandidateForm}
                                  className="text-[9px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-wider"
                                >
                                  Cancel
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Candidate Name</label>
                                    <input
                                      type="text"
                                      placeholder="e.g. John Doe"
                                      value={candidateName}
                                      onChange={(e) => setCandidateName(e.target.value)}
                                      className="w-full bg-slate-950/80 border border-slate-800 h-10 px-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium text-white transition-colors"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bio / Statement</label>
                                    <textarea
                                      placeholder="e.g. Dedicated computer scientist with 3 years leadership experience."
                                      value={candidateBio}
                                      onChange={(e) => setCandidateBio(e.target.value)}
                                      rows={2}
                                      className="w-full bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium text-white transition-colors resize-none"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1.5 flex flex-col justify-between">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Photo Upload (Max 10MB)</label>
                                  <div className="flex-1 border-2 border-dashed border-slate-800 hover:border-slate-700/80 rounded-xl relative flex items-center justify-center p-4 bg-slate-950/20 cursor-pointer overflow-hidden group/image min-h-[110px]">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageChange}
                                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    {candidateImagePreview ? (
                                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                                        <img 
                                          src={candidateImagePreview} 
                                          alt="Preview" 
                                          className="object-contain max-h-full max-w-full"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center text-xs font-black text-white uppercase tracking-wider">
                                          Change Photo
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center text-center text-slate-500">
                                        <ImageIcon size={20} className="mb-1 text-slate-600 group-hover/image:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Select Photo</span>
                                        <span className="text-[8px] font-medium opacity-60 mt-0.5">PNG, JPG up to 10MB</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end pt-1">
                                <button
                                  onClick={() => editingCandidateUid ? handleUpdateCandidate(editingCandidateUid, pos.uid) : handleAddCandidate(pos.uid)}
                                  disabled={isSubmitting}
                                  className="h-9 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md hover:shadow-blue-500/10 transition-all flex items-center justify-center gap-1.5"
                                >
                                  {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                                  {editingCandidateUid ? "Save Changes" : "Add Candidate"}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Candidate List Layout */}
                          {isLoadingCands ? (
                            <div className="py-8 flex items-center justify-center gap-2">
                              <Loader2 size={14} className="text-blue-400 animate-spin" />
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Loading portfolio list...</span>
                            </div>
                          ) : candidates.length === 0 ? (
                            <div className="py-6 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-4 bg-slate-950/5">
                              <User size={20} className="text-slate-800 mb-1" />
                              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">No Candidates</p>
                              <p className="text-slate-600 text-[10px] mt-0.5">No nominees enrolled in this position category.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-2.5">
                              {candidates.map((cand) => (
                                <div 
                                  key={cand.uid}
                                  className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-slate-700/60 flex items-center justify-between gap-4 transition-all"
                                >
                                  <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="relative w-10 h-10 rounded-lg bg-slate-950 overflow-hidden border border-slate-800 shadow-inner shrink-0 flex items-center justify-center">
                                      {cand.image ? (
                                        <img 
                                          src={cand.image} 
                                          alt={cand.name} 
                                          className="object-cover w-full h-full"
                                        />
                                      ) : (
                                        <User size={16} className="text-slate-600" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <h5 className="font-bold text-sm text-slate-100 truncate">{cand.name}</h5>
                                      {cand.bio && (
                                        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{cand.bio}</p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => handleStartEditCandidate(cand, pos.uid)}
                                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition-all"
                                      title="Edit Candidate Portfolio"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCandidate(cand.uid, pos.uid)}
                                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-all"
                                      title="Remove nominee"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
