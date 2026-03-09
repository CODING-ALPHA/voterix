import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Election Created", value: "0", percentage: "0" },
    { title: "Election completed", value: "0", percentage: "0%" },
    { title: "Total Students", value: "0", percentage: "0%" },
    { title: "Voters", value: "0", percentage: "0%" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-lg md:text-xl font-semibold text-gray-900 mb-0.5">Dashboard</h1>
        <p className="text-gray-500 text-[11px] md:text-xs font-medium">
          Welcome to Learning Management Dashboard.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm flex flex-col justify-between border border-gray-50">
            <h3 className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-3 opacity-80">{stat.title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900 leading-none">{stat.value}</span>
              <div className="relative w-10 h-10 flex items-center justify-center rounded-full border-[2.5px] border-zinc-100">
                {/* Circular indicator */}
                {stat.percentage !== "0" && (
                  <svg className="absolute inset-0 w-full h-full overflow-visible transform -rotate-90">
                    <circle cx="18" cy="18" r="18" fill="none" stroke="#DFE2EE" strokeWidth="3" />
                    <circle cx="18" cy="18" r="18" fill="none" stroke="#A7C3F8" strokeWidth="3" strokeDasharray="113" strokeDashoffset="108" className="opacity-80" />
                  </svg>
                )}
                <span className="text-[10px] font-bold text-gray-700 z-10">{stat.percentage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Empty State Content */}
      <div className="bg-white rounded-xl shadow-sm min-h-[400px] md:min-h-[480px] flex flex-col pt-5 pb-10 overflow-hidden border border-gray-200">
        <div className="px-6 mb-6 border-b border-transparent">
          <h2 className="text-gray-900 font-semibold text-base">Election</h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center mt-4">
          {/* Central Avatar Icon */}
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Image 
              src="/users-03.svg"
              alt="No Elections"
              width={48}
              height={48}
              className="opacity-40"
            />
          </div>

          <h3 className="text-gray-900 text-lg font-semibold mb-2 tracking-tight">
            No Election created at this time
          </h3>
          <p className="text-gray-500 font-medium max-w-[240px] leading-relaxed mb-6 text-sm">
            Create election for your institution to see election here
          </p>

          <Link 
            href="/dashboard/elections/add"
            className="flex items-center gap-2 bg-[#1C1F26] text-white h-10 px-6 rounded-lg font-medium hover:bg-black transition-all shadow-md"
          >
            <Plus size={16} strokeWidth={2} />
            Create Election
          </Link>
        </div>
      </div>

    </div>
  );
}
