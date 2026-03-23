"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ArchiveRestore, 
  Users, 
  Eye, 
  Bell, 
  Settings, 
  Headset, 
  LogOut,
  Search,
  ChevronDown,
  Menu,
  X as CloseIcon
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);

  const getInitials = (name?: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "AD";
  };

  const getFirstName = (name?: string) => {
    if (!name) return "Admin";
    return name.trim().split(/\s+/)[0] || "Admin";
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Election", href: "/dashboard/elections", icon: ArchiveRestore },
    { name: "Voters", href: "/dashboard/voters", icon: Users },
    { name: "Preview", href: "/dashboard/preview", icon: Eye },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

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
          <Link href="/" className="flex items-center justify-center w-full">
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
          <button className="lg:hidden absolute right-4 p-2 hover:bg-white/10 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-[#F1F4FF] text-[#405189] shadow-sm" 
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} strokeWidth={2} className={isActive ? "text-[#405189]" : "text-white/80"} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-[64px] bg-white border-b border-zinc-100 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            {/* Hamburger Menu (Mobile) */}
            <button 
              className="lg:hidden p-2 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 text-gray-500 w-full max-w-md">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            {/* Notification */}
            <button className="relative p-2 text-zinc-400 hover:text-zinc-600">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 pl-3 md:pl-4 border-l border-zinc-100 hover:opacity-80 transition-opacity focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {getInitials(user?.name) || "NB"}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="font-bold text-[#FE9431] text-[0.65rem] uppercase tracking-wider">Admin</span>
                  <span className="font-medium text-gray-900 text-xs">{getFirstName(user?.name)}</span>
                </div>
                <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-zinc-100 z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                      className="w-full h-10 flex items-center gap-3 px-4 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-[#3457B4] transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Headset size={18} strokeWidth={2} />
                      <span>Contact Support</span>
                    </button>
                    <div className="h-px bg-zinc-100 my-1"></div>
                    <button 
                      className="w-full h-10 flex items-center gap-3 px-4 text-xs font-medium text-[#FF4D4C] hover:bg-red-50 transition-colors"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={18} strokeWidth={2} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FB] flex flex-col">
          <div className="flex-1 p-4 md:p-6 pb-0">
             <div className="max-w-[1400px] mx-auto">
               {children}
             </div>
          </div>
          <footer className="py-6 flex justify-center items-center">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
              voterix &copy; 2025
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

