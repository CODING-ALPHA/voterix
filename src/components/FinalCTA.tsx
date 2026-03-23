"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const FinalCTA = () => {
  return (
    <section className="w-full bg-[#EFF2F4] py-[clamp(60px,10vw,120px)]">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[80px]">
        <div 
          className="relative w-full overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-[clamp(40px,8vw,60px)] h-auto lg:h-[475px] py-[clamp(40px,6vw,60px)] px-[clamp(24px,5vw,56px)] shadow-2xl"
          style={{ 
            borderRadius: '19.671px',
            background: 'linear-gradient(180deg, #3457B4 0%, #4A496A 100%)'
          }}
        >
          
          {/* Subtle circle patterns in the background */}
          <div className="absolute top-[-10%] right-[-5%] w-[clamp(200px,30vw,400px)] h-[clamp(200px,30vw,400px)] rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[10%] w-[clamp(150px,20vw,300px)] h-[clamp(150px,20vw,300px)] rounded-full bg-black/5 pointer-events-none" />

          {/* Text Content */}
          <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left gap-[clamp(32px,4vw,48px)] lg:max-w-[42%]">
            <div className="flex flex-col gap-6">
              <h2 
                className="font-bold font-[family-name:var(--font-poppins)]"
                style={{ 
                  color: '#EFEFEF',
                  fontSize: 'clamp(28px, 5vw, 42px)',
                  fontWeight: 700,
                  fontStyle: 'normal',
                  lineHeight: '1.2',
                  letterSpacing: '-0.984px'
                }}
              >
                Ready to ditch the chaos and vote smart?
              </h2>
              <p className="text-white text-[clamp(16px,2vw,19px)] font-[family-name:var(--font-mulish)] font-normal leading-relaxed opacity-90 max-w-lg mx-auto lg:mx-0">
                Set up your election in minutes : no tech skills, no stress.
              </p>
            </div>
            
            <Link 
              href="/dashboard"
              className="group flex items-center justify-center transition-all duration-300 hover:scale-[1.02] hover:opacity-90 w-fit"
              style={{ 
                borderRadius: '19.671px',
                background: 'linear-gradient(180deg, rgba(52, 87, 180, 0.72) 0%, rgba(74, 73, 106, 0.72) 100%)',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                height: 'clamp(52px, 6vw, 60px)',
                padding: '0 clamp(32px, 5vw, 50px)',
                gap: '8px'
              }}
            >
              <span className="text-white font-semibold text-[clamp(15px,1.8vw,17px)] font-[family-name:var(--font-poppins)]">
                Create Election
              </span>
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path 
                  d="M5 12H19M19 12L12 5M19 12L12 19" 
                  stroke="white" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          {/* Mockup Preview Area */}
          <div className="relative z-10 w-full lg:w-[62%] flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[950px] aspect-[1.3/1] md:aspect-[1.5/1] lg:aspect-[1.3/1]">
              {/* Pattern behind the image - Mockup.svg */}
              <div className="absolute top-1/2 left-[58%] -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] z-0 select-none pointer-events-none">
                <Image 
                  src="/Mockup.svg" 
                  alt="Background Pattern" 
                  fill
                  className="object-contain"
                />
              </div>

              {/* Main Dashboard Mockup Image - Voter.svg */}
              <div className="relative z-10 w-full h-full">
                <Image 
                  src="/Voter.svg" 
                  alt="Voterix Dashboard Preview" 
                  fill
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] pb-4 lg:pb-0"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
