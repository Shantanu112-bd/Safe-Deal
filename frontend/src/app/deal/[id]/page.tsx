"use client";

import { useState, useEffect } from "react";
import { 
  Lock, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  Clock, 
  MessageSquare, 
  Copy,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  Timer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/lib/utils";
import { useWallet } from "@/context/WalletContext";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Types
type PageStep = "pay" | "locking" | "success" | "confirm_delivery" | "dispute_opened" | "released";
type SellerStatus = "verified" | "new" | "flagged";

// Mock Data
const SELLER_DATA = {
  name: "Priya's Jewelry",
  status: "verified" as SellerStatus,
  rating: 4.9,
  completedDeals: 247,
  memberSince: "Jan 2023",
  lastDispute: "Never"
};

const DEAL_DATA = {
  title: "Handmade Silver Earrings",
  description: "Handcrafted 925 silver earrings. Size 2cm.",
  amountUSDC: 24.00,
  amountINR: 1997,
  image: "https://images.unsplash.com/photo-1635767794421-4d5671c69991?q=80&w=2000&auto=format&fit=crop"
};

export default function DealPage({ params }: { params: { id: string } }) {
  const dealId = params.id;
  const { connected, balance, isBlocked, riskScore, hasUsdcTrustline } = useWallet();
  const [step, setStep] = useState<PageStep>("pay");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(172800); // 48 hours in seconds

  useEffect(() => {
    // Simulate initial fetch
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  const handlePay = () => {
    setStep("locking");
    setTimeout(() => {
      setStep("success");
      toast.success("Payment locked — safe to ship!", {
        description: "Your funds are now secured in the Stellar escrow contract."
      });
    }, 2500);
  };

  const handleRelease = () => {
    setStep("released");
    toast.success("Payment released to your wallet!", {
      description: "Seller has been successfully paid."
    });
  };

  const handleDispute = () => {
    setStep("dispute_opened");
    toast.error("Dispute raised — funds frozen", {
      description: "SafeDeal compliance team will review the case."
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`safedeal.app/deal/${dealId}/confirm`);
    setCopied(true);
    toast.info("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-6 pt-12 space-y-8">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-12 w-3/4 mx-auto rounded-full" />
      </div>
    );
  }

  // Border color based on seller status
  const getBorderColor = (status: SellerStatus) => {
    switch (status) {
      case "verified": return "border-emerald-500 shadow-xl shadow-emerald-500/10";
      case "new": return "border-orange-400 shadow-xl shadow-orange-500/10";
      case "flagged": return "border-red-500 shadow-xl shadow-red-500/10";
      default: return "border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans italic-none">
      <main className="mx-auto max-w-lg px-6 pb-24 pt-8">
        <AnimatePresence mode="wait">
          {step === "locking" ? (
            <motion.div 
              key="locking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="relative">
                <div className="size-24 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="size-8 text-emerald-600" />
                </div>
              </div>
              <h2 className="mt-8 text-2xl font-black text-slate-900">Locking Escrow...</h2>
              <p className="mt-2 text-slate-500 font-medium">Securing {DEAL_DATA.amountUSDC.toFixed(2)} USDC on Stellar</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* COUNTDOWN TIMER BADGE */}
              <div className="flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg mx-auto w-fit italic-none">
                <Timer className="size-3.5 text-emerald-400 italic-none" />
                Escrow Auto-Refund: {formatTime(timeLeft)}
              </div>

              {/* SELLER TRUST CARD */}
              <div className={cn(
                "group relative overflow-hidden rounded-3xl border-2 bg-white p-6 transition-all duration-300",
                getBorderColor(SELLER_DATA.status)
              )}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seller Identity</p>
                    <h2 className="text-xl font-bold text-slate-900">{SELLER_DATA.name}</h2>
                  </div>
                  {SELLER_DATA.status === "verified" && (
                    <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 ring-1 ring-emerald-100">
                      <CheckCircle2 className="size-3" /> VERIFIED
                    </div>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    { label: "Rating", value: SELLER_DATA.rating, icon: Star, color: "text-orange-500" },
                    { label: "Deals", value: SELLER_DATA.completedDeals, icon: Package, color: "text-blue-500" },
                    { label: "Member", value: SELLER_DATA.memberSince, icon: Clock, color: "text-indigo-500" },
                    { label: "Dispute", value: SELLER_DATA.lastDispute, icon: MessageSquare, color: "text-emerald-500" },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 transition-colors group-hover:bg-emerald-50/50">
                      <div className={cn("flex size-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100 italic-none", stat.color)}>
                        <stat.icon className="size-4 fill-current italic-none" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</p>
                        <p className="text-sm font-bold text-slate-900">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DEAL DETAILS CARD */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden relative">
                   <img 
                    src={DEAL_DATA.image} 
                    alt={DEAL_DATA.title}
                    className="w-full h-full object-cover"
                   />
                   <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-slate-900 shadow-sm">
                     REF: #{dealId}
                   </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{DEAL_DATA.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 leading-relaxed italic-none">{DEAL_DATA.description}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-6 py-5 ring-1 ring-slate-100">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total amount</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 italic-none">{DEAL_DATA.amountUSDC.toFixed(2)} USDC</span>
                        <span className="text-xs font-bold text-emerald-600">≈ ₹{DEAL_DATA.amountINR}</span>
                      </div>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                      <Smartphone className="size-6 text-slate-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT SECTION */}
              <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
                {step === "pay" && !connected && (
                  <div className="space-y-6">
                    <div className="space-y-1 text-center">
                      <h3 className="text-2xl font-black italic-none">Secure Payment</h3>
                      <p className="text-sm text-slate-400 italic-none">Connect wallet to lock {DEAL_DATA.amountUSDC.toFixed(2)} USDC in escrow.</p>
                    </div>
                    <div className="flex justify-center italic-none">
                      <WalletConnect />
                    </div>
                  </div>
                )}

                {connected && step === "pay" && (
                  <div className="space-y-8">
                    {isBlocked ? (
                       <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 flex gap-3 text-red-200">
                        <ShieldAlert className="size-5 shrink-0" />
                        <div className="text-xs leading-relaxed italic-none">
                          <span className="font-bold block text-sm text-red-400 mb-1 italic-none">Access Restricted</span>
                          Your wallet has been flagged for suspicious activity.
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 italic-none">
                          <div className="flex items-center justify-between text-xs font-bold italic-none">
                             <div className="flex items-center gap-2 italic-none">
                               <ShieldCheck className="size-4 text-emerald-500 italic-none" />
                               <span className="text-emerald-400 font-black italic-none uppercase tracking-widest">Safe Analytics</span>
                             </div>
                             <span className="text-slate-400 italic-none">Risk Score: {riskScore}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden italic-none">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${riskScore}%` }}
                                className={cn(
                                  "h-full rounded-full italic-none",
                                  (riskScore || 0) > 60 ? "bg-red-500" : "bg-emerald-500"
                                )}
                             />
                          </div>
                        </div>

                        <div className="space-y-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 italic-none">
                          <div className="flex items-center justify-between text-sm italic-none">
                            <span className="text-slate-400 italic-none">USDC Balance</span>
                            <span className="font-bold text-white italic-none">{balance} USDC</span>
                          </div>
                          <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between italic-none">
                            <span className="text-sm font-bold italic-none">Net Payable</span>
                            <span className="text-xl font-black text-emerald-400 italic-none">{DEAL_DATA.amountUSDC.toFixed(2)} USDC</span>
                          </div>
                        </div>

                        <GradientButton 
                          className="w-full rounded-full text-lg py-5 font-black italic-none"
                          onClick={handlePay}
                          disabled={!hasUsdcTrustline}
                        >
                          {!hasUsdcTrustline ? "Fix Trustline to Pay" : "Pay & Lock in Escrow"}
                        </GradientButton>
                      </>
                    )}
                  </div>
                )}

                {step === "success" && (
                   <div className="space-y-8 py-4">
                     <div className="text-center space-y-4">
                        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-600 shadow-2xl shadow-emerald-600/40 text-white">
                          <CheckCircle2 className="size-10" />
                        </div>
                        <h3 className="text-2xl font-black italic-none">Funds Secured!</h3>
                        <p className="text-slate-400 text-sm">Escrow transaction success on Stellar Testnet.</p>
                     </div>

                     <div className="rounded-3xl bg-white/5 p-6 space-y-4 ring-1 ring-white/10 italic-none">
                        <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-widest italic-none">
                          <span>Deal Reference</span>
                          <span className="text-white">#{dealId}</span>
                        </div>
                        <div className="flex gap-2 italic-none">
                          <div className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-[10px] font-mono text-emerald-400 truncate ring-1 ring-white/5 italic-none">
                             safedeal.app/deal/{dealId}
                          </div>
                          <button 
                            onClick={copyLink}
                            className="size-11 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors italic-none"
                          >
                            {copied ? <CheckCircle2 className="size-5 text-emerald-500 italic-none" /> : <Copy className="size-5 italic-none" />}
                          </button>
                        </div>
                     </div>

                     <GradientButton 
                      variant="variant"
                      className="w-full rounded-full text-lg py-5 font-bold italic-none"
                      onClick={() => setStep("confirm_delivery")}
                    >
                      Continue to Receipt
                    </GradientButton>
                   </div>
                )}
              </div>

               {/* CONFIRM DELIVERY SECTION */}
               {(step === "confirm_delivery" || step === "released" || step === "dispute_opened") && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl border-2 border-emerald-500/20 bg-white p-6 md:p-8 shadow-xl space-y-8"
                >
                  {step === "confirm_delivery" ? (
                    <>
                      <div className="text-center space-y-3 italic-none">
                        <h3 className="text-2xl font-black text-slate-900 italic-none">Ready to release?</h3>
                        <p className="text-slate-500 text-sm italic-none">Please confirm you have received the items in the described condition.</p>
                      </div>

                      <div className="aspect-square w-32 md:w-48 mx-auto rounded-3xl bg-slate-100 overflow-hidden ring-4 ring-slate-50 italic-none">
                        <img 
                          src={DEAL_DATA.image} 
                          alt={DEAL_DATA.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="grid gap-3 italic-none">
                        <GradientButton 
                          className="w-full rounded-full text-lg py-5 font-black italic-none"
                          onClick={handleRelease}
                        >
                          Yes, I received it — Release Payment
                        </GradientButton>
                        <GradientButton 
                          variant="variant"
                          className="w-full rounded-full text-lg py-5 font-black italic-none"
                          onClick={handleDispute}
                        >
                          No, I have a problem — Open Dispute
                        </GradientButton>
                      </div>
                    </>
                  ) : step === "released" ? (
                    <div className="text-center space-y-6 py-6 italic-none">
                       <div className="mx-auto size-24 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50 italic-none">
                          <ShieldCheck className="size-12 italic-none" />
                       </div>
                       <div className="space-y-2 italic-none">
                          <h3 className="text-2xl font-black text-slate-900 italic-none">Deal Finalized</h3>
                          <p className="text-slate-500 italic-none">Payment released successfully. Escrow closed.</p>
                       </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-6 py-6 italic-none">
                       <div className="mx-auto size-24 flex items-center justify-center rounded-full bg-red-100 text-red-600 ring-8 ring-red-50 italic-none">
                          <AlertTriangle className="size-12 italic-none" />
                       </div>
                       <div className="space-y-2 italic-none">
                          <h3 className="text-2xl font-black text-slate-900 italic-none">Dispute Raised</h3>
                          <p className="text-slate-500 italic-none">Case under review. Funds are locked securely.</p>
                       </div>
                    </div>
                  )}
                </motion.div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
