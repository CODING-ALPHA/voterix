"use client";

import React from "react";

const Contact = () => {
  return (
    <section className="w-full bg-[#EFF2F4] py-[clamp(60px,10vw,120px)]">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[80px]">
        
        <div className="bg-white rounded-[20px] border border-[#E5F4F2] p-[clamp(32px,5vw,60px)] shadow-[0_34.85px_48.34px_rgba(51,102,255,0.05)] w-full flex flex-col gap-[clamp(40px,5vw,60px)]">
          
          {/* Header */}
          <div className="flex flex-col gap-2.5 w-full">
            <h2 
              className="text-[#2D2D2D] font-black"
              style={{
                fontFamily: 'var(--font-lato)',
                fontSize: 'clamp(28px, 4vw, 38px)',
                lineHeight: '1.3'
              }}
            >
              Still Have Questions?
            </h2>
            <p 
              className="text-[#2D2D2D] font-normal"
              style={{
                fontFamily: 'var(--font-mulish)',
                fontSize: 'clamp(15px, 1.5vw, 16px)',
                lineHeight: '1.5'
              }}
            >
              Got questions about the Landing Page UI Kit? Our team is here to help. Contact us for quick and friendly support.
            </p>
          </div>

          {/* Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(40px,5vw,80px)]">
            
            {/* Left Column: Contact Info */}
            <div className="flex flex-col justify-between items-start gap-10">
              
              <div className="flex flex-col gap-5">
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center text-[#3056D3]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3.75" y="3.03" width="16.5" height="16.5" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="text-[#2D2D2D] text-[16px] font-[family-name:var(--font-mulish)]">+234 8089039098</span>
                </div>
                
                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center text-[#3056D3]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="5.25" width="18" height="13.5" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3 8L12 13L21 8" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <span className="text-[#2D2D2D] text-[16px] font-[family-name:var(--font-mulish)]">Electpoll@gmail.com</span>
                </div>
              </div>

              {/* Socials */}
              <div className="flex flex-col gap-5">
                <h4 className="text-[#2D2D2D] text-[21px] font-[family-name:var(--font-poppins)] font-semibold">
                  Connect with us
                </h4>
                <div className="flex items-center gap-4">
                  {/* Social Circles */}
                  <div className="w-8 h-8 rounded-full bg-[#E5F4F2] flex items-center justify-center text-[#2D2D2D] hover:bg-[#3457B4] hover:text-white transition-colors cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                       {/* Instagram icon */}
                       <path d="M7 2C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2H7ZM7 4H17C18.6569 4 20 5.34315 20 7V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4ZM17 5.5C16.1716 5.5 15.5 6.17157 15.5 7C15.5 7.82843 16.1716 8.5 17 8.5C17.8284 8.5 18.5 7.82843 18.5 7C18.5 6.17157 17.8284 5.5 17 5.5ZM12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7ZM12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9Z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#E5F4F2] flex items-center justify-center text-[#2D2D2D] hover:bg-[#3457B4] hover:text-white transition-colors cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      {/* Dribbble icon */}
                      <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C14.1534 4 16.148 4.8517 17.625 6.2234L15.391 8.7056C14.4373 8.01639 13.2559 7.6 12 7.6C10.6384 7.6 9.36647 8.0833 8.3562 8.86872L5.43788 6.47648C7.15286 4.90947 9.47167 4 12 4ZM4.11677 8.0102L7.33081 10.6433C6.41724 11.8315 5.8 13.3101 5.8 14.9C5.8 15.6985 5.9254 16.4674 6.15174 17.1856C4.8385 15.8208 4 14 4 12C4 10.5369 4.43169 9.17647 5.16677 8.0102H4.11677ZM17.2023 18.2394C15.8225 19.336 14.0041 20 12 20C10.0886 20 8.34969 19.418 7.02534 18.4116C7.26257 17.95 7.63666 17.5197 8.16912 17.1147C9.37561 16.1969 10.9575 15.6 12 15.6C14.3312 15.6 15.757 16.7115 17.2023 18.2394ZM19.2977 16.2758C18.1763 15.0006 16.5332 14.2 14.5 14.2C13.2359 14.2 12.06 14.6138 11.085 15.3093C11.3789 15.8 11.6661 16.3268 11.9366 16.8858C13.2926 16.637 14.7818 16.7909 16.0967 17.3698C17.4116 17.9487 18.4552 18.9174 19.0067 20.1557C19.6457 18.9553 20 17.5165 20 16C20 15.1118 19.855 14.2575 19.5878 13.4552L17.2217 15.0232C17.8437 16.2559 18.3243 17.5898 19.2977 16.2758ZM19.96 11.5582C19.9866 11.7047 20 11.8521 20 12C20 12.4357 19.9652 12.8633 19.8988 13.2808L16.5028 11.0298C17.0601 10.1506 17.4363 9.17639 17.5947 8.14072L20.0805 10.0573C20.0279 10.5516 19.96 11.0535 19.96 11.5582ZM9.0834 11.9865L6.34586 9.73909C7.4571 8.86879 8.86227 8.35 10.375 8.35C11.5036 8.35 12.5539 8.65171 13.4358 9.17281L11.5284 10.6308C11.6128 10.7495 11.7001 10.8659 11.7903 10.9798C10.7937 11.6961 9.94436 12.5937 9.27961 13.6393C9.07921 14.129 8.88998 14.6288 8.71262 15.1384C8.44146 14.0722 8.52839 12.9834 9.0834 11.9865ZM14.4922 10.0815C13.7915 9.57682 12.9555 9.25418 12.0526 9.25418C10.8354 9.25418 9.71536 9.68266 8.83177 10.3957L11.4116 12.5134C12.4862 11.8596 13.6806 11.3701 14.9392 11.0538L17.228 12.91C16.9427 13.6881 16.4851 14.4042 15.8753 15.0118L14.4922 10.0815Z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#E5F4F2] flex items-center justify-center text-[#2D2D2D] hover:bg-[#3457B4] hover:text-white transition-colors cursor-pointer">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 7.00004C22 5.34319 20.6568 4.00004 19 4.00004H5C3.34315 4.00004 2 5.34319 2 7.00004V17C2 18.6569 3.34315 20 5 20H19C20.6568 20 22 18.6569 22 17V7.00004ZM18 12.5C18 14.433 16.433 16 14.5 16C12.567 16 11 14.433 11 12.5C11 10.567 12.567 9.00004 14.5 9.00004C16.433 9.00004 18 10.567 18 12.5ZM14.5 10.5C13.3954 10.5 12.5 11.3955 12.5 12.5C12.5 13.6046 13.3954 14.5 14.5 14.5C15.6046 14.5 16.5 13.6046 16.5 12.5C16.5 11.3955 15.6046 10.5 14.5 10.5ZM5 8.00004H9.5V9.50004H5V8.00004ZM5 11H9.5V12.5H5V11ZM5 14H9.5V15.5H5V14Z"/>
                     </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="flex flex-col gap-5 w-full lg:max-w-[465px] lg:ml-auto">
              
              <div className="flex flex-col gap-[10px]">
                {/* Full Name Input */}
                <div className="flex items-center gap-3 w-full h-[60px] px-5 bg-white rounded-[20px] outline outline-1 outline-[#D8D8D8] focus-within:outline-[#3457B4] transition-all group">
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-5 h-5 flex items-center justify-center text-[#3056D3]">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2C6.691 2 4 4.691 4 8C4 11.309 6.691 14 10 14C13.309 14 16 11.309 16 8C16 4.691 13.309 2 10 2ZM10 12C7.794 12 6 10.206 6 8C6 5.794 7.794 4 10 4C12.206 4 14 5.794 14 8C14 10.206 12.206 12 10 12Z" fill="currentColor" fillOpacity="0.2"/>
                        <circle cx="10" cy="8" r="5" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M4.16669 17.5C4.16669 15.1988 6.03217 13.3333 8.33335 13.3333H11.6667C13.9679 13.3333 15.8334 15.1988 15.8334 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="w-[1px] h-5 bg-[#DBE3FF]" />
                  </div>
                  <label htmlFor="fullName" className="sr-only">Full Name</label>
                  <input 
                    id="fullName"
                    type="text" 
                    placeholder="Full Name"
                    className="w-full h-full bg-transparent text-[#2D2D2D] font-[family-name:var(--font-mulish)] text-[16px] placeholder:text-[#A0A0A0] focus:outline-none"
                  />
                </div>

                {/* Email Input */}
                <div className="flex items-center gap-3 w-full h-[60px] px-5 bg-white rounded-[20px] outline outline-1 outline-[#D8D8D8] focus-within:outline-[#3457B4] transition-all group">
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-5 h-5 flex items-center justify-center text-[#3056D3]">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2.5" y="4.38" width="15" height="11.25" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M2.5 6L10 10L17.5 6" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <div className="w-[1px] h-5 bg-[#DBE3FF]" />
                  </div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input 
                    id="email"
                    type="email" 
                    placeholder="Email"
                    className="w-full h-full bg-transparent text-[#2D2D2D] font-[family-name:var(--font-mulish)] text-[16px] placeholder:text-[#A0A0A0] focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                className="w-full h-[60px] rounded-[20px] bg-gradient-to-b from-[#3457B4] to-[#4A496A] text-white font-[family-name:var(--font-poppins)] font-semibold text-[16px] flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-[1.02] mt-2"
              >
                Submit
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
