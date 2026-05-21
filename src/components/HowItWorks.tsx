"use client";

import React, { useState, useEffect, useRef } from "react";

const HowItWorks = () => {
  const [smoothProgress, setSmoothProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const requestRef = useRef<number | null>(null);

  const animate = () => {
    const diff = targetProgressRef.current - smoothProgressRef.current;
    
    // Continue loop if difference is noticeable
    if (Math.abs(diff) > 0.001) {
      smoothProgressRef.current += diff * 0.085; // 8.5% interpolation rate for ultra-fluid movement
      setSmoothProgress(smoothProgressRef.current);
      requestRef.current = requestAnimationFrame(animate);
    } else {
      smoothProgressRef.current = targetProgressRef.current;
      setSmoothProgress(smoothProgressRef.current);
      requestRef.current = null;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalScrollHeight = rect.height - windowHeight;
      const scrolled = -rect.top;
      
      let target = 0;
      if (scrolled >= 0) {
        target = Math.min(Math.max(scrolled / totalScrollHeight, 0), 1);
      }
      
      targetProgressRef.current = target;
      
      // Request animation frame to run the smooth lerp loop
      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleStepClick = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const totalScrollHeight = rect.height - window.innerHeight;
    
    let target = 0.27;
    if (index === 1) target = 0.57;
    if (index === 2) target = 0.86;
    
    const targetScrollY = containerTop + totalScrollHeight * target;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  const steps = [
    { 
      number: "1", 
      title: "Upload Voters",
      description: "Upload a spreadsheet with names and matric numbers. Only listed students can access the vote — no signups needed.",
      bgColor: "rgba(149, 242, 233, 0.10)", 
      activeBgColor: "rgba(149, 242, 233, 0.20)",
      textColor: "#638CF8", 
      width: "123.808px",
      expandedWidth: "550px",
      padding: "46.473px 18.356px 55.404px 17.438px",
      shadow: "0 1.419px 1.419px 0 rgba(0, 0, 0, 0.25)",
      justify: "center",
      letterSpacing: "-0.192px",
      opacity: 0.6
    },
    { 
      number: "2", 
      title: "Set Up the Election",
      description: "Add positions, candidates, and election dates in minutes. Manage everything from your admin dashboard.",
      bgColor: "rgba(52, 87, 180, 0.10)", 
      activeBgColor: "rgba(52, 87, 180, 0.20)",
      textColor: "#3457B4", 
      width: "124.726px", 
      expandedWidth: "550px",
      padding: "85.747px 0 54.678px 0", 
      shadow: "0 1.419px 1.419px 0 rgba(0, 0, 0, 0.25)",
      justify: "center",
      letterSpacing: "-0.172px",
      opacity: 0.6
    },
    { 
      number: "3", 
      title: "Share & Vote",
      description: "Send a secure link to students. They verify with their matric number, get a one-time code, and cast their vote.",
      bgColor: "rgba(20, 45, 112, 0.10)", 
      activeBgColor: "rgba(20, 45, 112, 0.20)",
      textColor: "#638CF8", 
      width: "123.808px", 
      expandedWidth: "550px",
      padding: "138.363px 0 54.377px 0", 
      shadow: "0 1.419px 1.419px 0 rgba(0, 0, 0, 0.25)", 
      justify: "center",
      letterSpacing: "-0.192px",
      opacity: 0.6
    },
  ];

  // Calculate discrete active step for layout styling
  const activeStep = 
    smoothProgress < 0.12 ? -1 :
    smoothProgress >= 0.12 && smoothProgress < 0.42 ? 0 :
    smoothProgress >= 0.42 && smoothProgress < 0.72 ? 1 : 2;

  // Compute dynamic continuous 2D transforms, shadows, and opacities per card
  const getStepStyles = (index: number) => {
    const stepCenters = [0.27, 0.57, 0.86];
    const center = stepCenters[index];
    const diff = smoothProgress - center;
    
    // Normalized position relative to active point (-1 = future, 0 = active, 1 = past)
    const t = Math.min(Math.max(diff / 0.22, -1), 1);
    
    let scale = 0.95;
    let opacity = 1.0;
    let shadowOpacity = 0.05;
    
    if (t < 0) {
      // Transitioning from Future to Active (t goes from -1 to 0)
      const p = t + 1; // 0 to 1
      scale = 0.95 + p * 0.05; // 0.95 to 1.00
      opacity = 1.0; // Keep fully visible for future/unvisited steps
      shadowOpacity = 0.05 + p * 0.15; // 0.05 to 0.20
    } else {
      // Transitioning from Active to Past (t goes from 0 to 1)
      scale = 1.00 - t * 0.05; // 1.00 to 0.95
      opacity = 1.0 - Math.pow(Math.max(t, 0), 4.0); // Keep card highly visible during its active scroll range
      shadowOpacity = 0.20 - t * 0.20; // 0.20 to 0.0
    }
    
    return {
      transform: `scale(${scale})`,
      opacity: opacity,
      boxShadow: `0px 15px 35px rgba(52, 87, 180, ${shadowOpacity})`,
    };
  };

  return (
    <div 
      id="how-it-works"
      ref={containerRef} 
      className="relative w-full h-[350vh]"
      style={{ 
        background: 'linear-gradient(355deg, #F1F3F5 3.69%, #DCE6FF 44.97%, #F0F2F4 86.25%)'
      }}
    >
      <section 
        className="sticky top-[70px] h-[calc(100vh-70px)] w-full overflow-hidden flex items-center justify-center"
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[80px] flex flex-col items-center gap-12 md:gap-16">
          <h2 
            className="text-center"
            style={{ 
              color: '#484C74',
              fontFamily: 'var(--font-lato)',
              fontSize: 'clamp(28px, 6vw, 36px)',
              fontWeight: 900,
              fontStyle: 'normal',
              lineHeight: 'normal',
              letterSpacing: '-0.196px',
            }}
          >
            Run Elections in 3 Simple Steps
          </h2>

          <div className="flex flex-col md:flex-row items-center md:items-end justify-center mt-4 md:mt-8 w-full max-w-[1280px] gap-8 md:gap-20 relative">
            {/* "STEP" Text */}
            <div 
              style={{ 
                display: 'flex',
                width: '100%',
                maxWidth: '553.438px',
                flexDirection: 'column',
                justifyContent: 'center',
                color: '#2B2F3E',
                fontFamily: 'var(--font-lato)',
                fontSize: 'clamp(80px, 20vw, 229.452px)', 
                fontWeight: 600,
                lineHeight: 'normal',
                letterSpacing: 'clamp(-4px, -1vw, -10.096px)',
              }}
              className={`select-none text-center md:text-left transition-all duration-700 ${activeStep === -1 ? 'relative' : 'md:absolute md:left-0'} z-0 md:translate-y-[-35px]`}
            >
              STEP
            </div>

            {/* Vertical Bars container - Interactive */}
            <div 
              className={`flex flex-row items-end justify-center gap-2 md:gap-10 z-10 w-full max-w-[1280px] transition-all duration-700 ${activeStep === -1 ? '' : 'md:ml-40'}`}
            >
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                const isHidden = activeStep !== -1 && activeStep > index;
                const card2D = getStepStyles(index);
                
                return (
                  <div 
                    key={index}
                    onClick={() => handleStepClick(index)}
                    className="rounded-sm flex flex-col transition-all duration-700 ease-in-out cursor-pointer overflow-hidden shrink group"
                    style={{ 
                      backgroundColor: isActive ? step.activeBgColor : step.bgColor,
                      flex: isHidden ? '0 0 0px' : (isActive ? '1 1 300px' : `0 1 clamp(60px, 25vw, ${step.width})`),
                      width: isHidden ? '0' : (isActive ? '100%' : `clamp(60px, 25vw, ${step.width})`),
                      maxWidth: isActive ? '550px' : step.width,
                      opacity: card2D.opacity,
                      visibility: isHidden ? 'hidden' : 'visible',
                      marginRight: isHidden ? '-8px' : '0', 
                      padding: isActive ? 'clamp(20px, 6vw, 60px) clamp(16px, 3vw, 40px)' : (typeof step.padding === 'string' ? step.padding.replace(/([0-9.]+)px/g, (m, px) => `clamp(${parseFloat(px)/2}px, 3vw, ${px}px)`) : step.padding),
                      boxShadow: card2D.boxShadow,
                      display: 'flex',
                      justifyContent: isActive ? 'center' : (step.justify || 'center'),
                      alignItems: isActive ? 'flex-start' : 'center',
                      backdropFilter: isActive ? 'blur(8px)' : 'none',
                      WebkitBackdropFilter: isActive ? 'blur(8px)' : 'none',
                      transform: card2D.transform,
                    }}
                  >
                    <div 
                      className={`flex flex-row items-center w-full h-full relative ${isActive ? 'justify-start' : 'justify-center'}`}
                    >
                      {/* Number */}
                      <span 
                        className="select-none flex items-center justify-center transition-all duration-700 ease-in-out shrink-0"
                        style={{ 
                          display: 'flex',
                          width: isActive ? 'clamp(35px, 10vw, 78.014px)' : 'clamp(50px, 15vw, 78.014px)',
                          color: step.textColor,
                          fontFamily: 'var(--font-bebas-neue)',
                          fontSize: isActive ? 'clamp(70px, 16vw, 240.233px)' : 'clamp(100px, 25vw, 321.233px)',
                          fontWeight: 400,
                          lineHeight: '0.8',
                          letterSpacing: step.letterSpacing,
                          opacity: isActive ? 0.95 : 0.8,
                          transform: isActive ? 'translateY(0)' : 'none',
                          WebkitFontSmoothing: "antialiased",
                          MozOsxFontSmoothing: "grayscale",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        {step.number}
                      </span>

                      {/* Expanded Content */}
                      {isActive && (
                        <div 
                          className="ml-3 sm:ml-6 md:ml-12 flex flex-col gap-1 md:gap-4 shrink pr-2"
                          style={{
                            WebkitFontSmoothing: "antialiased",
                            MozOsxFontSmoothing: "grayscale",
                            transform: "translate3d(0, 0, 0)",
                            backfaceVisibility: "hidden",
                          }}
                        >
                          <h4 
                            className="font-black text-[#0F172A] animate-slideUpFade-1 leading-tight"
                            style={{ fontSize: 'clamp(16px, 4.5vw, 32px)', fontFamily: 'var(--font-poppins)' }}
                          >
                            {step.title}
                          </h4>
                          <p 
                            className="text-[#1E293B] max-w-full md:max-w-[320px] font-semibold leading-relaxed animate-slideUpFade-2"
                            style={{ fontSize: 'clamp(11px, 3.2vw, 18px)', fontFamily: 'var(--font-manrope)' }}
                          >
                            {step.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <style jsx>{`
            @keyframes slideUpFade {
              from { opacity: 0; transform: translateY(15px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-slideUpFade-1 {
              animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              animation-delay: 0.05s;
              opacity: 0;
            }
            .animate-slideUpFade-2 {
              animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              animation-delay: 0.12s;
              opacity: 0;
            }
          `}</style>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
