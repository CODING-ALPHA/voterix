"use client";

import React from "react";

const PriceCard = ({ 
  title, 
  price, 
  unit,
  description, 
  features, 
  isPremium = false 
}: { 
  title: string, 
  price: string, 
  unit?: string,
  description: string, 
  features: string[], 
  isPremium?: boolean 
}) => (
  <div 
    className={`w-full max-w-[380px] flex flex-col gap-[clamp(24px,4vw,32px)] rounded-[24px] py-[clamp(40px,5vw,70px)] px-[clamp(24px,3vw,36px)] shadow-[34px_29px_48px_rgba(51,102,255,0.05)] border border-[#F8F9FF] transition-all duration-300 hover:translate-y-[-8px] ${
      isPremium 
        ? 'bg-gradient-to-b from-[#3457B4] to-[#4A496A] text-white' 
        : 'bg-white text-[#2D2D2D]'
    }`}
  >
    <div className="flex flex-col gap-2">
      <h3 className="text-[clamp(17px,1.8vw,19px)] font-[family-name:var(--font-mulish)] font-normal opacity-90">
        {title}
      </h3>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-[clamp(26px,4.5vw,42px)] font-black font-[family-name:var(--font-lato)] leading-tight whitespace-nowrap">{price}</span>
        {unit && <span className="text-[clamp(13px,1.5vw,18px)] font-semibold font-[family-name:var(--font-lato)] opacity-80 whitespace-nowrap">{unit}</span>}
      </div>
      <p className="text-[clamp(13px,1.5vw,15px)] font-[family-name:var(--font-mulish)] font-normal leading-relaxed opacity-80">
        {description}
      </p>
    </div>

    <div className="flex flex-col gap-[clamp(10px,1.2vw,14px)]">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="w-5 h-5 mt-1 flex items-center justify-center shrink-0">
            <svg 
              width="14" 
              height="10" 
              viewBox="0 0 14 10" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M1 5L5 9L13 1" 
                stroke={isPremium ? "white" : "#009379"} 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[clamp(13px,1.5vw,15px)] font-bold font-[family-name:var(--font-mulish)] leading-snug">
            {feature}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const Pricing = () => {
  return (
    <section id="pricing" className="w-full bg-[#EFF2F4] py-16 md:py-24">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[80px] flex flex-col items-center gap-[clamp(40px,6vw,80px)]">
        {/* Header content */}
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <h2 
            className="font-black text-[clamp(32px,5vw,48px)] leading-[1.1] tracking-tight"
            style={{ 
              color: '#484C74',
              fontFamily: 'var(--font-lato)',
            }}
          >
            Flexible Plans for Every Election.
          </h2>
          <p 
            className="max-w-2xl text-[clamp(15px,1.8vw,17px)] opacity-80"
            style={{ 
              color: '#2D2D2D', 
              fontFamily: 'var(--font-mulish)', 
              lineHeight: '1.6'
            }}
          >
            Find the perfect plan for your Election with our flexible pricing options.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,2vw,32px)] items-start justify-items-center">
          <PriceCard 
            title="Basic"
            price="₦20,000"
            unit="/ Election"
            description="Up to 100 Voters included."
            features={[
              "100 Verified Voters",
              "Email & PIN notifications",
              "Live results monitoring",
              "Basic admin dashboard",
              "Standard support"
            ]}
          />
          <PriceCard 
            title="Standard"
            price="₦40,000"
            unit="/ Election"
            description="Up to 200 Voters included."
            features={[
              "200 Verified Voters",
              "All features in Basic",
              "Multiple admin members",
              "Branded election links",
              "PDF & CSV results export"
            ]}
          />
          <PriceCard 
            title="Premium"
            price="₦150"
            unit="/ Voter"
            isPremium={true}
            description="₦10,000 Base Setup Fee applies."
            features={[
              "Custom Voting Volume",
              "Priority setup & support",
              "Advanced analytics",
              "Dedicated account manager",
              "Customizable ballot themes",
              "White-label options"
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
