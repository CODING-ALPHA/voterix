"use client";

import React from "react";
import { Shield, Sparkles, Eye } from "lucide-react";

const About = () => {
  const pillars = [
    {
      icon: <Shield className="w-6 h-6 text-[#3457B4]" />,
      title: "Ironclad Security",
      description: "State-of-the-art encryption, secure one-time PINs, and hashed voter records protect the integrity of every single vote."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#3457B4]" />,
      title: "Frictionless Setup",
      description: "No complex voter registrations. Simply upload your voter list, define candidates, and launch your election within minutes."
    },
    {
      icon: <Eye className="w-6 h-6 text-[#3457B4]" />,
      title: "Absolute Transparency",
      description: "Real-time results monitoring and clear audit logs give organizers and voters full trust in the outcome."
    }
  ];

  return (
    <section id="about" className="w-full bg-[#F8F9FA] py-[clamp(60px,10vw,120px)] border-b border-black/5">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[80px] grid grid-cols-1 lg:grid-cols-12 gap-[clamp(40px,6vw,80px)] items-center">
        
        {/* Left: Mission & Stats */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-8">
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="flex gap-2.5 items-center justify-center lg:justify-start flex-wrap">
              <span className="text-[#3457B4] font-semibold tracking-wider uppercase text-xs md:text-sm font-[family-name:var(--font-manrope)]">
                Who We Are
              </span>
            </div>
            <h2 
              className="font-black tracking-tight"
              style={{
                color: '#484C74',
                fontFamily: 'var(--font-lato)',
                fontSize: 'clamp(32px, 5vw, 44px)',
                lineHeight: '1.2'
              }}
            >
              Modernizing the voting experience.
            </h2>
            <p 
              className="text-[#525252] font-normal leading-relaxed max-w-xl"
              style={{ 
                fontSize: 'clamp(14px, 1.8vw, 16px)', 
                fontFamily: 'var(--font-mulish)' 
              }}
            >
              Voterix was built from the ground up to replace outdated, manual, and paper-based voting with a secure, digital platform. We empower organizations, clubs, educational institutions, and communities of all sizes to conduct elections that are fully verifiable, highly accessible, and simple to run.
            </p>
          </div>

          {/* Highlights */}
          <div className="flex flex-col gap-3.5 w-full pt-6 border-t border-black/5">
            {[
              "Designed to power secure, reliable elections for any organization or scale",
              "Accessible on any smartphone, tablet, or desktop browser",
              "Zero tedious registrations or logins for voters"
            ].map((text, i) => (
              <div key={i} className="flex items-center justify-center lg:justify-start gap-3 text-left">
                <div className="w-5 h-5 rounded-full bg-[#E5F4F2] flex items-center justify-center shrink-0">
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4.5L4.5 8L11 1.5" stroke="#009379" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[#525252] font-semibold font-[family-name:var(--font-mulish)] text-[clamp(13px,1.5vw,15px)]">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Pillars / Cards */}
        <div className="lg:col-span-6 flex flex-col gap-6 w-full">
          {pillars.map((pillar, index) => (
            <div 
              key={index}
              className="bg-white rounded-[20px] border border-[#E5F4F2] p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 shadow-[0_15px_30px_rgba(51,102,255,0.02)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(51,102,255,0.06)]"
            >
              <div className="w-12 h-12 rounded-[12px] bg-[#E5F4F2] flex items-center justify-center shrink-0">
                {pillar.icon}
              </div>
              <div className="flex flex-col gap-1.5 items-center sm:items-start">
                <h3 className="text-[#2D2D2D] font-bold text-lg font-[family-name:var(--font-poppins)]">
                  {pillar.title}
                </h3>
                <p className="text-[#525252] text-sm leading-relaxed font-[family-name:var(--font-mulish)]">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;
