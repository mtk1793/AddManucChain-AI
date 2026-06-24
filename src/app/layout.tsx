import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/Providers";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { LinkedInConnectionPopup } from "@/components/LinkedInConnectionPopup";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AddManuChain — On-Demand Certified Parts for Remote Operations",
  description: "When a part fails at sea, every hour costs $50,000–$100,000. AddManuChain connects OEM blueprint owners, certified 3D-printing centers, and offshore operators — delivering LR/DNV-certified parts in days, not weeks.",
  keywords: ["AddManuChain", "additive manufacturing", "3D printing", "offshore", "naval", "certified parts", "supply chain", "maritime", "remote operations", "DNV", "Lloyd's Register"],
  authors: [{ name: "AddManuChain Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AddManuChain",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "AddManuChain — On-Demand Certified Parts",
    description: "Delivering LR/DNV-certified parts in days, not weeks for offshore and remote operations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AddManuChain",
    description: "On-demand certified parts for remote operations",
  },
};

export const viewport: Viewport = {
  themeColor: "#0EA5E9",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Providers>
          <ServiceWorkerRegistration />
          <LinkedInConnectionPopup />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
