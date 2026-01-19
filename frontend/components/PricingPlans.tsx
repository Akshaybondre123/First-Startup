"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Gift, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PricingPlans() {
  const plans = [
    {
      id: "3months",
      name: "3 Months",
      price: "₹2,999",
      originalPrice: "₹4,500",
      savings: "33% OFF",
      duration: "3 months",
      popular: false,
    },
    {
      id: "6months",
      name: "6 Months",
      price: "₹4,999",
      originalPrice: "₹9,000",
      savings: "44% OFF",
      duration: "6 months",
      popular: true,
    },
    {
      id: "1year",
      name: "1 Year",
      price: "₹8,999",
      originalPrice: "₹18,000",
      savings: "50% OFF",
      duration: "12 months",
      popular: false,
    },
  ];

  const features = [
    "Premium listing placement",
    "Verified badge",
    "Analytics dashboard",
    "Priority customer support",
    "Photo gallery (up to 20 photos)",
    "Menu management",
    "Review response tools",
    "Social media integration",
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-[#050505] to-[#111]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Gift className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-bold text-purple-400 uppercase tracking-wider">
              Special Launch Offer
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Simple, <span className="text-gradient">Transparent</span> Pricing
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Start with 2 months FREE, then choose a plan that works for you. First 5 restaurants get 3 months FREE!
          </p>
        </motion.div>

        {/* Free Trial Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 rounded-2xl bg-purple-500/20 border border-purple-500/30">
                  <Sparkles className="h-8 w-8 text-purple-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-black text-white mb-2">
                    🎉 First 2 Months FREE for Everyone!
                  </h3>
                  <p className="text-zinc-300 mb-4">
                    Start your journey with us completely free. No credit card required. Experience all premium features for 2 months.
                  </p>
                  <div className="flex items-center gap-4 justify-center md:justify-start">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-1.5">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      First 5 Restaurants: 3 Months FREE
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-purple-600 text-white border-none px-4 py-1.5 font-bold">
                    Most Popular
                  </Badge>
                </div>
              )}
              <Card className={cn(
                "h-full border-2 transition-all hover:scale-105",
                plan.popular
                  ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/50 shadow-2xl shadow-purple-500/20"
                  : "bg-[#111] border-white/10 hover:border-white/20"
              )}>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-4xl font-black text-white">{plan.price}</span>
                      <span className="text-zinc-500 line-through text-lg">{plan.originalPrice}</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {plan.savings}
                    </Badge>
                    <p className="text-zinc-400 text-sm mt-2">After 2 months free trial</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-green-500/20 border border-green-500/30">
                          <Check className="h-4 w-4 text-green-400" />
                        </div>
                        <span className="text-sm text-zinc-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={cn(
                      "w-full h-12 rounded-xl font-bold text-lg",
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                        : "bg-white text-black hover:bg-zinc-200"
                    )}
                  >
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-8">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                What's Included in All Plans
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Free Setup & Onboarding</h4>
                    <p className="text-sm text-zinc-400">We help you set up your listing completely free</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-1">No Hidden Charges</h4>
                    <p className="text-sm text-zinc-400">Transparent pricing, no surprise fees</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Cancel Anytime</h4>
                    <p className="text-sm text-zinc-400">No long-term contracts, cancel when you want</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-1">24/7 Support</h4>
                    <p className="text-sm text-zinc-400">Round-the-clock assistance for all your needs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Early Bird Offer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-500/10 border border-yellow-500/30">
            <Gift className="h-5 w-5 text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400">
              🎁 Early Bird Special: First 5 restaurants get <span className="text-white">3 MONTHS FREE</span> instead of 2!
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

