"use client";

import React from "react";
import Image from "next/image";

const FeatureCard = ({ icon, title, className = "" }: { icon: string | React.ReactNode, title: string, className?: string }) => (
  <div 
    className={`bg-white rounded-[16px] p-[clamp(10px,1.5vw,14px)] flex items-center gap-[clamp(10px,1.5vw,16px)] border border-[#E5F4F2] shadow-[34px_29px_48px_rgba(51,102,255,0.05)] transition-all duration-300 hover:scale-[1.02] ${className}`}
  >
    <div className="w-[clamp(32px,4vw,38px)] h-[clamp(32px,4vw,38px)] rounded-[8px] bg-[#E5F4F2] flex items-center justify-center shrink-0">
      <span className="text-[clamp(12px,1.8vw,16px)]">{icon}</span>
    </div>
    <div className="flex flex-col min-w-0">
      <h4 className="text-[#2D2D2D] text-[clamp(13px,1.4vw,15px)] font-[family-name:var(--font-mulish)] font-normal leading-tight whitespace-nowrap">
        {title}
      </h4>
    </div>
  </div>
);

const Features = () => {
  return (
    <section id="services" className="w-full bg-[#F1F3F5] py-16 md:py-24 flex flex-col items-center gap-[60px] overflow-hidden">
      {/* Top Headline - Contained to the grid width */}
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[80px]">
        <h2 
          className="text-center font-black w-full"
          style={{ 
            color: '#484C74',
            fontFamily: 'var(--font-lato)',
            fontSize: 'clamp(28px, 5vw, 36px)',
            fontWeight: 900,
            lineHeight: 'normal',
            letterSpacing: '-0.196px',
          }}
        >
          Vote Faster. Count Smarter. Sleep Better.
        </h2>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-4 items-center">
        {/* Left: Dashboard Mockup Rendering - Comes FIRST on mobile, FIRST on desktop */}
        <div className="w-full relative -ml-4 lg:-ml-12 pointer-events-none overflow-hidden">
          <div className="relative bg-transparent">
             <Image 
               src="/features2.svg" 
               alt="Voterix Admin Dashboard" 
               width={1200} 
               height={900} 
               className="w-full h-auto scale-95 transform-gpu origin-left"
             />
          </div>
        </div>

        {/* Right: Features Content - Comes SECOND on mobile, SECOND on desktop */}
        <div className="flex flex-col gap-[clamp(30px,4vw,48px)] w-full px-6 md:px-10 lg:pl-0 lg:pr-[80px] lg:max-w-[700px] lg:mx-auto">
           <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-5 w-full">
              <h3 className="text-[#525252] font-bold leading-tight" style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: 'var(--font-poppins)' }}>
                Our features
              </h3>
              <p className="text-[#2D2D2D] font-normal leading-relaxed max-w-lg opacity-80 lg:mx-0 mx-auto" style={{ fontSize: 'clamp(14px, 2vw, 18px)', fontFamily: 'var(--font-mulish)' }}>
                Few good reasons why you should use voterix for your elections.
              </p>
           </div>

           <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <FeatureCard icon="⚡" title="Quick Setup" />
                 <FeatureCard icon="🪪" title="Voter Validation" />
                 <FeatureCard icon="🖥️" title="Real-Time Results" />
                 <FeatureCard icon="🧾" title="Audit Ready" />
              </div>
              <FeatureCard 
                icon={
                  <div className="w-6 h-6 border-2 border-[#009379] rounded-sm relative overflow-hidden">
                    <div className="absolute inset-x-0 top-[30%] h-[1.5px] bg-[#009379]" />
                    <div className="absolute left-[50%] inset-y-0 w-[1.5px] bg-[#009379]" />
                  </div>
                } 
                title="Simple access" 
                className="w-full" 
              />
           </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
