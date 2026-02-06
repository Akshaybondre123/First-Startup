"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, MousePointer2, PieChart, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BusinessIntelligence() {
    const stats = [
        { label: "Profile Views", value: "12.4K", change: "+14%", icon: Users, color: "text-blue-400" },
        { label: "CTA Clicks", value: "842", change: "+28%", icon: MousePointer2, color: "text-purple-400" },
        { label: "Vibe Score", value: "98%", change: "Elite", icon: Sparkles, color: "text-yellow-400" },
        { label: "Revenue Est.", value: "₹45K", change: "+10%", icon: TrendingUp, color: "text-emerald-400" },
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-[#050505]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                            <BarChart3 className="h-4 w-4" />
                            For Business Owners
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
                            Data-Driven <br /> <span className="text-gradient">Growth.</span>
                        </h2>
                        <p className="text-zinc-400 text-lg mb-8 max-w-lg leading-relaxed">
                            Wampin provides deep insights into how users discover your brand. Track your "Vibe Ranking," profile engagement, and conversion metrics in real-time.
                        </p>

                        <div className="space-y-4">
                            {[
                                "Heatmaps of user discovery",
                                "Competitor vibe analysis",
                                "Direct lead generation tracking",
                                "Premium AI-driven content suggestions"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                    <span className="text-zinc-300 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Mock Dashboard UI */}
                        <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent shadow-2xl">
                            <div className="bg-[#0a0a0a] rounded-[2.5rem] p-6 md:p-10 border border-white/5">
                                <div className="flex justify-between items-center mb-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                            <BarChart3 className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-sm">Owner Dashboard</h3>
                                            <p className="text-zinc-500 text-[10px]">Updated 2m ago</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" />
                                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {stats.map((stat, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-[#111] border border-white/5 group hover:border-purple-500/30 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <stat.icon className={cn("h-4 w-4", stat.color)} />
                                                <span className="text-[10px] font-bold text-emerald-400">{stat.change}</span>
                                            </div>
                                            <div className="text-xl font-black text-white">{stat.value}</div>
                                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Simulated Chart */}
                                <div className="h-40 w-full bg-[#111] rounded-2xl border border-white/5 p-4 flex items-end gap-2 overflow-hidden">
                                    {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.05, duration: 1 }}
                                            className="flex-1 bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-sm opacity-80"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Floating Decorative Card */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 md:-right-12 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hidden md:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-zinc-400 font-bold uppercase">Trending Spot</div>
                                    <div className="text-sm font-black text-white">+340% Traffic</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
