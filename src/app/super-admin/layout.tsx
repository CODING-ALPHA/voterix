"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard,
  Settings, 
  LogOut,
  Search,
  ChevronDown,
  Menu,
  X as CloseIcon,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);

  // Redirect if not superadmin/staff
  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.is_staff)) {
      router.push("/login");
    }
  }, [user, isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#3457B4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user?.is_staff) return null;

  const getInitials = (name?: string) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2) || "SA";
  };

  const navItems = [
    { name: "Overview", href: "/super-admin", icon: LayoutDashboard },
    { name: "Associations", href: "/super-admin/associations", icon: Users },
    { name: "Invoices", href: "/super-admin/bills", icon: CreditCard },
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

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-[280px] bg-[#1A1F2B] text-white flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:static lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
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
                className="object-contain brightness-0 invert"
              />
            </div>
          </Link>
          <button className="lg:hidden absolute right-4 p-2 hover:bg-white/10 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="px-4 mb-4">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Admin Control</span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/super-admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-[#3457B4] text-white shadow-lg shadow-blue-500/20" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} strokeWidth={2} />
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
            <button className="lg:hidden p-2 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-colors" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
                 <ShieldCheck className="text-[#3457B4]" size={20} />
                 <span className="font-bold text-zinc-900 text-sm hidden sm:block">Super Admin Portal</span>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 pl-3 md:pl-4 border-l border-zinc-100 hover:opacity-80 transition-opacity focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#3457B4] flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-blue-500/20">
                  {getInitials(user?.name) || "SA"}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="font-bold text-[#3457B4] text-[0.65rem] uppercase tracking-wider">Superuser</span>
                  <span className="font-medium text-gray-900 text-xs">{user?.name || "Admin"}</span>
                </div>
                <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)} />
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-zinc-100 z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button className="w-full h-10 flex items-center gap-3 px-4 text-xs font-medium text-[#FF4D4C] hover:bg-red-50 transition-colors" onClick={() => { setIsProfileMenuOpen(false); logout(); }}>
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
        <main className="flex-1 overflow-y-auto bg-[#F8F9FB] flex flex-col p-4 md:p-8">
           <div className="max-w-[1400px] mx-auto w-full">
               {children}
           </div>
           <footer className="mt-auto py-8 flex justify-center items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Voterix Central &copy; 2025
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
