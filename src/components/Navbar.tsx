"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-[70px] items-center justify-center bg-[#F1F3F5] border-b border-black/5">
      <div className="w-full max-w-[1440px] px-6 md:px-10 lg:px-[80px] flex items-center justify-between">
      {/* Logo */}
      <div className="flex-none z-50">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.svg" 
            alt="Voterix Logo" 
            width={120} 
            height={40} 
            className="h-8 md:h-10 w-auto"
          />
        </Link>
      </div>

      {/* Desktop Nav Links and CTA grouped to the right */}
      <div className="hidden md:flex flex-1 justify-end items-center gap-6 lg:gap-8">
        <div className="flex items-center gap-6 lg:gap-8 pr-2 lg:pr-4">
          {["Home", "About", "Pricing"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="font-normal transition-opacity hover:opacity-70"
              style={{
                color: '#111',
                fontFamily: 'var(--font-poppins)',
                fontSize: '14.993px',
                letterSpacing: '-0.136px',
                lineHeight: 'normal'
              }}
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <Link
            href="/login"
            className="text-[#111] font-semibold text-[15px] font-[family-name:var(--font-poppins)] hover:opacity-70 transition-opacity"
          >
            Log in
          </Link>
          <Link
            href="/register"
            style={{
              display: 'inline-flex',
              padding: '10px 24px',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '10px',
              background: 'linear-gradient(180deg, #3457B4 0%, #4A496A 100%)',
              color: 'white',
              fontWeight: '600',
              fontSize: '15px',
              boxShadow: '0 8px 16px rgba(52, 87, 180, 0.15)'
            }}
            className="hover:shadow-2xl transition-all active:scale-[0.98] font-[family-name:var(--font-manrope)]"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Mobile Menu Button - Hamburger */}
      <div className="flex md:hidden items-center z-50 h-[70px]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex flex-col justify-center items-center w-10 h-10 gap-[7.5px] relative transition-all duration-300 ${isOpen ? 'scale-90' : 'scale-75'}`}
          aria-label="Toggle Menu"
        >
          <span className={`w-10 h-[3px] bg-[#000840] rounded-full transition-all duration-300 origin-center ${isOpen ? 'rotate-45 absolute' : ''}`} />
          <span className={`w-10 h-[3px] bg-[#000840] rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100'}`} />
          <span className={`w-10 h-[3px] bg-[#000840] rounded-full transition-all duration-300 origin-center ${isOpen ? '-rotate-45 absolute' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#F1F3F5] z-40 flex flex-col items-center justify-center gap-10 transition-all duration-500 ease-in-out md:hidden ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-full invisible'}`}>
          <div className="flex flex-col items-center gap-8">
            {["Home", "About", "Pricing"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold text-[#000840] hover:text-[#405189] transition-colors font-[family-name:var(--font-manrope)]"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center gap-6 w-full mt-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold text-[#000840] hover:text-[#405189] transition-colors font-[family-name:var(--font-manrope)]"
            >
              Log in
            </Link>

            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              style={{
                padding: '12px 34px',
                borderRadius: '10px',
                background: 'linear-gradient(180deg, #3457B4 0%, #4A496A 100%)',
                color: 'white',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              Sign up
            </Link>
          </div>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
