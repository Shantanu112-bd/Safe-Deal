"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  CheckCircle2,
  Menu,
  Shield,
  ShieldCheck,
  Wallet,
  X,
  Lock,
  Send,
  Package,
  HandCoins,
  AlertTriangle,
  Zap,
  Star,
  Globe,
  Smartphone,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#how-it-works", label: "How it Works" },
  { href: "#for-merchants", label: "For Merchants" },
  { href: "#for-buyers", label: "For Buyers" },
  { href: "#pricing", label: "Pricing" },
];

const painPoints = [
  {
    title: "Fake Screenshots",
    description: "Scammers send fake payment proofs to trick sellers into shipping early.",
    icon: Shield,
  },
  {
    title: "Non-Delivery",
    description: "Buyers lose money when sellers disappear immediately after payment.",
    icon: Package,
  },
  {
    title: "No Protection",
    description: "Standard banks and UPI apps won't help you with social commerce scams.",
    icon: AlertTriangle,
  },
];

const trustFeatures = [
  {
    title: "AI Fraud Shield",
    description: "We scan every buyer and seller for flags and suspicious history.",
    icon: ShieldCheck,
  },
  {
    title: "Smart Escrow",
    description: "Funds are locked on the Stellar blockchain until the deal is done.",
    icon: Lock,
  },
  {
    title: "Seller Badges",
    description: "Know exactly who you're dealing with through verified reputation.",
    icon: BadgeCheck,
  },
  {
    title: "Auto Refund",
    description: "Your money is automatically returned if the seller fails to deliver.",
    icon: HandCoins,
  },
];

const steps = [
  {
    step: "01",
    title: "Step 1 — Seller creates deal",
    description: "Share a SafeDeal link with your buyer in seconds",
  },
  {
    step: "02",
    title: "Step 2 — Buyer locks payment",
    description: "Money goes into a secure vault — not to the seller yet",
  },
  {
    step: "03",
    title: "Step 3 — Deliver and get paid",
    description: "Ship confidently. Money releases when buyer confirms.",
  },
];

const stats = [
  { label: "Settlement", value: "5 sec", sub: "on Stellar" },
  { label: "Fraud Rate", value: "0%", sub: "for verified" },
  { label: "Fee Only", value: "1%", sub: "per deal" },
  { label: "Currency", value: "USDC", sub: "Global Trust" },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 italic-none">
      {/* ── Navbar ── */}
      <header 
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 py-3" : "bg-transparent py-6"
        )}
      >
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <a href="#" className="flex items-center gap-2 text-xl font-black text-[#0f172a] tracking-tight">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#0f172a] text-white shadow-lg shadow-navy-900/20">
              <Shield className="size-6" />
            </span>
            SafeDeal
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-slate-600 transition hover:text-[#0f172a]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
             <button className="text-sm font-bold text-slate-600 hover:text-slate-900">Sign In</button>
            <GradientButton 
              className="rounded-xl px-6 py-2.5 text-sm font-bold"
              onClick={() => router.push("/dashboard")}
            >
              Get Started
            </GradientButton>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2.5 text-slate-700 lg:hidden"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl lg:hidden"
            >
              <div className="px-6 py-8 space-y-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-lg font-bold text-slate-900"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="grid gap-3 pt-4">
                  <GradientButton className="w-full rounded-xl py-4 text-base font-black">
                     Connect Wallet
                  </GradientButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* ── HERO SECTION ── */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[#f8fafc]">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 blur-[120px] opacity-20 pointer-events-none">
             <div className="size-[500px] rounded-full bg-emerald-400" />
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-6">
                <Zap className="size-3 fill-current" /> Powered by Stellar Blockchain
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-[#0f172a] leading-[1.1] tracking-tight mb-8">
                Every Deal,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Guaranteed Safe</span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl mb-10 font-medium">
                The trusted middleman for WhatsApp and Instagram commerce. Buyers pay safely, sellers ship confidently. No more scams, just secure trade.
              </p>
              <div className="flex flex-wrap gap-4">
                <GradientButton 
                  className="rounded-2xl px-10 py-5 text-lg font-black"
                  onClick={() => router.push("/dashboard")}
                >
                  I&apos;m a Seller
                </GradientButton>
                <button 
                  onClick={() => router.push("#how-it-works")}
                  className="rounded-2xl border-2 border-slate-200 bg-white px-10 py-5 text-lg font-black transition-all hover:bg-slate-50 hover:border-slate-300"
                >
                  I&apos;m a Buyer
                </button>
              </div>
            </motion.div>

            {/* Hero visual: animated deal flow */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/5 lg:p-4 rotate-3"
            >
              <div className="rounded-2xl border border-slate-50 bg-slate-50 p-6 lg:p-8">
                <div className="flex items-center justify-between mb-8">
                   <div className="text-xs font-black uppercase tracking-widest text-slate-400">Live Transaction Flow</div>
                   <div className="size-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Buyer Initiates", icon: Wallet, active: false },
                    { label: "Payment Locked", icon: Lock, active: true },
                    { label: "SafeDeal Vault", icon: Shield, active: false },
                    { label: "Seller Ships Item", icon: Send, active: false },
                    { label: "Buyer Confirms", icon: CheckCircle2, active: false },
                    { label: "Payment Released", icon: HandCoins, active: false },
                  ].map((step, i) => (
                    <motion.div 
                      key={step.label}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border p-4 transition-all duration-500",
                        step.active ? "bg-white border-emerald-500 shadow-lg shadow-emerald-500/10" : "bg-white/40 border-slate-200/50 grayscale opacity-40"
                      )}
                    >
                      <div className={cn("flex size-10 items-center justify-center rounded-lg", step.active ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400")}>
                        <step.icon className="size-5" />
                      </div>
                      <div className="flex-1 text-sm font-black text-slate-900">{step.label}</div>
                      {step.active && <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Secured</div>}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PROBLEM SECTION ── */}
        <section className="bg-[#0f172a] py-24 lg:py-32 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <motion.div {...fadeIn} className="max-w-3xl">
              <h2 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight mb-8">
                Millions lose money to online scams every day
              </h2>
              <div className="grid gap-6 md:grid-cols-3 mt-16">
                {painPoints.map((point) => (
                  <article key={point.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-transform hover:-translate-y-2">
                    <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                       <point.icon className="size-6 text-[#f59e0b]" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{point.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{point.description}</p>
                  </article>
                ))}
              </div>
              <div className="mt-16 inline-flex items-center gap-4 py-4 px-8 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                 <div className="text-3xl font-black text-[#f59e0b]">₹2,400Cr</div>
                 <div className="text-sm font-bold text-slate-300">lost to online fraud in India (2023)</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="py-24 lg:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div {...fadeIn} className="text-center mb-20">
              <h2 className="text-3xl lg:text-5xl font-black text-[#0f172a] mb-6">How it Works</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">3 steps to complete security</p>
            </motion.div>
            
            <div className="grid gap-12 lg:grid-cols-3">
              {steps.map((step, idx) => (
                <motion.article 
                  key={step.title} 
                  {...fadeIn}
                  transition={{ delay: idx * 0.1 }}
                  className="relative p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:bg-white hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all"
                >
                  <div className="text-5xl font-black text-emerald-100 mb-6 group-hover:text-emerald-500/20 transition-colors">{step.step}</div>
                  <h3 className="text-xl font-black text-[#0f172a] mb-4">{step.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">{step.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST FEATURES ── */}
        <section id="for-buyers" className="py-24 lg:py-32 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div {...fadeIn} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl lg:text-5xl font-black text-[#0f172a] mb-6">Safety Built-in</h2>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  We leverage advanced AI and blockchain technology to ensure every transaction is as safe as a face-to-face deal.
                </p>
              </div>
              <div className="hidden lg:block">
                 <button className="text-sm font-black text-[#0f172a] underline decoration-emerald-500 decoration-2 underline-offset-8">Learn about our security</button>
              </div>
            </motion.div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trustFeatures.map((feature, idx) => (
                <motion.article 
                  key={idx}
                  {...fadeIn}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 transition-colors"
                >
                  <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                    <feature.icon className="size-6 text-[#10b981]" />
                  </div>
                  <h3 className="text-lg font-black text-[#0f172a] mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{feature.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOR MERCHANTS ── */}
        <section id="for-merchants" className="py-24 lg:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-3xl lg:text-5xl font-black text-[#0f172a] mb-8 leading-tight">
                Built for WhatsApp<br />& Instagram Sellers
              </h2>
              <div className="space-y-6 mb-10">
                {[
                  "Generate link in 30 seconds",
                  "Share on WhatsApp, Instagram, Telegram",
                  "Get paid in USDC or convert to INR via UPI",
                  "Build your verified seller reputation",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <span className="text-lg font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <GradientButton className="rounded-2xl px-8 py-4 text-base font-black">
                 Start Selling Safely
              </GradientButton>
            </motion.div>

            <motion.div 
               {...fadeIn}
               className="relative lg:-mr-32"
            >
              <div className="aspect-square bg-slate-900 rounded-[3rem] overflow-hidden p-12 lg:p-20 shadow-2xl shadow-navy-900/40 relative">
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,185,129,0.1),transparent)]" />
                 {/* WhatsApp Mockup */}
                 <div className="relative z-10 mx-auto max-w-xs rounded-[3rem] border-[10px] border-[#1e1e1e] bg-white p-6 shadow-2xl ring-4 ring-slate-800">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                       <div className="size-10 rounded-full bg-slate-200" />
                       <div>
                          <div className="text-xs font-black text-slate-900">Maanas Jewelry</div>
                          <div className="text-[10px] font-bold text-emerald-500">Online</div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="w-10/12 rounded-2xl bg-slate-100 p-3 text-[10px] leading-relaxed font-medium">
                          I&apos;m interested in the silver ring. Is it still available?
                       </div>
                       <div className="ml-auto w-10/12 rounded-2xl bg-emerald-500 p-3 text-[10px] leading-relaxed font-bold text-white shadow-lg shadow-emerald-500/20">
                          Yes! Here is the SafeDeal link to pay securely ✅
                          <div className="mt-2 rounded-lg bg-emerald-600/50 p-2 text-white/90 truncate font-mono">
                             safedeal.app/d/silver-ring...
                          </div>
                       </div>
                       <div className="w-10/12 rounded-2xl bg-white border border-slate-200 p-3 text-[10px] leading-relaxed font-black text-slate-900 italic-none">
                          <div className="flex items-center gap-2 text-emerald-600 mb-1">
                             <Shield className="size-3" /> SafeDeal Guard
                          </div>
                          Funds locked in escrow. Please ship the item!
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── REAL EXAMPLE ── */}
        <section className="bg-slate-50 py-24 lg:py-32">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <motion.div 
              {...fadeIn}
              className="bg-white rounded-[3rem] border border-slate-100 p-10 lg:p-20 shadow-2xl shadow-slate-900/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                 <MessageSquare className="size-48" />
              </div>
              <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                 <div className="size-32 lg:size-48 rounded-3xl bg-slate-100 overflow-hidden shrink-0 ring-8 ring-slate-50">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop" alt="Priya" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <div className="flex items-center gap-1 text-[#f59e0b] mb-4">
                       {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-current" />)}
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black text-[#0f172a] mb-6 leading-snug italic-none">
                      &quot;Last month a buyer sent a fake screenshot and I lost ₹4,000. With SafeDeal, that can never happen again.&quot;
                    </h2>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed mb-6">
                      Meet Priya. She sells handmade jewelry on WhatsApp. By using SafeDeal links, she ensures the money is locked on Stellar before she ever packs a box.
                    </p>
                    <div className="flex items-center gap-4">
                       <div className="font-black text-[#0f172a]">Priya S.</div>
                       <div className="h-1 w-1 rounded-full bg-slate-300" />
                       <div className="text-emerald-500 font-bold">Verified Seller</div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── TRUST BADGES ── */}
        <section className="py-24 lg:py-32 bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div {...fadeIn} className="text-center mb-20">
              <h2 className="text-3xl lg:text-5xl font-black text-[#0f172a] mb-4">Reputation Matters</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm italic-none">Every deal builds your legacy</p>
            </motion.div>
            
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {["New", "Rising", "Trusted", "Verified"].map((badge, idx) => (
                <motion.article 
                  key={badge} 
                  {...fadeIn}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-3xl border border-slate-100 bg-slate-50 p-8 text-center"
                >
                  <div className={cn(
                    "mx-auto inline-flex size-14 items-center justify-center rounded-2xl mb-6 shadow-sm",
                    idx === 3 ? "bg-emerald-600 text-white" : "bg-white text-slate-400"
                  )}>
                    <BadgeCheck className="size-7" />
                  </div>
                  <p className="text-lg font-black text-[#0f172a]">{badge}</p>
                  <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic-none">
                     {idx === 3 ? "Top Tier" : "Level Up"}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="bg-[#0f172a] py-20 text-white border-y border-white/5 relative">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => (
                <motion.div key={idx} {...fadeIn} className="text-center">
                  <div className="text-4xl lg:text-5xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">{stat.label}</div>
                  <div className="text-[10px] font-bold text-slate-500">{stat.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA SECTION ── */}
        <section className="py-24 lg:py-40 bg-white relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10 text-center">
            <motion.div {...fadeIn}>
              <h2 className="text-4xl lg:text-6xl font-black text-[#0f172a] mb-8 tracking-tight">
                Start protecting your deals today
              </h2>
              <p className="text-xl text-slate-600 font-medium mb-12">
                Free to join. We only charge 1% when you get paid successfully.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <GradientButton 
                  className="rounded-2xl px-12 py-6 text-xl font-black"
                  onClick={() => router.push("/dashboard")}
                >
                  Create Your First Deal
                </GradientButton>
              </div>
              <div className="mt-12 flex items-center justify-center gap-8 grayscale opacity-50">
                <div className="flex items-center gap-2 font-black text-slate-900 italic-none"><ShieldCheck className="size-5" /> Secured by Soroban</div>
                <div className="flex items-center gap-2 font-black text-slate-900 italic-none"><Globe className="size-5" /> Global Access</div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0f172a] text-white pt-24 pb-12 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-4 mb-20 italic-none">
            <div className="lg:col-span-1">
              <a href="#" className="flex items-center gap-2 text-2xl font-black tracking-tight mb-8">
                <Shield className="size-6 text-emerald-500 fill-current" /> SafeDeal
              </a>
              <p className="text-slate-400 font-medium leading-relaxed">
                The secure middleman for Indian social commerce. Scaling trust across WhatsApp and beyond.
              </p>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-[10px] mb-6 text-slate-500">Product</h4>
              <ul className="space-y-4">
                 <li><a href="#" className="text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors">How it Works</a></li>
                 <li><a href="#" className="text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors">For Merchants</a></li>
                 <li><a href="#" className="text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-[10px] mb-6 text-slate-500">Network</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-300">
                 <li>Stellar Blockchain</li>
                 <li>USDC Digital Dollar</li>
                 <li>Smart Contracts (v1.0.2)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-[10px] mb-6 text-slate-500">Legal</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-300">
                 <li>Terms of Service</li>
                 <li>Privacy Policy</li>
                 <li>Dispute Guidelines</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500 italic-none">
             <div>© 2026 SafeDeal Protocol. All rights reserved.</div>
             <div className="flex items-center gap-8">
                <span className="flex items-center gap-2"><Smartphone className="size-3" /> App available for iOS & Android</span>
                <span className="flex items-center gap-2 text-emerald-500"><div className="size-1.5 rounded-full bg-current" /> Stellar Mainnet Node: Active (v2.1.2)</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
