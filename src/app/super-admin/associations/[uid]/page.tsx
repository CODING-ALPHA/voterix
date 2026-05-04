"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAssociationBillingDetail, updateAssociationPricing, deleteAssociation, type AssociationBilling, type Invoice } from "@/lib/billing.api";
import { deleteElection } from "@/lib/elections.api";
import { getMediaUrl } from "@/lib/api-client";
import { 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Edit2, 
  ExternalLink, 
  FileText, 
  Save, 
  Users, 
  X,
  Vote,
  ArchiveRestore,
  Trash2
} from "lucide-react";
import Link from "next/link";

export default function AssociationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const uid = params.uid as string;
  
  const [data, setData] = useState<(AssociationBilling & { invoices: Invoice[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editValue, setEditValue] = useState<number>(200);

  const fetchData = async () => {
    try {
      const res = await getAssociationBillingDetail(uid);
      if (res.status === "success") {
        setData(res.data);
        setEditValue(res.data.price_per_vote);
      }
    } catch (err) {
      console.error("Failed to fetch association detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid) fetchData();
  }, [uid]);

  const handleUpdatePricing = async () => {
    try {
      await updateAssociationPricing(uid, editValue);
      setIsEditingPrice(false);
      fetchData();
    } catch (err) {
      alert("Failed to update pricing");
    }
  };

  const handleDeleteAssociation = async () => {
    if (!window.confirm(`Are you absolutely sure you want to delete '${data?.name}'? This will permanently remove all elections, voters, and billing records.`)) return;
    
    try {
      await deleteAssociation(uid);
      router.push("/super-admin/associations");
    } catch (err) {
      alert("Failed to delete association");
    }
  };

  const handleDeleteElection = async (publikId: string, title: string) => {
    if (!window.confirm(`Delete election '${title}'? This will also remove its associated invoice.`)) return;
    
    try {
      await deleteElection(publikId);
      fetchData();
    } catch (err) {
      alert("Failed to delete election");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#3457B4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-900">Association not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-[#3457B4] font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumb / Back */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all text-gray-400 hover:text-gray-900 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Association Registry</h2>
            <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
          </div>
        </div>

        <button 
          onClick={handleDeleteAssociation}
          className="flex items-center gap-2 h-10 px-6 border border-red-100 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm"
        >
          <Trash2 size={16} />
          Delete Association
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 rounded-3xl bg-gray-50 mx-auto flex items-center justify-center text-gray-400 font-bold text-2xl overflow-hidden mb-6 border border-gray-50">
              {data.profile_picture ? (
                <img src={getMediaUrl(data.profile_picture) as string} alt={data.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 size={40} />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{data.name}</h3>
            <p className="text-sm font-bold text-[#3457B4] uppercase tracking-wider mt-1">{data.publik_id}</p>
            
            <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Rate</span>
                {isEditingPrice ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={editValue}
                      onChange={(e) => setEditValue(Number(e.target.value))}
                      className="w-20 h-8 bg-gray-50 border border-gray-100 rounded-lg px-2 text-xs font-bold focus:ring-1 focus:ring-[#3457B4] outline-none"
                    />
                    <button onClick={handleUpdatePricing} className="text-green-600 p-1 hover:bg-green-50 rounded-md"><Save size={16} /></button>
                    <button onClick={() => setIsEditingPrice(false)} className="text-gray-400 p-1 hover:bg-gray-50 rounded-md"><X size={16} /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">₦{data.price_per_vote} / vote</span>
                    <button onClick={() => setIsEditingPrice(true)} className="text-gray-300 hover:text-[#3457B4] transition-colors"><Edit2 size={14} /></button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50/50 p-6 rounded-[1.5rem] border border-blue-100/50">
              <ArchiveRestore className="text-blue-600 mb-3" size={20} />
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">Elections</p>
              <p className="text-xl font-bold text-blue-900">{data.total_elections}</p>
            </div>
            <div className="bg-blue-50/50 p-6 rounded-[1.5rem] border border-blue-100/50">
              <Vote className="text-blue-600 mb-3" size={20} />
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">Total Votes</p>
              <p className="text-xl font-bold text-blue-900">{data.total_votes}</p>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col min-h-[500px]">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <CreditCard size={18} className="text-[#3457B4]" />
                Billing History
              </h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Invoice records for this association</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Election</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Votes</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.invoices.map((inv) => (
                  <tr key={inv.uid} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm group-hover:text-[#3457B4] transition-colors">{inv.election_title}</span>
                        <span className="text-[10px] font-medium text-gray-400">{inv.date} • {inv.invoice_number}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-xs font-bold text-gray-500">{inv.total_votes}</span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-900">
                      ₦{inv.total_amount.toLocaleString()}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        inv.status === 'paid' 
                        ? 'bg-green-50 text-green-600 border border-green-100' 
                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/super-admin/bills/${inv.uid}`} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                          <ExternalLink size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDeleteElection(inv.election_publik_id, inv.election_title)}
                          className="p-2 text-gray-300 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {data.invoices.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <FileText size={48} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">No invoices generated</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
