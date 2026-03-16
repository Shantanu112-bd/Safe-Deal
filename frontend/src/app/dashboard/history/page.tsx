"use client";

import { useState } from "react";
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  ArrowDownLeft,
  Calendar,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const history = [
  { id: "TX-9021", dealId: "#4821", item: "Vintage Leather Bag", type: "Sale", amount: "+4,500 USDC", date: "Mar 13, 2024", status: "completed" },
  { id: "TX-9020", dealId: "#4815", item: "Silver Necklace", type: "Sale", amount: "+3,200 USDC", date: "Mar 12, 2024", status: "completed" },
  { id: "TX-9019", dealId: "#4814", item: "Custom Kurti", type: "Refund", amount: "-1,800 USDC", date: "Mar 10, 2024", status: "refunded" },
  { id: "TX-9018", dealId: "#4810", item: "Food Catering", type: "Sale", amount: "+8,500 USDC", date: "Mar 08, 2024", status: "completed" },
  { id: "TX-9017", dealId: "#4809", item: "Digital Portrait", type: "Sale", amount: "+1,200 USDC", date: "Mar 05, 2024", status: "disputed" },
  { id: "TX-9016", dealId: "#4802", item: "Handmade Earrings", type: "Sale", amount: "+2,100 USDC", date: "Mar 01, 2024", status: "completed" },
];

const statusConfig: Record<string, { label: string; dot: string; text: string }> = {
  completed: { label: "Completed", dot: "bg-emerald-500", text: "text-emerald-600" },
  refunded: { label: "Refunded", dot: "bg-amber-500", text: "text-amber-600" },
  disputed: { label: "Disputed", dot: "bg-red-500", text: "text-red-600" },
};

export default function HistoryPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex-1 min-w-0 bg-slate-50 pb-20 font-sans">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-10 h-20 flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900">Transaction History</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Audited record of all finalized settlements</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <Download className="size-4" />
          Export CSV
        </button>
      </header>

      <main className="mx-auto max-w-7xl px-6 lg:px-10 py-10 space-y-10">
        
        {/* SUMMARY CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
           {[
              { label: "Lifetime Earnings", val: "1.24L USDC", sub: "+₹847 today", icon: CheckCircle2, iconColor: "text-emerald-500" },
              { label: "Successful Settlements", val: "482", sub: "98.4% Integrity", icon: ArrowDownLeft, iconColor: "text-blue-500" },
              { label: "Average Deal Value", val: "2,450 USDC", sub: "Growing trend", icon: Calendar, iconColor: "text-indigo-500" },
           ].map((stat, i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm group hover:shadow-xl transition-all">
                 <div className="flex items-start justify-between mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                    <stat.icon className={cn("size-5", stat.iconColor)} />
                 </div>
                 <h2 className="text-3xl font-black text-slate-900">{stat.val}</h2>
                 <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">{stat.sub}</p>
              </div>
           ))}
        </div>

        {/* FILTER ROW */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
           <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
              <input 
                 type="text" 
                 placeholder="Search by Deal ID, Item, or Transaction Reference..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all"
              />
           </div>
           
           <div className="flex gap-2">
              <button className="flex items-center gap-2 rounded-2xl border border-slate-100 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors">
                 <Calendar className="size-4" />
                 Date
              </button>
              <button className="flex items-center gap-2 rounded-2xl border border-slate-100 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors">
                 <Filter className="size-4" />
                 Status
              </button>
           </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
           <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                 <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Deal Reference</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Time</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Settlement</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {history.map((tx) => {
                    const config = statusConfig[tx.status];
                    return (
                       <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors cursor-pointer group">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-slate-900 transition-all">
                                   {tx.type === "Sale" ? <ArrowDownLeft className="size-5" /> : <AlertTriangle className="size-5" />}
                                </div>
                                <div>
                                   <p className="text-sm font-black text-slate-900">{tx.item}</p>
                                   <p className="text-[10px] font-mono text-slate-400">{tx.id}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-xs font-black text-slate-900 uppercase tracking-widest px-3 py-1 rounded-lg bg-slate-100">
                                {tx.dealId}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-xs font-bold text-slate-600">{tx.date}</p>
                             <p className="text-[10px] font-bold text-slate-400">2:45 PM IST</p>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                <div className={cn("size-1.5 rounded-full", config.dot)} />
                                <span className={cn("text-[10px] font-black uppercase tracking-widest", config.text)}>
                                   {config.label}
                                </span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <p className={cn("text-sm font-black", tx.amount.startsWith('+') ? "text-emerald-600" : "text-slate-900")}>
                                {tx.amount}
                             </p>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest tracking-tighter">USDC EQUIV.</p>
                          </td>
                       </tr>
                    );
                 })}
              </tbody>
           </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-2">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Showing 1 to 10 of 482 entries</p>
           <div className="flex items-center gap-2">
              <button className="size-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all shadow-sm">
                 <ChevronLeft className="size-5" />
              </button>
              <div className="flex gap-1">
                 {[1, 2, 3].map(p => (
                    <button key={p} className={cn("size-10 rounded-xl text-[10px] font-black transition-all", p === 1 ? "bg-slate-900 text-white shadow-lg" : "border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-900")}>
                       {p}
                    </button>
                 ))}
              </div>
              <button className="size-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all shadow-sm">
                 <ChevronRight className="size-5" />
              </button>
           </div>
        </div>
      </main>
    </div>
  );
}
