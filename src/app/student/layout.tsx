"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  Eye, 
  Headset, 
  LogOut,
  Menu,
  X as CloseIcon
} from "lucide-react";

function StudentLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const queryElectionId = searchParams.get("election") || searchParams.get("id");
  const queryAssocId = searchParams.get("assoc");

  const [activeElectionId, setActiveElectionId] = useState<string | null>(null);
  const [activeAssocId, setActiveAssocId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // 1. Sync from URL to LocalStorage (if present)
    if (queryElectionId) localStorage.setItem("voter_active_election", queryElectionId);
    if (queryAssocId) localStorage.setItem("voter_active_assoc", queryAssocId);

    // 2. Set active state from URL or LocalStorage
    setActiveElectionId(queryElectionId || localStorage.getItem("voter_active_election"));
    setActiveAssocId(queryAssocId || localStorage.getItem("voter_active_assoc"));
  }, [queryElectionId, queryAssocId]);

  const handleVoterLogout = () => {
    localStorage.removeItem("voter_session_token");
    localStorage.removeItem("voter_uid");
    localStorage.removeItem("voter_name");
    localStorage.removeItem("voter_matric");
    localStorage.removeItem("voter_active_election");
    localStorage.removeItem("voter_active_assoc");
    
    const params = new URLSearchParams();
    if (activeElectionId) params.set("election", activeElectionId);
    if (activeAssocId) params.set("assoc", activeAssocId);
    
    router.push(`/student/login?${params.toString()}`);
  };

  const navItems = [
    { name: "Dashboard", href: "/student", icon: LayoutDashboard },
    { name: "Election", href: "/student/election", icon: Building2 },
    { name: "Preview", href: "/student/preview", icon: Eye },
  ];

  const buildHref = (href: string) => {
    const eid = activeElectionId || queryElectionId;
    if (!eid) return href;
    const params = new URLSearchParams();
    params.set("election", eid);
    const aid = activeAssocId || queryAssocId;
    if (aid) params.set("assoc", aid);
    return `${href}?${params.toString()}`;
  };

  const isAuthPage = pathname === "/student/login" || pathname === "/student/verify" || pathname.startsWith("/student/login?");
  
  if (isAuthPage) {
    return <>{children}</>;
  }
 
  return (
    <div className="flex h-screen bg-[#F8F9FB] font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
    <aside className={`
        fixed inset-y-0 left-0 z-[70] w-[260px] bg-[#243160] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="flex h-[120px] items-center justify-between px-6 relative">
          <Link href={buildHref("/student")} className="flex items-center justify-center w-full">
            <div className="relative w-full h-[80px]">
              <Image
                src="/logo.svg"
                alt="Voterix Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>
          <button className="lg:hidden absolute right-4 p-2 top-8 hover:bg-white/10 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/student" && pathname.startsWith(item.href));
            return (
               <Link
               key={item.href}
               href={buildHref(item.href)}
               onClick={() => setIsSidebarOpen(false)}
               className={`flex items-center gap-3 px-4 py-2.5 rounded-full font-bold transition-all duration-200 ${
                 isActive 
                   ? "bg-white text-[#243160] shadow-md" 
                   : "text-white/90 hover:bg-white/5 hover:text-white"
               }`}
             >
               <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#243160]" : "text-white/90"} />
               <span className="text-sm uppercase tracking-wide">{item.name}</span>
             </Link>
            );
          })}
        </nav>
        {/* Bottom Actions */}
        <div className="p-4 space-y-2 border-t border-white/10 mt-auto">
          <button 
            className="w-full h-11 flex items-center gap-3 px-4 rounded-xl font-bold text-white/90 hover:bg-white/5 hover:text-white transition-all duration-200"
            onClick={() => window.open('mailto:support@voterix.com')}
          >
            <Headset size={18} strokeWidth={2} />
            <span className="text-xs uppercase tracking-wide">Contact Support</span>
          </button>
          <button 
            className="w-full h-11 flex items-center gap-3 px-4 rounded-xl font-bold text-[#FF4D4C] hover:bg-red-500/10 transition-all duration-200"
            onClick={() => handleVoterLogout()}
          >
            <LogOut size={18} strokeWidth={2} />
            <span className="text-xs uppercase tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Hamburger Header (Only on mobile) */}
        <header className="h-[64px] bg-white border-b border-zinc-100 flex items-center px-4 shrink-0 lg:hidden">
            <button 
              className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span className="ml-4 font-black text-[#243160] tracking-tighter">VOTERIX</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FB] flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <footer className="py-6 px-8 flex justify-center items-center">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
              voterix &copy; 2025
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#F8F9FB]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#243160]"></div>
      </div>
    }>
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </Suspense>
  );
}

