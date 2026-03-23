"use client";

import React from "react";
import Image from "next/image";

const logos = [
  { name: "Airbnb", color: "#FF5A5F" },
  { name: "Google", color: "#4285F4" },
  { name: "Amazon", color: "#000000" },
  { name: "Microsoft", color: "#737373" },
];

const LogoBar = () => {
  return (
    <section className="w-full bg-[#F1F3F5] flex justify-center py-14">
      <div className="w-full max-w-[1440px] px-6 md:px-10 lg:px-[80px] flex flex-col items-center justify-center gap-4">
      <h2 
        className="text-center"
        style={{ 
          color: '#484C74',
          fontFamily: 'var(--font-lato)',
          fontSize: 'clamp(28px, 6vw, 36px)',
          fontStyle: 'normal',
          fontWeight: 900,
          lineHeight: 'normal',
          letterSpacing: '-0.196px'
        }}
      >
        They Trusted Us. You Can Too.
      </h2>
      
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-24 w-full max-w-[1159px] py-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
        {logos.map((logo) => (
          <div key={logo.name} className="flex items-center justify-center">
            <span 
              className="font-bold tracking-tight"
              style={{ 
                color: logo.name === "Amazon" ? "#000" : logo.color, 
                fontFamily: 'var(--font-poppins)',
                fontSize: 'clamp(18px, 3vw, 24px)' 
              }}
            >
              {logo.name}
            </span>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default LogoBar;
