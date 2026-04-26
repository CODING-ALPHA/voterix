"use client";

import React, { useState, useEffect } from "react";
import { listAssociationBilling, updateAssociationPricing, type AssociationBilling } from "@/lib/billing.api";
import { getMediaUrl } from "@/lib/api-client";
import { Edit2, Save, X, MoreHorizontal, CheckCircle2, ChevronRight, Building2, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AssociationsBillingPage() {
  const [associations, setAssociations] = useState<AssociationBilling[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(200);
  const router = useRouter();

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchAssociations = async () => {
    setLoading(true);
    try {
      const res = await listAssociationBilling(debouncedSearch);
      if (res.status === "success") {
        setAssociations(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch billing list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociations();
  }, [debouncedSearch]);

  const handleUpdatePricing = async (uid: string) => {
    try {
      await updateAssociationPricing(uid, editValue);
      setEditingId(null);
      fetchAssociations();
    } catch (err) {
      alert("Failed to update pricing");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Associations & Pricing</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage institutional rates and view total election participation.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search associations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#3457B4] outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Association</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rate (Per Vote)</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Elections</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Votes</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {associations.map((assoc) => (
                <tr 
                  key={assoc.uid} 
                  className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                  onClick={() => router.push(`/super-admin/associations/${assoc.uid}`)}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 font-bold overflow-hidden transition-all group-hover:scale-105">
                        {assoc.profile_picture ? (
                             <img 
                                src={getMediaUrl(assoc.profile_picture) as string} 
                                alt={assoc.name} 
                                className="w-full h-full object-cover"
                             />
                        ) : (
                             assoc.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <span className="font-bold text-gray-900 group-hover:text-[#3457B4] transition-colors">{assoc.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-500">{assoc.publik_id}</td>
                  <td className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
                    {editingId === assoc.uid ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          value={editValue}
                          onChange={(e) => setEditValue(Number(e.target.value))}
                          className="w-24 h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm font-bold focus:ring-2 focus:ring-[#3457B4] outline-none"
                        />
                        <button onClick={() => handleUpdatePricing(assoc.uid)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                          <Save size={18} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group/rate">
                        <span className={`text-sm font-bold ${assoc.price_per_vote < 200 ? 'text-green-600' : 'text-gray-900'}`}>
                          ₦{assoc.price_per_vote}
                        </span>
                        <button 
                          onClick={() => { setEditingId(assoc.uid); setEditValue(assoc.price_per_vote); }} 
                          className="p-1.5 text-gray-300 hover:text-[#3457B4] opacity-0 group-hover/rate:opacity-100 transition-all font-bold"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-900">{assoc.total_elections}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-blue-50 text-[#3457B4] text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {assoc.total_votes} Votes
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <Link 
                      href={`/super-admin/associations/${assoc.uid}`}
                      className="p-2.5 text-gray-400 hover:text-[#3457B4] hover:bg-blue-50 rounded-xl transition-all inline-flex items-center gap-2"
                    >
                      <span className="text-xs font-bold md:inline hidden uppercase tracking-wider">Details</span>
                      <ChevronRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {associations.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                <Building2 size={32} />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No associations found</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-20">
               <div className="w-8 h-8 border-4 border-[#3457B4] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
