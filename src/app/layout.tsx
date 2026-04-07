import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VitaminC India — India's Most Trusted Vitamin C Serum Platform",
    template: "%s | VitaminC India",
  },
  description:
    "Science-backed, dermatologist-reviewed Vitamin C serum rankings, comparisons, and ingredient guides for Indian skin. Find your perfect serum.",
  keywords: [
    "vitamin c serum india",
    "best vitamin c serum",
    "vitamin c serum for indian skin",
    "l-ascorbic acid serum",
    "brightening serum india",
    "serum comparison",
  ],
  openGraph: {
    title: "VitaminC India — India's Most Trusted Vitamin C Serum Platform",
    description:
      "Science-backed Vitamin C serum rankings and comparisons for Indian skin.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <body className="min-h-full flex flex-col antialiased bg-[#F7F9FC] text-[#0C1E30]">
        <Navbar />
        <main className="flex-1 bg-[#F7F9FC]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
