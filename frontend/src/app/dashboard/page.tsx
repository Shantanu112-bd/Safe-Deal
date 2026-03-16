"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  LayoutDashboard,
  ShoppingBag,
  History,
  User,
  Plus,
} from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { CreateDealModal } from "@/components/deal/CreateDealModal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type DealStatus =
  | "Waiting for Payment"
  | "Payment Locked"
  | "Shipped"
  | "Completed"
  | "Disputed"
  | "Refunded";

type DealCard = {
  id: string;
  title: string;
  buyer: string;
  amount: string;
  status: DealStatus;
  createdAgo: string;
  expiresIn: string;
};

const activeDeals: DealCard[] = [
  {
    id: "4823",
    title: "Handmade Silver Earrings",
    buyer: "GCKF...WXQR",
    amount: "2,400 USDC",
    status: "Waiting for Payment",
    createdAgo: "2 hours ago",
    expiresIn: "5 days 22 hours",
  },
  {
    id: "4822",
    title: "Custom Kurti - Size M",
    buyer: "GDF9...12KD",
    amount: "1,800 USDC",
    status: "Payment Locked",
    createdAgo: "4 hours ago",
    expiresIn: "3 days 18 hours",
  },
];

const statusStyles: Record<
  DealStatus,
  { label: string; dotClass: string; textClass: string; badgeClass: string }
> = {
  "Waiting for Payment": {
    label: "Waiting for Payment",
    dotClass: "bg-amber-400",
    textClass: "text-amber-700",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
  },
  "Payment Locked": {
    label: "Payment Locked",
    dotClass: "bg-emerald-400 animate-pulse",
    textClass: "text-emerald-700",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  Shipped: {
    label: "Shipped",
    dotClass: "bg-sky-400",
    textClass: "text-sky-700",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-700",
  },
  Completed: {
    label: "Completed",
    dotClass: "bg-slate-400",
    textClass: "text-slate-700",
    badgeClass: "border-slate-200 bg-slate-50 text-slate-700",
  },
  Disputed: {
    label: "Disputed",
    dotClass: "bg-orange-400",
    textClass: "text-orange-700",
    badgeClass: "border-orange-200 bg-orange-50 text-orange-700",
  },
  Refunded: {
    label: "Refunded",
    dotClass: "bg-red-400",
    textClass: "text-red-700",
    badgeClass: "border-red-200 bg-red-50 text-red-700",
  },
};

export default function Dashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 space-y-8">
        <div className="grid grid-cols-4 gap-4">
           <Skeleton className="h-32 rounded-2xl" />
           <Skeleton className="h-32 rounded-2xl" />
           <Skeleton className="h-32 rounded-2xl" />
           <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 lg:pb-0">
      <div className="flex min-h-screen">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex italic-none">
          <div className="flex items-center gap-2 px-2">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-slate-900 shadow-lg text-white italic-none">
              <Shield className="size-5" />
            </span>
            <div>
              <p className="text-sm font-black text-slate-900 italic-none tracking-tight">SafeDeal</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic-none">Merchant Hub</p>
            </div>
          </div>

          <nav className="mt-8 flex-1 space-y-1 text-sm font-bold italic-none">
            <a href="#" className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-white italic-none">
              <LayoutDashboard className="size-4" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-slate-500 hover:bg-slate-50 italic-none">
              <ShoppingBag className="size-4" />
              <span>Orders</span>
            </a>
            <a href="#" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-slate-500 hover:bg-slate-50 italic-none">
              <History className="size-4" />
              <span>Payments</span>
            </a>
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 italic-none">
          <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur italic-none">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
              <h1 className="text-lg font-black text-slate-900 italic-none">Dashboard</h1>
              <GradientButton
                className="rounded-xl px-5 py-2 text-sm font-bold italic-none"
                onClick={() => setShowCreate(true)}
              >
                <Plus className="mr-1.5 size-4" />
                Create Deal
              </GradientButton>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-6 py-8 italic-none">
            {/* Stats row */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 italic-none">
              {[
                { label: "Active Deals", value: "3", sub: "Monitoring" },
                { label: "Pending", value: "₹12,400", sub: "In Escrow" },
                { label: "Reliability", value: "100%", sub: "Success Rate" },
                { label: "Revenue", value: "₹1.24L", sub: "Total Volume" },
              ].map((stat) => (
                <article key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm italic-none">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic-none">{stat.label}</p>
                  <p className="mt-2 text-2xl font-black text-slate-900 italic-none">{stat.value}</p>
                  <p className="mt-1 text-xs font-bold text-emerald-600 italic-none">{stat.sub}</p>
                </article>
              ))}
            </section>

            <div className="mt-8 grid gap-6 lg:grid-cols-3 italic-none">
               <div className="lg:col-span-2 space-y-6 italic-none">
                  <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm italic-none">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 italic-none">In-Progress Deals</h2>
                    <div className="mt-6 space-y-4">
                       {activeDeals.map((deal) => {
                          const style = statusStyles[deal.status];
                          return (
                            <div key={deal.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 italic-none">
                               <div>
                                  <p className="font-bold text-slate-900 text-sm">#{deal.id} {deal.title}</p>
                                  <p className="text-xs text-slate-400 font-bold uppercase mt-1 italic-none">{deal.amount}</p>
                               </div>
                               <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic-none", style.badgeClass)}>
                                  {deal.status}
                               </span>
                            </div>
                          );
                       })}
                    </div>
                  </article>
               </div>

               <article className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20 italic-none flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic-none">Stellar Network</p>
                    <h3 className="mt-2 text-xl font-black italic-none">Production Ready</h3>
                    <p className="mt-4 text-sm text-slate-400 leading-relaxed italic-none">
                      Your deals are secured by the merchant-escrow-v1 contract on Stellar Testnet.
                    </p>
                  </div>
                  <GradientButton variant="variant" className="mt-8 w-full rounded-xl py-3 text-xs font-black uppercase italic-none">
                     View Contract
                  </GradientButton>
               </article>
            </div>
          </main>
        </div>
      </div>

      <CreateDealModal open={showCreate} onClose={() => setShowCreate(false)} />
      
      {/* Mobile Bottom Tabs */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex justify-around p-4 lg:hidden italic-none">
         <button className="text-slate-900 italic-none flex flex-col items-center gap-1">
            <LayoutDashboard className="size-5" />
            <span className="text-[10px] font-black uppercase">Home</span>
         </button>
         <button className="text-slate-400 italic-none flex flex-col items-center gap-1" onClick={() => setShowCreate(true)}>
            <Plus className="size-5" />
            <span className="text-[10px] font-black uppercase">Create</span>
         </button>
         <button className="text-slate-400 italic-none flex flex-col items-center gap-1">
            <User className="size-5" />
            <span className="text-[10px] font-black uppercase">Settings</span>
         </button>
      </nav>
    </div>
  );
}
