"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/office.png",
  "/auth2.png",
  "/auth3.png",
  "/auth4.png",
];

export default function AuthImageSlider({
  title = "Log back in",
  subtitle = "Pick up where you left off. Fast, reliable and secure voting for any scale."
}: {
  title?: string;
  subtitle?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-xl">
      <div className="relative mb-8 h-72 md:h-80 w-full overflow-hidden rounded-2xl bg-[#000129] border border-white/5 shadow-lg">
        {images.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`Student collaboration ${index + 1}`}
            fill
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            priority={index === 0}
          />
        ))}
      </div>
      
      <h2 className="mb-2 text-2xl md:text-3xl font-bold text-white">{title}</h2>
      <p className="mb-8 text-zinc-300 text-base md:text-lg leading-relaxed max-w-lg">
        {subtitle}
      </p>
      
      {/* Pagination Indicators */}
      <div className="flex gap-2">
        {images.map((_, index) => (
          <div 
            key={index}
            className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
              index === currentIndex ? "w-6 bg-white" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

