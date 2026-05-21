import type { Metadata } from "next";
import { Poppins, Manrope, Lato, Bebas_Neue, Mulish } from "next/font/google";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://voterix.com"),
  title: {
    default: "Voterix | Fast, Secure & Reliable Online Voting Platform",
    template: "%s | Voterix"
  },
  description: "Voterix is a state-of-the-art secure online voting platform for elections of any scale. Easy setup, verified voter authentication, real-time live results, and audit-ready security.",
  keywords: [
    "online voting",
    "secure election",
    "electronic voting system",
    "student government election",
    "association voting",
    "board elections",
    "digital polling",
    "voter verification",
    "live election results",
    "e-voting platform",
    "Voterix"
  ],
  authors: [{ name: "4orge Tech", url: "https://x.com/4orge_" }],
  creator: "4orge Tech",
  publisher: "Voterix",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://voterix.com",
    title: "Voterix | Secure Online Voting Platform",
    description: "Run secure, fast, and transparent elections with Voterix. Designed for student government, associations, board votes, and large-scale polls.",
    siteName: "Voterix",
    images: [
      {
        url: "/cover.svg",
        width: 1150,
        height: 269,
        alt: "Voterix Online Voting Platform Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voterix | Secure Online Voting Platform",
    description: "Run secure, fast, and transparent elections with Voterix.",
    creator: "@4orge_",
    images: ["/cover.svg"],
  },
  alternates: {
    canonical: "/",
  },
};


import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${manrope.variable} ${lato.variable} ${bebasNeue.variable} ${mulish.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
