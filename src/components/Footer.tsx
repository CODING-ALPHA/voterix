import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Get in touch", href: "/contact" },
    { name: "FAQs", href: "/faqs" }
  ];

  return (
    <footer className="w-full bg-white flex flex-col items-center justify-start overflow-hidden pt-[clamp(40px,5vw,60px)]">
      
      <div className="w-full max-w-[1280px] mx-auto px-[clamp(24px,5vw,75px)] flex flex-col items-center gap-[clamp(32px,4vw,40px)]">
        
        {/* Logo */}
        <Link href="/" className="transition-transform duration-300 hover:scale-105">
          <Image 
            src="/logo.svg" 
            alt="Voterix Logo" 
            width={120} 
            height={40} 
            className="w-auto h-[clamp(28px,4vw,36px)]"
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-[clamp(20px,3vw,32px)] text-center">
          {links.map((link, index) => (
            <Link 
              key={index}
              href={link.href}
              className="text-[#3457B4] font-[family-name:var(--font-inter)] font-normal transition-opacity duration-300 hover:opacity-75"
              style={{
                fontSize: 'clamp(14px, 1.5vw, 16px)',
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-[clamp(16px,2vw,24px)] pb-[clamp(16px,3vw,32px)]">

          {/* Facebook */}
          <Link href="#" className="w-[32px] h-[32px] rounded-full bg-gradient-to-b from-[#3457B4] to-[#4A496A] flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-sm">
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 0H6.5C4.84315 0 3.5 1.34315 3.5 3V5H1.5V8H3.5V16H6.5V8H8.5L9.5 5H6.5V3.5C6.5 3.22386 6.72386 3 7 3H8.5V0Z" fill="white"/>
            </svg>
          </Link>

          {/* Instagram */}
          <Link href="#" className="w-[32px] h-[32px] rounded-full bg-gradient-to-b from-[#3457B4] to-[#4A496A] flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 2C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2H7ZM7 4H17C18.6569 4 20 5.34315 20 7V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4ZM17 5.5C16.1716 5.5 15.5 6.17157 15.5 7C15.5 7.82843 16.1716 8.5 17 8.5C17.8284 8.5 18.5 7.82843 18.5 7C18.5 6.17157 17.8284 5.5 17 5.5ZM12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7ZM12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9Z" fill="white"/>
            </svg>
          </Link>

          {/* LinkedIn */}
          <Link href="#" className="w-[32px] h-[32px] rounded-full bg-gradient-to-b from-[#3457B4] to-[#4A496A] flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3ZM8.33854 18.3333H5.66667V9.66667H8.33854V18.3333ZM7.0026 8.47917C6.14896 8.47917 5.45833 7.78854 5.45833 6.9349C5.45833 6.08125 6.14896 5.39062 7.0026 5.39062C7.85625 5.39062 8.54688 6.08125 8.54688 6.9349C8.54688 7.78854 7.85625 8.47917 7.0026 8.47917ZM18.3333 18.3333H15.6615V13.8854C15.6615 12.8229 15.6406 11.4583 14.1615 11.4583C12.6615 11.4583 12.4323 12.6302 12.4323 13.8073V18.3333H9.76042V9.66667H12.3281V10.8542H12.3646C12.724 10.1771 13.5938 9.46875 14.8854 9.46875C17.5833 9.46875 18.3333 11.2396 18.3333 13.5521V18.3333Z" fill="white"/>
            </svg>
          </Link>

        </div>

      </div>

      {/* Full-width Divider & Copyright */}
      <div className="w-full mt-[clamp(24px,4vw,32px)]">
        <div className="w-full h-[1px] bg-[#DFDFDF]" />
        
        <div className="w-full flex items-center justify-center py-[clamp(16px,2vw,24px)] px-[clamp(24px,5vw,75px)]">
          <p 
            className="text-[#535353] font-[family-name:var(--font-inter)] opacity-90 text-center uppercase md:normal-case font-normal"
            style={{
              fontSize: 'clamp(12px, 1.3vw, 14px)'
            }}
          >
            Non Copyrighted © 2022 Upload by rich technologies
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
