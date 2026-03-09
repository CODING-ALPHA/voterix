"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  return (
    <div className="w-full flex flex-col min-h-[800px] pb-12 animate-in fade-in duration-300">
      
      {/* Banner Background */}
      <div className="relative w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] -ml-4 md:-ml-6 -mt-4 md:-mt-6 h-[240px] md:h-[280px] bg-[#243160] overflow-hidden mb-6">
        <Image 
          src="/cover.svg" 
          alt="Profile Cover Background" 
          fill 
          className="object-fill md:object-cover mix-blend-screen"
          priority
        />
        
        <div className="absolute top-8 md:top-12 left-4 md:left-8 z-10">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Profile</h1>
        </div>
      </div>

      {/* Main Content (Cards) - Overlapping the banner */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 w-full relative z-20 -mt-32 md:-mt-48">
        
        {/* Left Side: Profile Info Card */}
        <div className="w-full lg:w-[320px] bg-white border border-gray-100 shadow-sm flex flex-col items-center flex-shrink-0 relative h-fit">
          <div className="w-full p-8 flex flex-col items-center relative text-center">
            {/* Avatar Container */}
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 mb-5">
              <Image 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=NacosBowen" 
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            
            {/* floating camera button */}
            <button className="absolute top-[148px] ml-28 w-9 h-9 bg-[#243160] text-white rounded-full flex items-center justify-center border-[3px] border-white shadow-sm hover:bg-[#3a4d87] transition-colors">
              <Camera size={14} />
            </button>

            <h2 className="text-lg md:text-xl font-bold text-gray-900 uppercase tracking-wide">NACOS BOWEN</h2>
          </div>

          <div className="w-full flex border-t border-gray-100 justify-between items-center px-6 py-5">
            <span className="text-sm font-semibold text-gray-900">Uploaded Election</span>
            <span className="text-sm font-bold text-gray-500">30</span>
          </div>
          <div className="w-full flex border-t border-gray-100 justify-between items-center px-6 py-5">
            <span className="text-sm font-semibold text-gray-900">Completed Election</span>
            <span className="text-sm font-bold text-[#b42e2e]">30</span>
          </div>
        </div>

        {/* Right Side: Account Settings Form Card */}
        <div className="flex-1 bg-white border border-gray-100 shadow-sm p-6 md:p-8 h-fit">
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8 md:mb-10">
            <div className="inline-block border-b-2 border-gray-900 pb-3">
              <h3 className="text-base font-bold text-gray-900 tracking-wide">Account Settings</h3>
            </div>
          </div>

          <form className="space-y-6 md:space-y-8" onSubmit={(e) => e.preventDefault()}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">Name of Organization</label>
                <input 
                  type="text" 
                  defaultValue="NACOS BOWEN"
                  className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#405189]/20 focus:border-[#405189] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">Email</label>
                <input 
                  type="email" 
                  defaultValue="olivia@untitledui.com"
                  className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#405189]/20 focus:border-[#405189] transition-all"
                />
              </div>
            </div>

            {!isResettingPassword ? (
              // Default View: Single Password Field with Reset Logic
              <div className="space-y-2 max-w-[50%] pr-4 sm:max-w-none sm:pr-0">
                <label className="text-sm font-semibold text-gray-900">Password</label>
                <div className="w-full md:w-1/2 xs:w-full space-y-3">
                  <input 
                    type="password" 
                    defaultValue="*********"
                    readOnly
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#405189]/20 focus:border-[#405189] transition-all"
                  />
                  <p className="text-sm text-gray-500 font-medium">
                    Forgot password?{" "}
                    <button 
                      type="button"
                      onClick={() => setIsResettingPassword(true)}
                      className="text-gray-900 font-bold hover:underline transition-all"
                    >
                      Reset
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              // Reset Password View
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">New password</label>
                  <input 
                    type="password" 
                    placeholder="*********"
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#405189]/20 focus:border-[#405189] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      placeholder="*********"
                      className="w-full h-12 px-4 rounded-lg border border-[#F04438] bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F04438]/20 transition-all pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-[#F04438]" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6">
              <button 
                type="button"
                className={`py-2.5 px-8 rounded-lg font-semibold text-sm transition-all shadow-sm ${
                  isResettingPassword 
                    ? "bg-[#3a4d87] text-white hover:opacity-90 mt-5"
                    : "bg-[#243160] text-white hover:opacity-90" 
                }`}
                onClick={() => {
                  if (isResettingPassword) {
                    setIsResettingPassword(false);
                  }
                }}
              >
                Update
              </button>
            </div>

          </form>
        </div>
      </div>
      
    </div>
  );
}
