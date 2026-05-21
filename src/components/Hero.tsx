"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section 
      className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-[#F1F3F5] pt-[25px] pb-[50px] md:pt-[65px] md:pb-[100px]"
    >
      <div className="w-full max-w-[1440px] px-6 md:px-10 lg:px-[80px] flex flex-col md:flex-row items-center justify-between">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-blue-100/50 blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-indigo-100/50 blur-[120px] -z-10" />

      {/* Left Content */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-8 z-10 pt-4 md:pt-0 max-w-2xl">
        <h1 
          className="font-medium text-[#000840] tracking-tight md:tracking-[-2.249px]"
          style={{ 
            fontSize: 'clamp(36px, 10vw, 56.223px)', 
            lineHeight: '1.1',
          }}
        >
          Ditch the Papers. <br />
          Run elections like <br />
          it's <span className="text-[#405189]">2025.</span>
        </h1>
        
        <p 
          className="max-w-lg font-medium font-[family-name:var(--font-manrope)]"
          style={{ 
            color: '#000', 
            opacity: 0.6, 
            fontSize: 'clamp(13px, 1.2vw, 14.993px)',
            lineHeight: '1.6'
          }}
        >
          No more lines. No more stress. Just votes that count. Voterix turns slow, 
          manual voting into a sleek, digital experience your students will actually enjoy.
        </p>

        <div className="flex gap-4">
          <Link 
            href="/register"
            style={{
              display: 'inline-flex',
              padding: 'clamp(8px, 1vw, 10px) clamp(20px, 2.5vw, 28px)',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '10px',
              background: 'linear-gradient(180deg, #3457B4 0%, #4A496A 100%)',
              color: 'white',
              fontWeight: '600',
              fontSize: 'clamp(14px, 1.2vw, 15.5px)'
            }}
            className="hover:shadow-lg transition-shadow active:scale-[0.98]"
          >
            Create Election
          </Link>
        </div>
      </div>

      {/* Right Content - UI SVG */}
      <div className="w-full md:w-[45%] relative mt-12 md:mt-0 flex justify-center md:justify-end items-center">
        <div className="relative w-full max-w-[min(650px,82vw)] md:max-w-full">
          <Image 
            src="/hero-righthand.svg" 
            alt="Voterix Dashboard Illustration" 
            width={650} 
            height={500} 
            className="w-full h-auto drop-shadow-2xl scale-100 transform-gpu"
            priority
          />
        </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
