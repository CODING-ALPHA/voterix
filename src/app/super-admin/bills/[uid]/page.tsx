"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInvoiceDetail, type Invoice } from "@/lib/billing.api";
import { Printer, ArrowLeft, Download, ShieldCheck, Mail, Globe, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import * as htmlToImage from "html-to-image";

export default function InvoicePrintPage() {
  const { uid } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getInvoiceDetail(uid as string);
        if (res.status === "success") {
          setInvoice(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch invoice:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [uid]);

  const handleDownloadImage = async () => {
    const element = document.getElementById("invoice-document");
    if (!element) return;
    
    try {
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 4,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `Invoice_${invoice?.invoice_number || "download"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading Invoice...</div>;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 print:max-w-none print:m-0 print:p-0">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors">
          <ArrowLeft size={18} />
          Back to List
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadImage}
            className="flex items-center gap-2 h-10 px-6 bg-[#3457B4] border border-transparent rounded-xl font-bold text-sm text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
          >
            <ImageIcon size={18} />
            Download Invoice (Image)
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div id="invoice-document" className="bg-white p-12 md:p-16 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative md:overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full -mr-32 -mt-32" />
        
        {/* Header Section */}
        <div className="relative flex flex-col md:flex-row justify-between gap-12 pb-16">
          <div className="space-y-8 max-w-sm">
            <div className="relative w-40 h-14">
              <Image src="/logo.svg" alt="Voterix" fill className="object-contain object-left" />
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Voterix Election Services</h2>
              <p className="text-gray-500 text-xs leading-relaxed">
                <span className="inline-block mt-2 font-bold text-[#3457B4]">support@voterix.com.ng • www.voterix.com.ng</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 min-w-[280px] flex flex-col justify-center">
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-6">Invoice</h1>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Number</span>
                <span className="text-sm font-black text-gray-900">{invoice.invoice_number}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</span>
                <span className="text-sm font-black text-gray-900">{invoice.date}</span>
              </div>
              <div className="flex flex-col col-span-2 mt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">Status</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] py-2 rounded-xl text-center border ${
                  invoice.status === 'paid' 
                  ? 'bg-green-50 text-green-600 border-green-100' 
                  : 'bg-blue-50 text-[#3457B4] border-blue-100'
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Client & Billing Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-16 border-t border-gray-50">
          <div className="space-y-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Bill To</span>
            <div className="p-1">
              <p className="text-2xl font-black text-gray-900 mb-1">{invoice.association_name}</p>
              <p className="text-gray-500 text-sm font-medium">Verified Institutional Client</p>
            </div>
          </div>
          <div className="space-y-4 md:text-right">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Project Particulars</span>
            <div className="p-1">
              <p className="text-lg font-bold text-gray-900 mb-1">{invoice.election_title}</p>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider italic">Voterix Digital Ballot System</p>
            </div>
          </div>
        </div>

        {/* Detailed Items Table */}
        <div className="mt-8 rounded-[2rem] border border-gray-100 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Description</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty/Votes</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Unit Price</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Row Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-10 py-10 max-w-sm">
                  <p className="text-base font-black text-gray-900 mb-1">Election Vote Processing</p>
                  <p className="text-xs text-gray-400 leading-relaxed">Platform usage fee for encrypted digital participation, results auditing, and secure storage.</p>
                </td>
                <td className="px-10 py-10 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-lg font-black text-gray-900">{invoice.total_votes}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Verified</span>
                  </div>
                </td>
                <td className="px-10 py-10 text-center text-sm font-bold text-gray-900">
                  ₦{invoice.price_per_vote}
                </td>
                <td className="px-10 py-10 text-right text-xl font-black text-gray-900">
                  ₦{invoice.total_amount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary & Payment Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-end">
          <div className="space-y-8">
            <div className="bg-blue-50/30 p-8 rounded-[2rem] border border-blue-50">
              <h4 className="text-[10px] font-black text-[#3457B4] uppercase tracking-widest mb-4">Payment Instructions</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500 font-bold uppercase tracking-tighter">Bank Name:</span>
                  <span className="text-gray-900 font-black">GT Bank</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500 font-bold uppercase tracking-tighter">Account Name:</span>
                  <span className="text-gray-900 font-black">Adedolapo Atiba</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500 font-bold uppercase tracking-tighter">Account No:</span>
                  <span className="text-gray-900 font-black">0729778294</span>
                </div>
                <p className="text-[10px] text-blue-400 font-medium italic mt-4">* Please include invoice #{invoice.invoice_number} as payment reference.</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
              Payment is due within 7 business days. Late payments may be subject to a 5% monthly administrative fee. 
              Services are provided under the Voterix Master Service Agreement.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 text-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/10">
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-xs opacity-60 font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>₦{invoice.total_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs opacity-60 font-bold uppercase tracking-widest">
                  <span>VAT (0%)</span>
                  <span>₦0.00</span>
                </div>
              </div>
              <div className="h-px bg-white/10 mb-8" />
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none mb-1">Total Due</span>
                  <span className="text-4xl font-black tracking-tighter text-[#FE9431]">₦{invoice.total_amount.toLocaleString()}</span>
                </div>
                <ShieldCheck size={32} className="text-white/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="mt-24 pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Authorised Digital Invoice</p>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4 md:mt-0">
               <ShieldCheck size={14} className="text-[#3457B4]" />
               Securely Generated by Voterix Engine
          </div>
        </div>
      </div>
    </div>
  );
}
