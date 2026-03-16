"use client";

import { useState } from "react";
import { 
  User, 
  Wallet, 
  Globe, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Save,
  CheckCircle2
} from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Profile updated successfully!");
    }, 1500);
  };

  return (
    <div className="flex-1 min-w-0 bg-slate-50 pb-20 font-sans">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-10 h-20 flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900">Merchant Settings</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Manage your public presence and payouts</p>
        </div>
        <GradientButton 
          className="rounded-xl px-6 py-3 text-sm font-bold flex items-center gap-2"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Save Changes
        </GradientButton>
      </header>

      <main className="mx-auto max-w-4xl px-6 lg:px-10 py-10">
        <Tabs defaultValue="public-profile" className="space-y-8">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-2xl h-14">
            <TabsTrigger 
              value="public-profile" 
              className="rounded-xl px-8 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Public Profile
            </TabsTrigger>
            <TabsTrigger 
              value="payouts" 
              className="rounded-xl px-8 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Payout Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="public-profile" className="space-y-6">
            <Card className="rounded-[2.5rem] border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Globe className="size-5 text-[#0b50da]" />
                  Brand Identity
                </CardTitle>
                <CardDescription className="text-slate-500 font-bold">This information will be visible to all buyers on your public profile.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center gap-8">
                  <div className="size-24 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white text-3xl font-black shadow-xl relative group">
                    PJ
                    <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-xs font-black uppercase tracking-widest">Edit</div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Name</Label>
                      <Input defaultValue="Priya's Jewelry" className="rounded-xl" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</Label>
                      <Input defaultValue="Jewelry & Handcrafted" className="rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 size-4 text-slate-400" />
                      <Input defaultValue="Mumbai, India" className="rounded-xl pl-10" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Member Since</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 size-4 text-slate-400" />
                      <Input defaultValue="Jan 2023" disabled className="rounded-xl pl-10 bg-slate-50" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Biography</Label>
                  <Textarea 
                    defaultValue="Artisan jeweler specializing in 925 silver and sustainable gemstones. Every piece is handcrafted with love and secured by SafeDeal's smart escrow system."
                    className="rounded-2xl min-h-[120px]"
                  />
                  <p className="text-[10px] font-bold text-slate-400">Keep it short and impactful for mobile buyers. (Max 200 chars)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-slate-200 shadow-sm overflow-hidden bg-emerald-50/30">
              <CardContent className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Verified Seller Status</h3>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Level 2 Trust Badge Active</p>
                  </div>
                </div>
                <GradientButton variant="variant" className="rounded-xl text-xs font-black uppercase tracking-widest bg-white border border-emerald-200 text-emerald-700 min-w-fit shadow-none hover:bg-emerald-50">
                  Upgrade Badge
                </GradientButton>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-6">
            <Card className="rounded-[2.5rem] border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Wallet className="size-5 text-emerald-500" />
                  Stellar Payout Rails
                </CardTitle>
                <CardDescription className="text-slate-500 font-bold">Configure how you receive your finalized deal funds.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preferred Currency</Label>
                    <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all">
                      <option>USDC (Stablecoin)</option>
                      <option>XLM (Stellar Lumen)</option>
                      <option>INR (Fiat via SEP-24)</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Auto-Withdrawal</Label>
                    <div className="flex items-center justify-between h-full px-4 rounded-xl border border-slate-200 bg-slate-50/50">
                      <span className="text-sm font-bold text-slate-600">Withdrawal on completion</span>
                      <div className="size-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="size-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-[1.5rem] bg-slate-900 text-white space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Bank Account for INR Payouts</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-1">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Account Holder</Label>
                      <p className="text-sm font-bold">Priya Sharma</p>
                    </div>
                    <div className="grid gap-1 text-right">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Bank Name</Label>
                      <p className="text-sm font-bold">HDFC Bank Ltd.</p>
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">IFSC Code</Label>
                      <p className="text-sm font-mono font-bold tracking-widest">HDFC0001243</p>
                    </div>
                    <div className="grid gap-1 text-right">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Account Number</Label>
                      <p className="text-sm font-mono font-bold tracking-widest">**** **** 9012</p>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-3 rounded-xl bg-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                    Reset Banking Method
                  </button>
                </div>

                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 italic-none">
                  <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest mb-1">Stellar Testnet Notice</h4>
                  <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase">Real bank transfers are disabled in the Testnet Sandbox. Use the "Withdraw to Stellar Wallet" option for full chain lifecycle testing.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
