import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SafeDeal — Trusted Escrow for Social Commerce",
  description:
    "The AI-protected escrow platform for WhatsApp, Instagram & Telegram sellers. Buyers pay safely, sellers ship confidently — backed by Stellar blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} font-sans`}>
      <body className={`${geistMono.variable} antialiased bg-slate-50`}>
        <ErrorBoundary>
          <WalletProvider>
            <Navbar />
            <main>{children}</main>
            <Toaster position="top-center" expand={true} richColors />
          </WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
