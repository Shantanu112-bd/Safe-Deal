"use client";

import { useState } from "react";
import { Shield, Plus, Copy, ExternalLink, Wallet } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";

const mockDeals = [
  {
    id: "deal_001",
    title: "Handmade Silver Necklace",
    amount: "₹4,500",
    status: "Awaiting Payment",
    buyer: "Rahul M.",
    created: "Mar 14, 2026",
  },
  {
    id: "deal_002",
    title: "Vintage Camera - Canon AE1",
    amount: "₹12,000",
    status: "In Escrow",
    buyer: "Sneha K.",
    created: "Mar 13, 2026",
  },
  {
    id: "deal_003",
    title: "Custom Embroidered Kurti",
    amount: "₹2,200",
    status: "Completed",
    buyer: "Priya D.",
    created: "Mar 10, 2026",
  },
];

const statusColor: Record<string, string> = {
  "Awaiting Payment": "bg-amber-50 text-amber-700 border-amber-200",
  "In Escrow":        "bg-blue-50 text-blue-700 border-blue-200",
  "Completed":        "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function Dashboard() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`https://safedeal.app/deal/${id}`);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2 font-semibold text-[#0f172a]">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[#0f172a] text-white">
              <Shield className="size-4" />
            </span>
            SafeDeal
          </a>
          <GradientButton className="min-w-0 px-4 py-2 text-sm rounded-lg">
            <Wallet className="mr-1 size-4 inline" />
            Fund
          </GradientButton>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page title + Create button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">Merchant Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Manage your active deals</p>
          </div>
          <GradientButton>
            <Plus className="mr-1 size-4 inline" />
            + Create New Deal
          </GradientButton>
        </div>

        {/* Wallet card */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">USDC Balance</p>
          <p className="mt-1 text-3xl font-bold text-[#0f172a]">$248.50</p>
          <p className="mt-1 text-sm text-emerald-600">≈ ₹20,700 at current rate</p>
        </div>

        {/* Deals list */}
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-[#0f172a]">Your Deals</h2>
          {mockDeals.map((deal) => (
            <article
              key={deal.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0f172a] truncate">{deal.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {deal.amount} · Buyer: {deal.buyer} · {deal.created}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[deal.status]}`}
                  >
                    {deal.status}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <GradientButton
                    variant="variant"
                    className="min-w-0 px-4 py-2 text-sm rounded-lg"
                    onClick={() => copyLink(deal.id)}
                  >
                    <Copy className="mr-1 size-3.5 inline" />
                    {copied === deal.id ? "Copied!" : "Share Link"}
                  </GradientButton>
                  <a
                    href={`/deal/${deal.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
