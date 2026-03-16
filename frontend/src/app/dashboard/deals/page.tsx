"use client";

import { useState } from "react";
import { 
  Search, 
  Plus, 
  Clock, 
  Share2, 
  ExternalLink,
  ShoppingBag
} from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { CreateDealModal } from "@/components/deal/CreateDealModal";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Status = "all" | "waiting" | "locked" | "shipped" | "disputed";

const deals = [
  { id: "4823", title: "Handmade Silver Earrings", buyer: "GCKF...WXQR", amount: "2,400 USDC", status: "waiting", created: "2h ago" },
  { id: "4822", title: "Custom Kurti - Size M", buyer: "GDF9...12KD", amount: "1,800 USDC", status: "locked", created: "4h ago" },
  { id: "4821", title: "Vintage Leather Bag", buyer: "GARM...99PQ", amount: "4,500 USDC", status: "shipped", created: "1d ago" },
  { id: "4820", title: "Organic Tea Set", buyer: "HDK2...99XX", amount: "900 USDC", status: "disputed", created: "2d ago" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  waiting: { label: "Waiting for Payment", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  locked: { label: "Payment Locked", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  shipped: { label: "Shipped", color: "text-sky-600", bg: "bg-sky-50 border-sky-100" },
  disputed: { label: "Disputed", color: "text-red-600", bg: "bg-red-50 border-red-100" },
};

export default function ActiveDealsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<Status>("all");
  const [search, setSearch] = useState("");

  const filteredDeals = deals.filter(deal => {
    const matchesStatus = filter === "all" || deal.status === filter;
    const matchesSearch = deal.title.toLowerCase().includes(search.toLowerCase()) || deal.id.includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex-1 min-w-0 bg-slate-50 pb-20">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-10 h-20 flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900">Active Strategic Deals</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Monitoring {filteredDeals.length} active engagements</p>
        </div>
        <GradientButton
          className="rounded-xl px-6 py-3 text-sm font-bold"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="mr-2 size-4" />
          Create New Deal
        </GradientButton>
      </header>

      <main className="mx-auto max-w-7xl px-6 lg:px-10 py-10 space-y-8">
        
        {/* FILTERS BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex bg-white p-1 rounded-2xl border border-slate-200 w-fit">
              {["all", "waiting", "locked", "shipped", "disputed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s as Status)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    filter === s ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {s}
                </button>
              ))}
           </div>
           
           <div className="relative group max-w-xs w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
              <input 
                type="text" 
                placeholder="Search deals by ID or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
              />
           </div>
        </div>

        {/* DEALS LIST */}
        <div className="grid gap-6">
           {filteredDeals.length > 0 ? (
             filteredDeals.map((deal) => {
               const config = statusConfig[deal.status];
               return (
                 <Link 
                   href={`/dashboard/deals/${deal.id}`}
                   key={deal.id} 
                   className="group block rounded-[2.5rem] bg-white border border-slate-100 p-6 sm:p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
                 >
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex gap-6 items-center">
                         <div className="size-16 rounded-3xl bg-slate-50 flex items-center justify-center text-2xl ring-1 ring-slate-100 group-hover:bg-white transition-colors">
                            🛍️
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deal #{deal.id}</p>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{deal.title}</h3>
                            <div className="flex items-center gap-3 mt-2">
                               <span className="text-sm font-black text-emerald-600">{deal.amount}</span>
                               <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", config.bg, config.color)}>
                                  {config.label}
                               </span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end justify-between gap-4">
                         <div className="flex items-center gap-2 text-[10px] font-black text-slate-400">
                            <Clock className="size-3" />
                            CREATED {deal.created.toUpperCase()}
                         </div>
                         <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-500 mr-2">Buyer: <span className="font-mono text-slate-400">{deal.buyer}</span></p>
                            <div className="flex items-center gap-2">
                               <button onClick={(e) => { e.preventDefault(); /* share */ }} className="size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
                                  <Share2 className="size-4" />
                               </button>
                               <button className="size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
                                  <ExternalLink className="size-4" />
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                 </Link>
               );
             })
           ) : (
             <div className="py-24 flex flex-col items-center text-center space-y-6">
                <div className="size-20 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-300">
                   <ShoppingBag className="size-10" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No Strategic Deals Found</h3>
                   <p className="text-sm font-bold text-slate-400 max-w-xs mx-auto uppercase tracking-widest leading-relaxed">Try adjusting your filters or create your first deal to get started.</p>
                </div>
                <GradientButton onClick={() => setShowCreate(true)} className="rounded-xl px-8 py-4">
                   Initialize Your First Deal
                </GradientButton>
             </div>
           )}
        </div>
      </main>

      <CreateDealModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
