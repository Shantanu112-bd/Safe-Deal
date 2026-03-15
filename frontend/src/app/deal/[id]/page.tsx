"use client";

import { useState } from "react";
import { Shield, Lock, Package, CheckCircle2, AlertTriangle } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";

type DealStep = "pay" | "confirm" | "dispute" | "done";

export default function DealPaymentPage() {
  const [step, setStep] = useState<DealStep>("pay");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-xl items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2 font-semibold text-[#0f172a]">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[#0f172a] text-white">
              <Shield className="size-4" />
            </span>
            SafeDeal
          </a>
          <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Lock className="size-3" /> Secured by Stellar
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-10">
        {/* Deal card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Deal Details</p>
          <h1 className="mt-2 text-xl font-bold text-[#0f172a]">Handmade Silver Necklace</h1>
          <p className="mt-1 text-slate-500 text-sm">Seller: Priya D. · Deal #deal_001</p>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
            <span className="text-slate-600 text-sm">Amount</span>
            <span className="text-2xl font-bold text-[#0f172a]">₹4,500</span>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-slate-600">
            {[
              "Money held in escrow until you confirm delivery",
              "Full refund if seller doesn't ship within 3 days",
              "Dispute resolution within 24 hours",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#10b981]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Step: Pay ── */}
        {step === "pay" && (
          <div className="mt-6 space-y-3">
            <GradientButton
              className="w-full rounded-full text-lg py-5"
              onClick={() => setStep("confirm")}
            >
              <Lock className="mr-2 size-5 inline" />
              Pay &amp; Lock in Escrow
            </GradientButton>
          </div>
        )}

        {/* ── Step: Confirm delivery ── */}
        {step === "confirm" && (
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-700">
              <Package className="mr-2 size-4 inline" />
              ₹4,500 is locked in escrow. The seller has been notified to ship.
            </div>
            <p className="text-center text-sm text-slate-500">Did you receive the item?</p>
            <GradientButton
              className="w-full rounded-full text-lg py-5"
              onClick={() => setStep("done")}
            >
              <CheckCircle2 className="mr-2 size-5 inline" />
              Yes, I received it — Release Payment
            </GradientButton>
            <GradientButton
              variant="variant"
              className="w-full rounded-full text-lg py-5"
              onClick={() => setStep("dispute")}
            >
              <AlertTriangle className="mr-2 size-5 inline" />
              No, I have a problem — Open Dispute
            </GradientButton>
          </div>
        )}

        {/* ── Step: Dispute ── */}
        {step === "dispute" && (
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-6 text-center">
            <AlertTriangle className="mx-auto size-8 text-amber-500" />
            <h2 className="mt-3 font-bold text-[#0f172a]">Dispute Opened</h2>
            <p className="mt-2 text-sm text-slate-600">
              Our team will review your case and respond within 24 hours. Your funds remain locked and safe.
            </p>
          </div>
        )}

        {/* ── Step: Done ── */}
        {step === "done" && (
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
            <CheckCircle2 className="mx-auto size-8 text-emerald-500" />
            <h2 className="mt-3 font-bold text-[#0f172a]">Payment Released!</h2>
            <p className="mt-2 text-sm text-slate-600">
              ₹4,500 has been released to the seller. Thank you for using SafeDeal.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
