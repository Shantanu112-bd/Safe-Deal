"use client";

import { useState } from "react";
import { 
  Shield, 
  Star, 
  Package, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Trophy, 
  History, 
  TrendingUp, 
  ShieldAlert,
  ArrowUpRight,
  Flag,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/lib/utils";

// Mock Data
const MERCHANT_DATA = {
  name: "Priya's Jewelry",
  avatar: "PJ",
  category: "Jewelry & Handcrafted",
  trustBadge: "Trusted Seller",
  memberSince: "Jan 2023",
  location: "Mumbai, India",
  bio: "Artisan jeweler specializing in 925 silver and sustainable gemstones. Every piece is handcrafted with love and secured by SafeDeal's smart escrow system.",
  stats: {
    deals: 247,
    rating: 4.9,
    disputes: 0,
    success: "100%"
  },
  reputation: {
    delivery: 5,
    accuracy: 5,
    communication: 4,
    overall: 4.9
  },
  progress: {
    current: 247,
    nextThreshold: 500,
    nextBadge: "Verified Seller"
  }
};

const DEAL_HISTORY = [
  { date: "March 2026", category: "Jewelry", amount: "₹1,000-2,000", rating: 5 },
  { date: "March 2026", category: "Clothing", amount: "₹500-1,000", rating: 5 },
  { date: "Feb 2026", category: "Jewelry", amount: "₹4,000-5,000", rating: 5 },
  { date: "Feb 2026", category: "Jewelry", amount: "₹2,000-3,000", rating: 4 },
  { date: "Jan 2026", category: "Accessories", amount: "₹1,000-1,500", rating: 5 },
  { date: "Jan 2026", category: "Jewelry", amount: "₹5,000-7,000", rating: 5 },
  { date: "Dec 2025", category: "Jewelry", amount: "₹1,500-2,000", rating: 5 },
  { date: "Dec 2025", category: "Clothing", amount: "₹1,000-1,500", rating: 5 },
  { date: "Nov 2025", category: "Jewelry", amount: "₹2,500-3,500", rating: 5 },
  { date: "Nov 2025", category: "Accessories", amount: "₹500-1,000", rating: 5 },
];

const ACTIVE_LISTINGS = [
  { id: "4822", title: "Handmade Silver Earrings", amountUSDC: 24.00, amountINR: 1997 },
  { id: "4823", title: "Silver Necklace Set", amountUSDC: 35.00, amountINR: 2921 },
  { id: "4824", title: "Amethyst Ring", amountUSDC: 18.00, amountINR: 1498 },
];

export default function MerchantPage({ params }: { params: { id: string } }) {
  const merchantId = params.id;
  const [activeTab, setActiveTab] = useState<"listings" | "history">("listings");

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans italic-none">
      {/* Search/Header background */}
      <div className="h-32 w-full bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
        </div>
      </div>

      <main className="mx-auto max-w-lg px-6 pb-24 -mt-16 relative z-10">
        {/* SELLER HEADER */}
        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 border border-slate-100 italic-none">
          <div className="flex flex-col items-center text-center">
            <div className="size-24 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white text-3xl font-black ring-8 ring-white shadow-lg italic-none">
              {MERCHANT_DATA.avatar}
            </div>
            
            <div className="mt-6 space-y-2">
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 italic-none">{MERCHANT_DATA.name}</h1>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 ring-1 ring-emerald-100 flex items-center gap-1.5 italic-none">
                  <ShieldCheck className="size-3.5 fill-emerald-100" />
                  {MERCHANT_DATA.trustBadge}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-400 italic-none">{MERCHANT_DATA.category}</p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1.5 italic-none">
                <MapPin className="size-3.5 text-slate-400 italic-none" />
                {MERCHANT_DATA.location}
              </div>
              <div className="flex items-center gap-1.5 italic-none">
                <Calendar className="size-3.5 text-slate-400 italic-none" />
                Member since {MERCHANT_DATA.memberSince}
              </div>
            </div>

            <p className="mt-6 text-sm text-slate-600 leading-relaxed max-w-sm italic-none">
              {MERCHANT_DATA.bio} ⚖️ ID: {merchantId}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-4 gap-2 italic-none">
            {[
              { label: "Deals", value: MERCHANT_DATA.stats.deals, icon: Package, color: "text-blue-500" },
              { label: "Rating", value: `${MERCHANT_DATA.stats.rating}★`, icon: Star, color: "text-orange-500" },
              { label: "Disputes", value: MERCHANT_DATA.stats.disputes, icon: ShieldAlert, color: "text-red-500" },
              { label: "Success", value: MERCHANT_DATA.stats.success, icon: TrendingUp, color: "text-emerald-500" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center rounded-2xl bg-slate-50 border border-slate-100 py-4 italic-none">
                <span className={cn("text-lg font-black italic-none", stat.color)}>{stat.value}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1 italic-none">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TRUST BADGE DETAIL */}
        <div className="mt-8 rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20 italic-none">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Reputation Level</p>
              <h3 className="text-2xl font-black italic-none">{MERCHANT_DATA.trustBadge}</h3>
            </div>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10 italic-none">
              <Trophy className="size-8 text-emerald-400 italic-none" />
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-300 leading-relaxed italic-none">
            The <span className="text-emerald-400 font-bold">Trusted Seller</span> badge is awarded to merchants with high volume and zero unresolved disputes.
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-[11px] font-bold text-slate-400 italic-none">
              <span>Progress to {MERCHANT_DATA.progress.nextBadge}</span>
              <span>{MERCHANT_DATA.progress.current} / {MERCHANT_DATA.progress.nextThreshold} Deals</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden italic-none">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(MERCHANT_DATA.progress.current / MERCHANT_DATA.progress.nextThreshold) * 100}%` }}
                className="h-full bg-emerald-500 rounded-full italic-none" 
              />
            </div>
          </div>
        </div>

        {/* REPUTATION BREAKDOWN */}
        <div className="mt-8 rounded-3xl bg-white p-8 border border-slate-100 shadow-sm italic-none">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 italic-none">Reputation Breakdown</h4>
          <div className="mt-6 space-y-4 italic-none">
            {[
              { label: "Delivery Speed", score: MERCHANT_DATA.reputation.delivery },
              { label: "Item Accuracy", score: MERCHANT_DATA.reputation.accuracy },
              { label: "Communication", score: MERCHANT_DATA.reputation.communication },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between italic-none">
                <span className="text-sm font-bold text-slate-700 italic-none">{item.label}</span>
                <div className="flex gap-0.5 italic-none">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={cn(
                        "size-4 italic-none", 
                        s <= item.score ? "fill-orange-400 text-orange-400" : "text-slate-200"
                      )} 
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between italic-none">
              <span className="text-sm font-black text-slate-900 italic-none">Overall Reliability</span>
              <span className="text-lg font-black text-slate-900 italic-none">{MERCHANT_DATA.reputation.overall} / 5.0</span>
            </div>
          </div>
        </div>

        {/* AI VERIFICATION SECTION */}
        <div className="mt-8 rounded-3xl bg-emerald-50 border border-emerald-100 p-8 italic-none">
          <div className="flex items-center gap-3">
             <div className="flex size-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm italic-none">
               <ShieldCheck className="size-6 italic-none" />
             </div>
             <div>
               <h4 className="text-lg font-black text-slate-900 italic-none">SafeDeal AI Verified</h4>
               <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest italic-none">Security Audit Complete</p>
             </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 italic-none">
             {[
               { label: "Wallet Analyzed", checked: true },
               { label: "ID Verified", checked: true },
               { label: "No Fraud History", checked: true },
               { label: "Active Network", checked: true },
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600 italic-none">
                 <CheckCircle2 className="size-4 text-emerald-500 italic-none" />
                 {item.label}
               </div>
             ))}
          </div>
          
          <div className="mt-8 p-4 rounded-2xl bg-white/50 border border-emerald-100 flex items-center justify-between italic-none">
            <span className="text-[11px] font-bold text-slate-500 italic-none">Verification Date</span>
            <span className="text-[11px] font-black text-emerald-700 italic-none">JAN 14, 2026</span>
          </div>
        </div>

        {/* CONTENT TABS */}
        <div className="mt-12 space-y-8 italic-none">
          <div className="flex gap-4 border-b border-slate-200 italic-none">
            <button 
              onClick={() => setActiveTab("listings")}
              className={cn(
                "pb-4 text-sm font-black uppercase tracking-widest transition-all italic-none",
                activeTab === "listings" ? "text-slate-900 border-b-2 border-slate-900" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Active Listings
            </button>
            <button 
              onClick={() => setActiveTab("history")}
              className={cn(
                "pb-4 text-sm font-black uppercase tracking-widest transition-all italic-none",
                activeTab === "history" ? "text-slate-900 border-b-2 border-slate-900" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Deal History
            </button>
          </div>

          <div>
            {activeTab === "listings" ? (
              <div className="space-y-4 italic-none">
                {ACTIVE_LISTINGS.map((deal) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={deal.id} 
                    className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md group italic-none"
                  >
                    <div className="flex items-start justify-between italic-none">
                      <div className="space-y-1">
                        <h5 className="font-black text-slate-900 text-lg italic-none">{deal.title}</h5>
                        <div className="flex items-center gap-2 italic-none">
                          <span className="text-xl font-black text-emerald-600 italic-none">{deal.amountUSDC.toFixed(2)} USDC</span>
                          <span className="text-xs font-bold text-slate-400 italic-none">≈ ₹{deal.amountINR}</span>
                        </div>
                      </div>
                      <div className="size-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all italic-none">
                        <ChevronRight className="size-5 italic-none" />
                      </div>
                    </div>
                    <GradientButton className="mt-6 w-full rounded-2xl py-4 flex items-center gap-2 font-black italic-none">
                       Buy Safely with Escrow
                       <ArrowUpRight className="size-4 italic-none" />
                    </GradientButton>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm italic-none">
                <div className="overflow-x-auto italic-none">
                  <table className="w-full text-left italic-none">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 italic-none">
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 italic-none">Date</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 italic-none">Category</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 italic-none">Amount</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 italic-none text-right">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 italic-none">
                      {DEAL_HISTORY.map((deal, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors italic-none">
                          <td className="px-6 py-4 text-xs font-bold text-slate-600 italic-none">{deal.date}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-900 italic-none text-nowrap">{deal.category}</td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-500 italic-none text-nowrap">{deal.amount}</td>
                          <td className="px-6 py-4 text-xs text-right italic-none">
                            <div className="flex justify-end gap-0.5 italic-none">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                  key={s} 
                                  className={cn(
                                    "size-3 italic-none", 
                                    s <= deal.rating ? "fill-orange-400 text-orange-400" : "text-slate-200"
                                  )} 
                                />
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-slate-50 text-center italic-none">
                  <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors italic-none">
                    Load Older History
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* REPORT SELLER */}
        <div className="mt-16 text-center italic-none">
           <button className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all italic-none">
             <Flag className="size-4 italic-none" />
             Report suspicious activity
           </button>
           <p className="mt-4 text-[10px] text-slate-400 max-w-xs mx-auto italic-none">
             Reports are manually reviewed by SafeDeal compliance team within 24 hours.
           </p>
        </div>
      </main>

      {/* Footer Nav for Mobile (Demo) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex justify-around p-4 italic-none">
         <button className="flex flex-col items-center gap-1 text-slate-400 italic-none">
           <Shield className="size-5 italic-none" />
           <span className="text-[10px] font-bold italic-none">Home</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-900 italic-none">
           <History className="size-5 italic-none" />
           <span className="text-[10px] font-bold italic-none">Store</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-400 italic-none">
           <MessageSquare className="size-5 italic-none" />
           <span className="text-[10px] font-bold italic-none">Chat</span>
         </button>
      </nav>
    </div>
  );
}
