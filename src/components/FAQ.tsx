"use client";

import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Do I need technical expertise to set up an election?",
    answer:
      "No. Voterix is designed to be intuitive and self-service, allowing you to create elections, define positions, and upload voter records via CSV without writing any code."
  },
  {
    question: "How are voters verified?",
    answer:
      "Voter verification is handled through our automated PIN system. Administrators upload the voter registry, and the platform generates and sends each voter a unique 6-digit secure PIN via email, ensuring that only authorized participants can access the ballot."
  },
  {
    question: "Can I monitor results in real time?",
    answer:
      "Yes. The platform provides a dedicated monitoring dashboard that allows administrators to track voter turnout, check-in status, and live result tallies in real time throughout the election."
  },
  {
    question: "How secure is the platform?",
    answer:
      "Voterix is built on a secure Django backend with hashed voter PINs, JWT-based authentication, and concurrency controls designed to prevent double voting and maintain data integrity throughout the voting process."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#ECEFF3] py-[clamp(60px,10vw,120px)] overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[80px] flex flex-col items-center gap-[clamp(40px,8vw,60px)]">

        {/* Header */}
        <div className="text-center">
          <h2
            className="font-black"
            style={{
              color: '#484C74',
              fontFamily: 'var(--font-lato)',
              fontSize: 'clamp(28px, 5vw, 36px)',
              lineHeight: '1.2'
            }}
          >
            You Asked. We Answered.
          </h2>
        </div>

        {/* FAQ List */}
        <div className="w-full max-w-[1152px] flex flex-col gap-5 md:gap-[22px]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`w-full transition-all duration-300 rounded-[22px] border ${isOpen
                    ? 'bg-white shadow-[0px_7px_21px_rgba(25,33,61,0.06)] border-[#D9DBE9]'
                    : 'bg-white shadow-[0px_1.4px_5.5px_rgba(25,33,61,0.06)] border-[#F1F2F9]'
                  }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-[clamp(20px,4vw,32px)] py-[clamp(20px,3vw,28px)] flex items-center justify-between gap-6 md:gap-[200px] text-left group"
                >
                  <span
                    className="text-[#170F49] font-semibold flex-1"
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 'clamp(16px, 1.8vw, 20px)',
                      lineHeight: '1.4'
                    }}
                  >
                    {faq.question}
                  </span>

                  {/* Toggle Button */}
                  <div
                    className={`shrink-0 w-[clamp(28px,3vw,36px)] h-[clamp(28px,3vw,36px)] rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isOpen
                        ? 'bg-gradient-to-b from-[#3457B4] to-[#4A496A] rotate-180'
                        : 'bg-gradient-to-b from-[#3457B4] to-[#4A496A] opacity-80 group-hover:opacity-100'
                      }`}
                  >
                    <svg
                      width="12"
                      height="7"
                      viewBox="0 0 16 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform duration-300 ${isOpen ? '' : 'rotate-[-90deg]'}`}
                    >
                      <path
                        d="M14.5 1.5L8 7.5L1.5 1.5"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={isOpen ? 'opacity-100' : 'opacity-60'}
                      />
                    </svg>
                  </div>
                </button>

                {/* Answer Area */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="px-[clamp(20px,4vw,32px)] pb-[clamp(24px,3vw,36px)] pt-0">
                    <p
                      className="text-[#170F49] max-w-[995px] opacity-80"
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'clamp(14px, 1.5vw, 16px)',
                        lineHeight: '1.6'
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
