"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  LayoutDashboard,
  ShoppingBag,
  History,
  User,
  Settings,
  Plus,
  Share2,
  ExternalLink,
  Ban,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { GradientButton } from "@/components/ui/gradient-button";
import { CreateDealModal } from "@/components/deal/CreateDealModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/context/WalletContext";
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
  {
    id: "4821",
    title: "Vintage Leather Bag",
    buyer: "GARM...99PQ",
    amount: "4,500 USDC",
    status: "Shipped",
    createdAgo: "1 day ago",
    expiresIn: "2 days 10 hours",
  }
];

const activityFeed = [
  { id: 1, text: "Deal #4821 completed — ₹3,200 received", time: "2h ago", icon: CheckCircle2, iconClass: "text-emerald-500" },
  { id: 2, text: "Deal #4820 payment locked — ₹1,800 secured", time: "5h ago", icon: Shield, iconClass: "text-blue-500" },
  { id: 3, text: "Deal #4819 dispute resolved — ₹2,400 released", time: "1d ago", icon: AlertTriangle, iconClass: "text-orange-500" },
];

const chartData = [
  { day: "Mon", earnings: 400 },
  { day: "Tue", earnings: 300 },
  { day: "Wed", earnings: 600 },
  { day: "Thu", earnings: 800 },
  { day: "Fri", earnings: 500 },
  { day: "Sat", earnings: 900 },
  { day: "Sun", earnings: 700 },
];

const statusStyles: Record<
  DealStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  "Waiting for Payment": {
    label: "Waiting for Payment",
    dotClass: "bg-amber-400",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
  },
  "Payment Locked": {
    label: "Payment Locked",
    dotClass: "bg-emerald-400 animate-pulse",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  Shipped: {
    label: "Shipped",
    dotClass: "bg-sky-400",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-700",
  },
  Completed: {
    label: "Completed",
    dotClass: "bg-slate-400",
    badgeClass: "border-slate-200 bg-slate-50 text-slate-700",
  },
  Disputed: {
    label: "Disputed",
    dotClass: "bg-orange-400",
    badgeClass: "border-orange-200 bg-orange-50 text-orange-700",
  },
  Refunded: {
    label: "Refunded",
    dotClass: "bg-red-400",
    badgeClass: "border-red-200 bg-red-50 text-red-700",
  },
};

export default function Dashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const { address } = useWallet();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 space-y-8">
        <div className="flex justify-between items-center mb-8">
           <Skeleton className="h-8 w-48" />
           <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-[400px] rounded-3xl" />
              <Skeleton className="h-[300px] rounded-3xl" />
           </div>
           <Skeleton className="h-[750px] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 lg:pb-0">
      <div className="flex min-h-screen relative">
        
        {/* SIDEBAR (Desktop) */}
        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white px-6 py-8 lg:flex sticky top-0 h-screen">
          <div className="flex items-center gap-3 px-2 mb-10">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-slate-900 shadow-xl text-white">
              <Shield className="size-6" />
            </span>
            <div>
              <p className="text-xl font-black text-slate-900 tracking-tight">SafeDeal</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Merchant Portal</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 text-sm font-bold">
            <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" active />
            <NavItem href="/dashboard/deals" icon={ShoppingBag} label="My Deals" />
            <NavItem href="/dashboard/history" icon={History} label="History" />
            <NavItem href="/merchant/me" icon={User} label="My Profile" />
            <NavItem href="/dashboard/settings" icon={Settings} label="Settings" />
          </nav>

          <div className="mt-auto space-y-4">
             <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                   <div className="size-2 rounded-full bg-orange-400 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-orange-700">Testnet Node Active</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black font-mono text-slate-500 bg-white/50 rounded-lg px-2.5 py-2 overflow-hidden border border-orange-100">
                   <Wallet className="size-3 shrink-0 text-orange-400" />
                   <span className="truncate">{address || "Not Connected"}</span>
                </div>
             </div>
             <GradientButton 
               variant="variant" 
               className="w-full rounded-xl py-3 text-xs font-black uppercase tracking-widest"
               onClick={() => {}}
             >
                Support Center
             </GradientButton>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-10 h-20 flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-black text-slate-900">Merchant Dashboard</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Overview for Maanas Jewelry</p>
            </div>
            <GradientButton
              className="rounded-xl px-6 py-3 text-sm font-bold"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="mr-2 size-4" />
              Create New Deal
            </GradientButton>
          </header>

          <main className="mx-auto max-w-7xl px-6 lg:px-10 py-10 space-y-10">
            
            {/* STATS OVERVIEW */}
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Active Deals", value: "3", sub: "Monitoring", color: "text-slate-900" },
                { label: "Pending Payment", value: "₹12,400", sub: "In Escrow", color: "text-emerald-600" },
                { label: "Completed This Month", value: "47", sub: "Deals finalized", color: "text-blue-600" },
                { label: "Total Earned", value: "₹1,24,000", sub: "Lifetime Vol.", color: "text-slate-900" },
              ].map((stat) => (
                <article key={stat.label} className="group relative overflow-hidden rounded-3xl border border-white bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <TrendingUp className="size-16" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                  <p className={cn("mt-4 text-3xl font-black", stat.color)}>{stat.value}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="size-1 rounded-full bg-slate-300" />
                    <p className="text-xs font-bold text-slate-500">{stat.sub}</p>
                  </div>
                </article>
              ))}
            </section>

            <div className="grid gap-10 lg:grid-cols-3 items-start">
              
              {/* LEFT COLUMN: Deals and Charts */}
              <div className="lg:col-span-2 space-y-10">
                
                {/* ACTIVE DEALS SECTION */}
                <article className="rounded-[2.5rem] bg-white border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Active Strategic Deals</h2>
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">Last 30 Days</span>
                  </div>
                  <div className="p-4 sm:p-8 space-y-6">
                     {activeDeals.map((deal) => {
                        const style = statusStyles[deal.status];
                        return (
                          <div key={deal.id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 transition-all hover:bg-white hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/20">
                             <div className="flex gap-4 sm:gap-6">
                                <div className="size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl ring-1 ring-slate-100">
                                   🛍️
                                </div>
                                <div className="space-y-1">
                                   <p className="text-sm font-black text-slate-900 tracking-tight">#{deal.id} {deal.title}</p>
                                   <p className="text-xs font-bold text-slate-500">Buyer: <span className="font-mono text-slate-400">{deal.buyer}</span></p>
                                   <div className="flex flex-wrap items-center gap-3 mt-3">
                                      <p className="text-sm font-black text-slate-900">{deal.amount}</p>
                                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm flex items-center gap-1.5", style.badgeClass)}>
                                         <div className={cn("size-1.5 rounded-full", style.dotClass)} />
                                         {deal.status}
                                      </span>
                                   </div>
                                </div>
                             </div>
                             
                             <div className="flex flex-col sm:items-end justify-between gap-4">
                               <div className="text-[10px] font-bold text-slate-400 space-y-1">
                                  <div className="flex items-center gap-1.5 justify-end"><Clock className="size-2.5" /> Created {deal.createdAgo}</div>
                                  <div className="flex items-center gap-1.5 justify-end text-amber-600"><AlertTriangle className="size-2.5" /> Expires {deal.expiresIn}</div>
                               </div>
                               <div className="flex items-center gap-2">
                                  <button onClick={() => {}} className="size-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
                                     <Share2 className="size-4" />
                                  </button>
                                  <button onClick={() => {}} className="size-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
                                     <ExternalLink className="size-4" />
                                  </button>
                                  <button onClick={() => {}} className="size-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-red-400 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
                                     <Ban className="size-4" />
                                  </button>
                               </div>
                             </div>
                          </div>
                        );
                     })}
                  </div>
                  <div className="px-8 py-5 border-t border-slate-50 bg-slate-50/30">
                     <button className="text-[10px] font-black uppercase tracking-widest text-[#0b50da] hover:underline">View All Active Deals (12)</button>
                  </div>
                </article>

                {/* EARNINGS CHART SECTION */}
                <article className="rounded-[2.5rem] bg-white border border-slate-100 shadow-sm p-8">
                   <div className="flex items-center justify-between mb-8">
                      <div>
                         <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Earnings Trends</h2>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Last 7 Days (USDC)</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                         <TrendingUp className="size-3.5" />
                         <span className="text-xs font-black">+14.2%</span>
                      </div>
                   </div>
                   <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                               dataKey="day" 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} 
                               dy={10}
                            />
                            <YAxis 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                               dx={-10}
                            />
                            <Tooltip 
                               cursor={{ fill: '#f8fafc' }}
                               contentStyle={{ 
                                  borderRadius: '16px', 
                                  border: 'none', 
                                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                  fontSize: '11px',
                                  fontWeight: '700'
                               }}
                            />
                            <Bar 
                               dataKey="earnings" 
                               radius={[6, 6, 0, 0]}
                               barSize={32}
                            >
                               {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index === 5 ? "#0f172a" : "#cbd5e1"} />
                               ))}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </article>
              </div>

              {/* RIGHT COLUMN: Activity Feed */}
              <div className="space-y-6">
                 <article className="rounded-[2.5rem] bg-[#0f172a] p-8 text-white shadow-2xl shadow-slate-900/20">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-xs font-black uppercase tracking-widest text-emerald-400">Recent Activity</h2>
                       <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">View All</button>
                    </div>
                    <div className="space-y-8">
                       {activityFeed.map((item) => (
                          <div key={item.id} className="flex gap-4 relative group">
                             <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-white/20 transition-colors">
                                <item.icon className={cn("size-5", item.iconClass)} />
                             </div>
                             <div className="space-y-1">
                                <p className="text-xs font-bold leading-relaxed">{item.text}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.time}</p>
                             </div>
                             <ArrowUpRight className="size-3 absolute top-0 right-0 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                          </div>
                        ))}
                    </div>
                    
                    <div className="mt-12 pt-8 border-t border-white/5 space-y-6">
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Target</p>
                          <p className="text-xs font-black">64%</p>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full w-[64%] bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                       </div>
                       <p className="text-[10px] font-bold text-slate-500 text-center leading-relaxed">
                          You are ₹4,200 away from your <br />
                          monthly goal. Keep it up!
                       </p>
                    </div>
                 </article>
                 
                 {/* QUICK ACTIONS CARD */}
                 <article className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                       {[
                         { icon: Share2, label: "Share Store" },
                         { icon: Wallet, label: "Withdraw" },
                         { icon: Shield, label: "Resolution" },
                         { icon: User, label: "Edit Profile" }
                       ].map((action) => (
                          <button key={action.label} className="flex flex-col items-center justify-center gap-2 p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/20 transition-all group">
                             <action.icon className="size-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900">{action.label}</span>
                          </button>
                       ))}
                    </div>
                 </article>
              </div>

            </div>
          </main>
        </div>
      </div>

      <CreateDealModal open={showCreate} onClose={() => setShowCreate(false)} />
      
      {/* MOBILE BOTTOM TABS */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 flex justify-around p-4 lg:hidden z-50">
         <MobileTab icon={LayoutDashboard} label="Home" active />
         <MobileTab icon={Plus} label="New" onClick={() => setShowCreate(true)} primary />
         <MobileTab icon={ShoppingBag} label="Deals" />
         <MobileTab icon={User} label="Me" />
      </nav>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active = false }: { href: string; icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <a 
      href={href} 
      className={cn(
        "flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 group",
        active 
          ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon className={cn("size-5", active ? "text-emerald-400" : "group-hover:scale-110 transition-transform")} />
      <span>{label}</span>
    </a>
  );
}

function MobileTab({ icon: Icon, label, active = false, onClick, primary = false }: { icon: React.ElementType; label: string; active?: boolean; onClick?: () => void; primary?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 transition-all",
        active ? "text-slate-900" : "text-slate-400"
      )}
    >
      <div className={cn(
        "p-2 rounded-xl transition-all",
        primary ? "bg-slate-900 text-white -mt-10 shadow-xl shadow-slate-900/40 size-14 flex items-center justify-center" : ""
      )}>
        <Icon className={cn(primary ? "size-6" : "size-5")} />
      </div>
      {!primary && <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>}
    </button>
  );
}
