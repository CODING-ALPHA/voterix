import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
// import LogoBar from "@/components/LogoBar";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import FinalCTA from "@/components/FinalCTA";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Voterix",
    "url": "https://voterix.com",
    "description": "Fast, secure, and reliable online voting platform for student associations, corporate elections, and board votes of any scale.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "NGN",
      "lowPrice": "20000",
      "highPrice": "40000",
      "offerCount": "3",
      "offers": [
        {
          "@type": "Offer",
          "name": "Basic Plan",
          "price": "20000",
          "priceCurrency": "NGN",
          "eligibleQuantity": "100 Voters"
        },
        {
          "@type": "Offer",
          "name": "Standard Plan",
          "price": "40000",
          "priceCurrency": "NGN",
          "eligibleQuantity": "200 Voters"
        },
        {
          "@type": "Offer",
          "name": "Custom Plan",
          "price": "250",
          "priceCurrency": "NGN",
          "eligibleQuantity": "Per Vote"
        }
      ]
    },
    "author": {
      "@type": "Organization",
      "name": "4orge Tech",
      "url": "https://x.com/4orge_"
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Main Content */}
      <main className="mt-[70px]">
        <Hero />
        {/* <LogoBar /> */}
        <About />
        <HowItWorks />
        <Features />
        <Pricing />
        <FinalCTA />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}

