"use client";

import React, { useState, useEffect } from "react";
import { getSuperAdminStats, listAssociationBilling, type SuperAdminStats, type AssociationBilling } from "@/lib/billing.api";
import { getMediaUrl } from "@/lib/api-client";
import { 
  Users, 
  ArchiveRestore, 
  Vote, 
  Wallet, 
  Clock,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Activity
} from "lucide-react";
import Link from "next/link";

export default function SuperAdminOverview() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [associations, setAssociations] = useState<AssociationBilling[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, assocRes] = await Promise.all([
          getSuperAdminStats(),
          listAssociationBilling()
        ]);
        
        if (statsRes.status === "success") setStats(statsRes.data);
        if (assocRes.status === "success") setAssociations(assocRes.data);
        
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const metricCards = [
    { 
      title: "Associations", 
      value: stats?.total_associations || 0, 
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+4 this month"
    },
    { 
      title: "Active Elections", 
      value: stats?.total_elections || 0, 
      icon: ArchiveRestore,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "Across all apps"
    },
    { 
      title: "Total Votes Cast", 
      value: stats?.total_votes_cast || 0, 
      icon: Vote,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "Platform wide"
    },
    { 
      title: "Total Revenue", 
      value: `₦${(stats?.total_revenue || 0).toLocaleString()}`, 
      icon: Wallet,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: "Cumulative"
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#3457B4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Platform Overview</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Real-time performance metrics across the Voterix ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Activity size={14} />
                System Online
            </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-3 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-500`}>
                <card.icon size={22} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-600 transition-colors">{card.trend}</span>
            </div>
            <div className="relative z-10">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">{card.value}</p>
            </div>
            {/* Subtle radial gradient on hover */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Revenue Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#1A1F2B] to-[#2D3648] p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 p-8 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">
                <Wallet size={200} />
            </div>
            <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-2 text-[#3457B4] mb-8">
                    <Clock size={20} className="animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Pending Revenue</span>
                </div>
                <h3 className="text-5xl font-bold mb-3 tracking-tighter">₦{(stats?.pending_revenue || 0).toLocaleString()}</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-[240px]">Invoices generated from completed elections waiting for payment processing.</p>
                
                <Link href="/super-admin/bills" className="mt-12 w-full bg-[#3457B4] hover:bg-blue-600 text-white h-14 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                    Review Pending Invoices
                    <ArrowUpRight size={20} />
                </Link>
            </div>
        </div>

        {/* Top Performing Associations */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h4 className="font-bold text-gray-900">Key Associations</h4>
                <Link href="/super-admin/associations" className="text-xs font-bold text-[#3457B4] hover:underline flex items-center gap-1 group">
                    Manage All
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
            
            <div className="space-y-4 flex-1">
                {associations.slice(0, 4).map((assoc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 font-bold text-sm group-hover:bg-[#3457B4] group-hover:text-white transition-all overflow-hidden">
                                {assoc.profile_picture ? (
                                    <img src={getMediaUrl(assoc.profile_picture) as string} alt={assoc.name} className="w-full h-full object-cover" />
                                ) : (
                                    assoc.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">{assoc.name}</p>
                                <p className="text-xs text-gray-400 font-medium">{assoc.total_elections} Elections Conducted</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900 text-sm">{assoc.total_votes.toLocaleString()} Votes</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Active Partner</p>
                        </div>
                    </div>
                ))}
                
                {associations.length === 0 && (
                     <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Users className="text-gray-200 mb-4" size={48} />
                        <p className="text-sm text-gray-400 font-medium">No active associations found yet.</p>
                     </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
