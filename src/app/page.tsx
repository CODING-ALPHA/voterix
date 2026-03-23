import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import LogoBar from "@/components/LogoBar";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import FinalCTA from "@/components/FinalCTA";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main Content */}
      <main className="mt-[70px]">
        <Hero />
        <LogoBar />
        <HowItWorks />
        <Features />
        <Pricing />
        <FinalCTA />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
