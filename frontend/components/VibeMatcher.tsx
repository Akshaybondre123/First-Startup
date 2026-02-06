"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Zap, Beer, Coffee, Users, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTIONS = [
    {
        id: "mood",
        title: "What's the energy like today?",
        options: [
            { id: "chill", label: "Chill & Relaxed", icon: Coffee, color: "text-blue-400", bg: "bg-blue-400/10" },
            { id: "vibrant", label: "High Energy", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
            { id: "romantic", label: "Romantic", icon: Heart, color: "text-rose-400", bg: "bg-rose-400/10" },
            { id: "party", label: "Party Vibe", icon: Beer, color: "text-purple-400", bg: "bg-purple-400/10" },
        ]
    },
    {
        id: "social",
        title: "Who's with you?",
        options: [
            { id: "solo", label: "Just Me", icon: Users, color: "text-zinc-400", bg: "bg-zinc-400/10" },
            { id: "date", label: "A Date", icon: Heart, color: "text-rose-400", bg: "bg-rose-400/10" },
            { id: "friends", label: "The Squad", icon: Users, color: "text-indigo-400", bg: "bg-indigo-400/10" },
            { id: "family", label: "Family", icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        ]
    }
];

export default function VibeMatcher() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isMatching, setIsMatching] = useState(false);

    const handleSelect = (questionId: string, optionId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            setIsMatching(true);
            // Simulate "AI Matching"
            setTimeout(() => {
                const vibeQuery = answers.mood || optionId;
                window.location.href = `/explore?vibe=${vibeQuery}`;
            }, 1500);
        }
    };

    const reset = () => {
        setStep(0);
        setAnswers({});
        setIsMatching(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-20">
            <div className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/20 to-transparent overflow-hidden">
                <div className="relative bg-[#0a0a0a]/90 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />

                    <div className="max-w-2xl mx-auto text-center mb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-4"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            AI Vibe Matcher
                        </motion.div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
                            Finding your <span className="text-gradient">match.</span>
                        </h2>
                        <p className="text-zinc-400 text-sm md:text-base">
                            Forget basic searching. Tell us your mood, and we'll find the perfect spot for your aesthetic.
                        </p>
                    </div>

                    <div className="relative min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {isMatching ? (
                                <motion.div
                                    key="matching"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center text-center"
                                >
                                    <div className="relative w-20 h-20 mb-6">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 rounded-full border-2 border-purple-500/20 border-t-purple-500"
                                        />
                                        <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-purple-400 animate-pulse" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Calculating Vibe Match...</h3>
                                    <p className="text-zinc-500 text-sm italic">Analyzing 100+ spots in Nagpur for you</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-lg md:text-xl font-bold text-center text-zinc-300">
                                        {QUESTIONS[step].title}
                                    </h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {QUESTIONS[step].options.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleSelect(QUESTIONS[step].id, option.id)}
                                                className={cn(
                                                    "group relative flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all duration-300",
                                                    answers[QUESTIONS[step].id] === option.id
                                                        ? "bg-white/5 border-white/20"
                                                        : "bg-[#111] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95",
                                                    option.bg
                                                )}>
                                                    <option.icon className={cn("h-6 w-6", option.color)} />
                                                </div>
                                                <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">
                                                    {option.label}
                                                </span>
                                                {answers[QUESTIONS[step].id] === option.id && (
                                                    <div className="absolute top-3 right-3">
                                                        <Check className="h-4 w-4 text-purple-400" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-center pt-6">
                                        <div className="flex gap-2">
                                            {QUESTIONS.map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "h-1.5 rounded-full transition-all duration-300",
                                                        i === step ? "w-8 bg-purple-500" : "w-1.5 bg-zinc-800"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
