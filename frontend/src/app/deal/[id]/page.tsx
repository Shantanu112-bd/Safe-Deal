"use client";

import { useState, useEffect } from "react";
import { 
  Lock, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Timer,
  ArrowLeft,
  Shield,
  Smartphone,
  Info,
  ExternalLink,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/lib/utils";
import { useWallet } from "@/context/WalletContext";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Types
type PageStep = "pay" | "locking" | "success" | "confirm_delivery" | "released" | "dispute_opened";

// Mock Data (In production, this would be fetched from contract/backend)
const SELLER_DATA = {
  name: "Priya S. (Maanas Jewelry)",
  badge: "Verified Merchant",
  rating: 4.9,
  deals: 247,
  joined: "Jan 2023",
  location: "Nashik, India"
};

const DEAL_DATA = {
  id: "4822",
  title: "Handmade Silver Earrings",
  description: "925 Grade silver handcrafted earrings. Ships within 24 hours via BlueDart.",
  amountUSDC: 24.00,
  amountINR: 1997,
  category: "Jewelry",
  imageUrl: "https://images.unsplash.com/photo-1635767794421-4d5671c69991?q=80&w=2000&auto=format&fit=crop"
};

export default function BuyerPaymentPage({ params }: { params: { id: string } }) {
  const { connected, balance, isBlocked, riskScore, hasUsdcTrustline } = useWallet();
  const [step, setStep] = useState<PageStep>("pay");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(172800); // 48 hours

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handlePay = () => {
    setStep("locking");
    setTimeout(() => {
      setStep("success");
      toast.success("Payment locked in escrow!");
    }, 2000);
  };

  const handleConfirmDelivery = () => {
    setStep("released");
    toast.success("Funds released to seller. Thank you!");
  };

  const handleDispute = () => {
    setStep("dispute_opened");
    toast.error("Dispute raised. Funds are frozen.");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-6 pt-12 space-y-8">
        <Skeleton className="h-10 w-48 rounded-full" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans italic-none pb-20">
      
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-2">
           <Shield className="size-6 text-slate-900 fill-current" />
           <span className="text-lg font-black tracking-tighter">SafeDeal</span>
        </div>
        <Badge variant="outline" className="rounded-full border-orange-200 bg-orange-50 text-orange-600 font-black text-[10px] uppercase px-2 py-0.5 animate-pulse">
           Testnet
        </Badge>
      </header>

      <main className="mx-auto max-w-lg px-4 sm:px-6 py-8 space-y-6">
        
        {/* TOP STATUS NAVIGATION (Small) */}
        <div className="flex items-center gap-2 text-slate-400">
           <button className="p-2 hover:bg-white rounded-full transition-colors"><ArrowLeft className="size-4" /></button>
           <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Secure Checkout</span>
        </div>

        <AnimatePresence mode="wait">
          {step === "locking" ? (
             <motion.div 
              key="locking"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 flex flex-col items-center text-center italic-none"
             >
                <div className="size-24 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin" />
                <h2 className="text-2xl font-black mt-8 italic-none">Securing Escrow</h2>
                <p className="text-slate-500 font-bold mt-2 italic-none">Interaction confirmed. Locking {DEAL_DATA.amountUSDC.toFixed(2)} USDC on Stellar.</p>
             </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              
              {/* 1. SELLER TRUST CARD */}
              <Card className="rounded-[2.5rem] border-2 border-emerald-500 shadow-xl shadow-emerald-500/5 overflow-hidden group">
                 <CardContent className="p-0">
                    <div className="bg-emerald-50 px-6 py-3 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <UserCheck className="size-4 text-emerald-600" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{SELLER_DATA.badge}</span>
                       </div>
                       <div className="flex gap-1 text-emerald-500 italic-none">
                          {[...Array(5)].map((_, i) => <Star key={i} className="size-3 fill-current" />)}
                       </div>
                    </div>
                    <div className="p-6 flex items-center gap-4">
                       <div className="size-16 rounded-3xl bg-slate-100 flex items-center justify-center text-2xl group-hover:bg-emerald-100 transition-colors">
                          💍
                       </div>
                       <div>
                          <h3 className="text-lg font-black text-slate-900 italic-none">{SELLER_DATA.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                             <span className="text-[10px] font-black uppercase text-slate-400 italic-none">{SELLER_DATA.deals} Verified Deals</span>
                             <div className="size-1 rounded-full bg-slate-200" />
                             <span className="text-[10px] font-black uppercase text-slate-400 italic-none">{SELLER_DATA.joined}</span>
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              {/* 2. DEAL DETAILS CARD */}
              <Card className="rounded-[2.5rem] bg-white border-slate-200 shadow-sm overflow-hidden">
                 <div className="aspect-[16/9] bg-slate-100 relative group overflow-hidden">
                    <img src={DEAL_DATA.imageUrl} alt={DEAL_DATA.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4">
                       <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-black text-[10px] px-3 py-1">#{DEAL_DATA.id}</Badge>
                    </div>
                 </div>
                 <CardContent className="p-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                       <div>
                          <h2 className="text-2xl font-black text-slate-900 italic-none">{DEAL_DATA.title}</h2>
                          <Badge variant="secondary" className="mt-2 text-[10px] font-black uppercase italic-none text-slate-500">{DEAL_DATA.category}</Badge>
                       </div>
                    </div>
                    <p className="text-slate-500 font-bold leading-relaxed mb-8 italic-none">{DEAL_DATA.description}</p>
                    <Separator className="mb-8" />
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Price in USDC</p>
                          <div className="flex items-baseline gap-2 italic-none">
                             <span className="text-3xl font-black text-slate-900 italic-none">{DEAL_DATA.amountUSDC.toFixed(2)}</span>
                             <span className="text-sm font-black text-emerald-500 italic-none">≈ ₹{DEAL_DATA.amountINR}</span>
                          </div>
                       </div>
                       <div className="text-right italic-none">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Standard Shipping</p>
                          <p className="text-sm font-bold text-slate-700 italic-none">Included FREE</p>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              {/* 3. PROTECTION GUARANTEE CARDS */}
              <div className="grid grid-cols-3 gap-2 italic-none">
                 {[
                    { icon: ShieldCheck, title: "Secured", desc: "No payout until ship", color: "text-emerald-500" },
                    { icon: Timer, title: "Countdown", desc: "Auto-refund if late", color: "text-orange-500" },
                    { icon: Package, title: "Verified", desc: "Item as described", color: "text-blue-500" }
                 ].map((g, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-3 text-center italic-none">
                       <div className={cn("size-8 rounded-lg bg-slate-50 flex items-center justify-center mx-auto mb-2 italic-none", g.color)}>
                          <g.icon className="size-4" />
                       </div>
                       <p className="text-[10px] font-black uppercase mb-1 italic-none">{g.title}</p>
                       <p className="text-[8px] font-bold text-slate-400 italic-none">{g.desc}</p>
                    </div>
                 ))}
              </div>

              {/* 4. FRAUD CHECK DISPLAY */}
              {connected && (
                 <Card className="rounded-[2.5rem] bg-slate-900 text-white p-6 border-none italic-none">
                    <div className="flex items-center justify-between mb-4 italic-none">
                       <div className="flex items-center gap-2 italic-none">
                          <ShieldAlert className="size-4 text-emerald-500 italic-none" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic-none">AI Fraud Check</span>
                       </div>
                       <div className="text-[10px] font-black text-slate-500 italic-none">SAFE ADDRESS</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 italic-none">
                       <div className="flex items-center justify-between mb-2 text-xs font-bold italic-none">
                          <span>Wallet Risk Level</span>
                          <span className="text-emerald-400">{riskScore}% (Low)</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden italic-none">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${riskScore}%` }} className="h-full bg-emerald-500 rounded-full" />
                       </div>
                    </div>
                 </Card>
              )}

              {/* 5. WALLET & PAYMENT ACTION */}
              <div className="space-y-4 pt-4 italic-none">
                 {!connected ? (
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 text-center italic-none">
                       <div className="size-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                          <Smartphone className="size-8 text-slate-200" />
                       </div>
                       <h4 className="text-xl font-black text-slate-900 mb-2 italic-none">Unlock Checkout</h4>
                       <p className="text-slate-500 font-bold mb-8 italic-none text-sm">Connect your Stellar wallet to lock and secure funds in escrow.</p>
                       <div className="flex justify-center">
                          <WalletConnect />
                       </div>
                    </div>
                 ) : step === "pay" ? (
                    <div className="space-y-4 italic-none">
                       <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3 text-amber-700 italic-none">
                          <Info className="size-5 shrink-0" />
                          <p className="text-[10px] font-bold leading-relaxed italic-none">Funds will be locked in the <span className="font-black">SafeDeal Smart Escrow</span>. Only release when you receive the item. Auto-refunds trigger after 48h if no confirmation.</p>
                       </div>
                       <GradientButton 
                          className="w-full rounded-full py-6 text-xl font-black italic-none"
                          onClick={handlePay}
                          disabled={isBlocked || !hasUsdcTrustline}
                       >
                          Pay {DEAL_DATA.amountUSDC.toFixed(2)} USDC & Lock
                       </GradientButton>
                       {isBlocked && <p className="text-center text-xs font-black text-red-500 italic-none">Your wallet is currently blacklisted.</p>}
                    </div>
                 ) : null}

                 {step === "success" && (
                    <div className="bg-white rounded-[2.5rem] border-2 border-emerald-500 p-8 text-center animate-in fade-in zoom-in italic-none">
                       <div className="size-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
                          <CheckCircle2 className="size-10" />
                       </div>
                       <h4 className="text-2xl font-black text-slate-900 mb-2 italic-none">Payment Locked!</h4>
                       <p className="text-slate-500 font-bold mb-8 italic-none text-sm">The seller has been notified to ship your items. 48h countdown active.</p>
                       <div className="bg-slate-50 rounded-2xl p-4 text-left italic-none">
                          <div className="flex items-center justify-between text-[10px] font-black text-slate-400 mb-1 italic-none">
                             <span>ESCROW VAULT</span>
                             <span className="text-emerald-500">ACTIVE</span>
                          </div>
                          <div className="flex items-center justify-between italic-none">
                             <span className="text-sm font-black text-slate-900 italic-none">Auto-Refund Timer</span>
                             <span className="text-sm font-mono text-slate-900 italic-none">{formatTime(timeLeft)}</span>
                          </div>
                       </div>
                       <GradientButton variant="variant" className="w-full rounded-full py-5 text-lg font-black mt-8 italic-none" onClick={() => setStep("confirm_delivery")}>
                          View Receipt
                       </GradientButton>
                    </div>
                 )}
              </div>

              {/* 6. CONFIRM DELIVERY SECTION */}
              {(step === "confirm_delivery" || step === "released" || step === "dispute_opened") && (
                 <Card className="rounded-[2.5rem] border-2 border-slate-900 bg-white shadow-2xl overflow-hidden italic-none">
                    <CardHeader className="bg-slate-900 text-white p-8">
                       <CardTitle className="text-2xl font-black italic-none">Release Payout?</CardTitle>
                       <CardDescription className="text-slate-400 font-bold italic-none">Confirm item condition to finalize the deal.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8 italic-none">
                       {step === "confirm_delivery" ? (
                          <>
                             <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl italic-none">
                                <div className="size-16 rounded-xl bg-white shrink-0 overflow-hidden border border-slate-100">
                                   <img src={DEAL_DATA.imageUrl} className="h-full w-full object-cover" />
                                </div>
                                <div className="italic-none">
                                   <p className="text-sm font-black italic-none text-slate-900">{DEAL_DATA.title}</p>
                                   <p className="text-xs font-bold italic-none text-slate-500">Ref: #{DEAL_DATA.id}</p>
                                </div>
                             </div>
                             <div className="grid gap-3 italic-none">
                                <GradientButton className="w-full rounded-full py-5 text-lg font-black italic-none" onClick={handleConfirmDelivery}>
                                   Yes, Release Funds Now
                                </GradientButton>
                                <button className="w-full py-4 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-full transition-colors" onClick={handleDispute}>
                                   Problem? Open Dispute
                                </button>
                             </div>
                          </>
                       ) : step === "released" ? (
                          <div className="text-center py-4 italic-none">
                             <CheckCircle2 className="size-16 text-emerald-500 mx-auto mb-6" />
                             <h4 className="text-2xl font-black text-slate-900 mb-2 italic-none">Deal Closed</h4>
                             <p className="text-slate-500 font-bold italic-none text-sm">Funds have been released to the seller. Thank you for using SafeDeal!</p>
                             <button className="mt-8 text-xs font-black uppercase tracking-widest text-[#0b50da] flex items-center gap-2 mx-auto italic-none">
                                View on Stellar Expert <ExternalLink className="size-3" />
                             </button>
                          </div>
                       ) : (
                          <div className="text-center py-4 italic-none">
                             <AlertTriangle className="size-16 text-red-500 mx-auto mb-6" />
                             <h4 className="text-2xl font-black text-slate-900 mb-2 italic-none">Dispute Active</h4>
                             <p className="text-slate-500 font-bold italic-none text-sm">The funds are frozen. Our compliance team will reach out to both parties via email shortly.</p>
                             <button className="mt-8 text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 mx-auto italic-none">
                                Case #SD-{DEAL_DATA.id}-DIS <ChevronRight className="size-3" />
                             </button>
                          </div>
                       )}
                    </CardContent>
                 </Card>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER NAV (Mobile optimized) */}
      <footer className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 p-4 lg:hidden">
         <div className="flex items-center justify-between max-w-lg mx-auto italic-none">
            <div className="flex items-center gap-2 italic-none">
               <ShieldCheck className="size-4 text-emerald-500" />
               <span className="text-[10px] font-black uppercase text-slate-500">Secured Checkout</span>
            </div>
            <div className="text-[10px] font-black uppercase text-slate-400">Powered by Stellar</div>
         </div>
      </footer>
    </div>
  );
}
