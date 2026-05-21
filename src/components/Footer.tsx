"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const links = [
    { name: "Home", target: "#" },
    { name: "About", target: "#about" },
    { name: "Services", target: "#services" },
    { name: "Get in touch", target: "#contact" },
    { name: "FAQs", target: "#faqs" }
  ];

  return (
    <footer className="w-full bg-white flex flex-col items-center justify-start overflow-hidden pt-[clamp(40px,5vw,60px)]">
      
      <div id="contact" className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[80px] flex flex-col min-[425px]:flex-row justify-between items-center min-[425px]:items-start gap-x-6 gap-y-10">
        
        {/* Left Column: Logo & Contact Info */}
        <div className="flex-[2] max-w-[360px] flex flex-col items-center min-[425px]:items-start text-center min-[425px]:text-left gap-6">
          {/* Logo */}
          <Link href="/" className="transition-transform duration-300 hover:scale-105">
            <Image 
              src="/logo.svg" 
              alt="Voterix Logo" 
              width={150} 
              height={50} 
              className="w-auto h-[clamp(36px,5vw,46px)]"
            />
          </Link>
 
          <div className="flex flex-col items-center min-[425px]:items-start gap-2 mt-2">
            <h4 
              className="text-[#2D2D2D] font-black"
              style={{ fontFamily: 'var(--font-lato)', fontSize: 'clamp(20px, 2.5vw, 24px)' }}
            >
              Still Have Questions?
            </h4>
            <p 
              className="text-[#525252] font-normal"
              style={{ fontFamily: 'var(--font-mulish)', fontSize: 'clamp(14px, 1.5vw, 15px)' }}
            >
              Got questions about Voterix or setting up your next election? Our team is here to help. Contact us for quick and friendly support.
            </p>
          </div>
 
          <div className="flex flex-col items-center min-[425px]:items-start gap-4 mt-4">
            <h4 className="text-[#2D2D2D] text-[18px] font-[family-name:var(--font-poppins)] font-semibold">
              Connect with us
            </h4>
            <div className="flex flex-wrap items-center justify-center min-[425px]:justify-start gap-3">
              {/* Email Icon */}
              <a 
                href="mailto:4orgehub@gmail.com" 
                className="w-9 h-9 rounded-full border border-[#DFDFDF] flex items-center justify-center text-[#667085] transition-all duration-300 hover:scale-110 hover:border-[#3056D3] hover:text-[#3056D3] cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="5.25" width="18" height="13.5" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 8L12 13L21 8" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </a>
 
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/4orge_tech?igsh=MXBzNHpydHJ1M3hrZQ==" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#DFDFDF] flex items-center justify-center text-[#667085] transition-all duration-300 hover:scale-110 hover:border-[#3056D3] hover:text-[#3056D3]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 2C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2H7ZM7 4H17C18.6569 4 20 5.34315 20 7V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4ZM17 5.5C16.1716 5.5 15.5 6.17157 15.5 7C15.5 7.82843 16.1716 8.5 17 8.5C17.8284 8.5 18.5 7.82843 18.5 7C18.5 6.17157 17.8284 5.5 17 5.5ZM12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7ZM12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9Z" fill="currentColor"/>
                </svg>
              </a>
 
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/company/4orge/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#DFDFDF] flex items-center justify-center text-[#667085] transition-all duration-300 hover:scale-110 hover:border-[#3056D3] hover:text-[#3056D3]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3ZM8.33854 18.3333H5.66667V9.66667H8.33854V18.3333ZM7.0026 8.47917C6.14896 8.47917 5.45833 7.78854 5.45833 6.9349C5.45833 6.08125 6.14896 5.39062 7.0026 5.39062C7.85625 5.39062 8.54688 6.08125 8.54688 6.9349C8.54688 7.78854 7.85625 8.47917 7.0026 8.47917ZM18.3333 18.3333H15.6615V13.8854C15.6615 12.8229 15.6406 11.4583 14.1615 11.4583C12.6615 11.4583 12.4323 12.6302 12.4323 13.8073V18.3333H9.76042V9.66667H12.3281V10.8542H12.3646C12.724 10.1771 13.5938 9.46875 14.8854 9.46875C17.5833 9.46875 18.3333 11.2396 18.3333 13.5521V18.3333Z" fill="currentColor"/>
                </svg>
              </a>

              {/* X (formerly Twitter) */}
              <a 
                href="https://x.com/4orge_?s=11" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#DFDFDF] flex items-center justify-center text-[#667085] transition-all duration-300 hover:scale-110 hover:border-[#3056D3] hover:text-[#3056D3]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
 
        {/* Right Column: Navigation Links */}
        <div className="flex flex-col items-center min-[425px]:items-end gap-10 pt-4">
          
          {/* Navigation Links */}
          <div className="flex flex-col items-center min-[425px]:items-end justify-center gap-4 text-center min-[425px]:text-right">
            <h4 className="text-[#2D2D2D] text-[18px] font-[family-name:var(--font-poppins)] font-semibold">
              Menu
            </h4>
            <div className="flex flex-col items-center min-[425px]:items-end gap-3">
              {links.map((link, index) => {
                if (isHome) {
                  return (
                    <a 
                      key={index}
                      href={link.target}
                      className="text-black font-[family-name:var(--font-inter)] font-normal transition-colors duration-300 hover:text-[#3056D3]"
                      style={{
                        fontSize: 'clamp(14px, 1.5vw, 16px)',
                      }}
                    >
                      {link.name}
                    </a>
                  );
                }
 
                return (
                  <Link 
                    key={index}
                    href={`/${link.target}`}
                    className="text-black font-[family-name:var(--font-inter)] font-normal transition-colors duration-300 hover:text-[#3056D3]"
                    style={{
                      fontSize: 'clamp(14px, 1.5vw, 16px)',
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
 
        </div>
      </div>
 
      {/* Full-width Divider & Copyright */}
      <div className="w-full mt-[clamp(24px,4vw,32px)]">
        <div className="w-full h-[1px] bg-[#DFDFDF]" />
        
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-center py-[clamp(16px,2vw,24px)] px-6 md:px-10 lg:px-[80px]">
          <p 
            className="text-[#535353] font-[family-name:var(--font-inter)] opacity-90 text-center uppercase min-[425px]:normal-case font-normal"
            style={{
              fontSize: 'clamp(12px, 1.3vw, 14px)'
            }}
          >
            © 2026 Voterix. All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
