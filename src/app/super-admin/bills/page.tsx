"use client";

import React, { useState, useEffect } from "react";
import { listInvoices, updateInvoiceStatus, type Invoice } from "@/lib/billing.api";
import { 
  Printer, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ChevronRight,
  ExternalLink,
  Search
} from "lucide-react";
import Link from "next/link";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await listInvoices(debouncedSearch);
      if (res.status === "success") {
        setInvoices(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [debouncedSearch]);

  const handleToggleStatus = async (uid: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
      await updateInvoiceStatus(uid, newStatus);
      fetchInvoices();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing History</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Track and manage election bills across the platform.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search invoices, clients..."
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
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Invoice</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Association</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Election</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => (
                <tr key={inv.uid} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{inv.invoice_number}</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{inv.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-700">{inv.association_name}</td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{inv.election_title}</span>
                        <span className="text-[10px] font-bold text-[#3457B4] uppercase tracking-wider">{inv.total_votes} total votes</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-gray-900">₦{inv.total_amount.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <button 
                        onClick={() => handleToggleStatus(inv.uid, inv.status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                            inv.status === 'paid' 
                            ? 'bg-green-50 text-green-600 border border-green-100' 
                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}
                    >
                        {inv.status === 'paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {inv.status}
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link 
                            href={`/super-admin/bills/${inv.uid}`}
                            className="p-2 text-gray-400 hover:text-[#3457B4] hover:bg-blue-50 rounded-lg transition-all"
                            title="Print Bill"
                        >
                            <Printer size={18} />
                        </Link>
                        <Link 
                            href={`/super-admin/bills/${inv.uid}`}
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                        >
                            <ExternalLink size={18} />
                        </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {invoices.length === 0 && !loading && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FileText className="text-gray-200" size={32} />
                </div>
                <h3 className="text-gray-900 font-bold">No Invoices Found</h3>
                <p className="text-gray-400 text-sm max-w-xs mt-2">Try searching for a different invoice number or association.</p>
            </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
             <div className="w-8 h-8 border-4 border-[#3457B4] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
