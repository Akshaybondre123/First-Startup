"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import RestaurantForm from "@/components/RestaurantForm";
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Star, 
  Clock, 
  Shield, 
  CheckCircle2,
  Zap,
  Target,
  BarChart3,
  CalendarDays,
  MessageSquare,
  Award,
  Heart,
  Coffee,
  Music,
  Instagram,
  Twitter,
  Facebook,
  ArrowRight,
  Sunset,
  Users as UsersIcon,
  ChevronRight,
  Globe,
  Wifi,
  Music2,
  Cake,
  Briefcase,
  Moon,
  Sunrise,
  Palette,
  Volume2,
  Coffee as CoffeeIcon,
  Home,
  UtensilsCrossed,
  Camera,
  ChefHat,
  Wine,
  Crown,
  Gem,
  Rocket,
  Percent,
  Gift,
  ArrowUpRight,
  Play,
  Mic2,
  Flame,
  GlassWater,
  Search,
  Filter,
  ArrowUp,
  Quote,
  Building2,
  Phone,
  Eye,
  Utensils,
  Store
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function RegisterPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const registerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToRegister = () => {
    registerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVibes = () => {
    const vibesSection = document.getElementById('vibes');
    vibesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white font-sans overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      {/* Advanced Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,140,50,0.15),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[150px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-600/5 rounded-full blur-[200px]" />
        
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        
        {/* Moving Spotlight */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] bg-gradient-to-r from-orange-500/10 to-rose-500/10 pointer-events-none transition-transform duration-100 ease-out"
          style={{
            left: mousePosition.x - 250,
            top: mousePosition.y - 250,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 border-b border-white/[0.06] transition-all duration-300 ${scrolled ? 'bg-[#030303]/95 backdrop-blur-md py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img 
                src="/wampin.png" 
                alt="Wampin Logo" 
                className="h-14 w-auto object-contain mt-1 group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="flex flex-col -ml-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  Wampin
                </span>
                <span className="text-[10px] text-zinc-500 tracking-widest uppercase">For Restaurants</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <button onClick={scrollToVibes} className="hover:text-white transition-colors">How It Works</button>
              <button onClick={scrollToVibes} className="hover:text-white transition-colors">Customer Matching</button>
              <button onClick={() => document.getElementById('benefits')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-white transition-colors">ROI</button>
              <button onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-white transition-colors">Pricing</button>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/explore">
                <Button
                  variant="ghost"
                  className="rounded-lg text-sm h-10 px-4 text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300 hidden sm:flex"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Customer View
                </Button>
              </Link>
              <Button 
                onClick={scrollToRegister}
                className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm h-10 px-6 font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
              >
                List Your Venue Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* IMPROVED HERO - Visual Gallery instead of Dashboard */}
      <section ref={heroRef} className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80')] bg-cover bg-center bg-no-repeat opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#030303]/80 to-[#030303]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-transparent to-[#030303]/80" />
        </div>

        {/* Floating Ambient Particles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-500/40 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-sm hover:border-orange-500/30 transition-colors cursor-pointer group">
                <div className="flex -space-x-2">
                  {[1,2,3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">{i}</span>
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium text-zinc-300 tracking-wide">
                  Built for restaurant & café owners
                </span>
                <div className="h-4 w-[1px] bg-zinc-700 mx-1" />
                <Star className="h-3 w-3 text-orange-400 fill-orange-400" />
                <span className="text-sm font-semibold text-white">4.9/5</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-[0.95]">
                <span className="block text-white mb-2">
                  Register your
                </span>
                <span className="block relative">
                  <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                    restaurant or café
                  </span>
                </span>
                <span className="block text-white mt-2">
                  on Wampin in minutes
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-zinc-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed font-light">
                Create a free business profile, add your photos and vibe, and let Wampin bring you diners{" "}
                <span className="text-white font-medium">who are already searching</span> for places like yours.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <Button 
                  onClick={scrollToRegister}
                  className="group relative rounded-full bg-white text-black hover:bg-zinc-100 text-lg h-14 px-10 font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                >
                  Start Free Listing
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  onClick={scrollToVibes}
                  variant="outline" 
                  className="rounded-full border-white/20 hover:border-white/40 text-lg h-14 px-10 font-medium hover:bg-white/5 backdrop-blur-sm transition-all duration-300 text-white w-full sm:w-auto"
                >
                  Explore Categories
                </Button>
              </div>

              {/* Social Proof Logos */}
              <div className="flex flex-col items-center lg:items-start gap-4">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Trusted by leading venues</p>
                <div className="flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                  {['The Ritz', 'Nobu', 'Eleven Madison', 'Osteria'].map((brand) => (
                    <span key={brand} className="text-sm font-bold text-zinc-400">{brand}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* NEW: Visual Collage instead of Dashboard */}
            <div className="hidden lg:block relative h-[600px]">
              {/* Main Image */}
              <div className="absolute top-0 right-0 w-[70%] h-[60%] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Restaurant interior" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-10 left-4 right-4">
                  <Badge className="bg-orange-500/90 text-white border-0 mb-2">Featured Venue</Badge>
                  <h3 className="text-xl font-bold text-white">The Golden Spoon</h3>
                  <p className="text-sm text-zinc-300">Fine Dining • Italian</p>
                </div>
              </div>

              {/* Secondary Image */}
              <div className="absolute bottom-[2%] left-0 w-[50%] h-[45%] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 z-10">
                <img 
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Cafe atmosphere" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-semibold text-white">Work Friendly</span>
                  </div>
                </div>
              </div>


              {/* Tertiary Small Image */}
              {/* <div className="absolute top-[-5%] left-[5%] w-[30%] h-[25%] rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl z-0 opacity-80">
                <img 
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Food plating" 
                  className="w-full h-full object-cover"
                />
              </div> */}
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030303] to-transparent" />
      </section>

      {/* IMPROVED SECTION: How Vibe Matching Works */}
      <section id="vibes" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20">
              The Wampin Difference
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              We Match Diners to Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
                Exact Atmosphere
              </span>
            </h2>
            <p className="text-lg text-zinc-400 font-light">
              Unlike generic reservation platforms, we categorize by experience intent. 
              When a diner searches "Romantic Date Night," your venue appears because of your ambiance, not just cuisine.
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                step: "01",
                title: "Create your profile",
                desc: "Add your basic details, location, opening hours and contact information so diners can find you easily.",
                icon: Target,
                color: "from-blue-500 to-indigo-500"
              },
              {
                step: "02",
                title: "Describe your vibe",
                desc: "Tell us about your lighting, music, seating and energy so Wampin understands what kind of experience you offer.",
                icon: Zap,
                color: "from-orange-500 to-rose-500"
              },
              {
                step: "03",
                title: "Get discovered",
                desc: "Your restaurant or café appears in searches when diners look for the exact vibe you provide.",
                icon: CheckCircle2,
                color: "from-green-500 to-emerald-500"
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-3xl border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500" />
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-5xl font-black text-zinc-800 group-hover:text-zinc-700 transition-colors">{item.step}</span>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-200 transition-colors">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Improved Image Grid Layout */}
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Popular Customer Searches</h3>
            <p className="text-sm text-zinc-500 hidden sm:block">Your venue appears in relevant intent-based searches</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
            {/* Large Featured Card - Spans 8 columns */}
            <div className="group relative md:col-span-8 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-orange-500/30 transition-all duration-500">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Romantic restaurant" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                    <Search className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm font-medium text-white">12,400 monthly searches</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Heart className="h-6 w-6 text-rose-400" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold mb-2 group-hover:text-rose-200 transition-colors">Romantic Date Night</h3>
                  <p className="text-zinc-300 mb-4 max-w-md">Diners seeking intimate lighting, wine selection, and quiet ambiance for special occasions.</p>
                  <div className="flex flex-wrap gap-2">
                    {["Intimate lighting", "Wine bar", "Quiet ambiance", "Date night menu"].map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm text-white border border-white/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card - Spans 4 columns */}
            <div className="group relative md:col-span-4 rounded-3xl overflow-hidden bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all duration-300 p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">Match Performance</h4>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-400">Relevant Matches</span>
                      <span className="text-white font-semibold">94%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full w-[94%] bg-orange-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-400">Booking Conversion</span>
                      <span className="text-white font-semibold">68%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full w-[68%] bg-rose-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-400">Customer Satisfaction</span>
                      <span className="text-white font-semibold">4.8/5</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full w-[96%] bg-green-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  "Since joining Wampin, our tables are filled with guests who specifically appreciate our concept."
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-700" />
                  <span className="text-xs text-zinc-400">— Marco R., Owner</span>
                </div>
              </div>
            </div>

            {/* Business Card - Spans 4 columns */}
            <div className="group relative md:col-span-4 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-blue-500/30 transition-all duration-500">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Business cafe" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-5 w-5 text-blue-400" />
                  <span className="text-xs text-zinc-300 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">8,200 searches</span>
                </div>
                <h3 className="text-xl font-bold group-hover:text-blue-200 transition-colors">Business & Work</h3>
                <p className="text-sm text-zinc-400 mt-1">WiFi, outlets, coffee</p>
              </div>
            </div>

            {/* Celebration Card - Spans 4 columns */}
            <div className="group relative md:col-span-4 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-purple-500/30 transition-all duration-500">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Celebration venue" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <Music2 className="h-5 w-5 text-purple-400" />
                  <span className="text-xs text-zinc-300 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">15,600 searches</span>
                </div>
                <h3 className="text-xl font-bold group-hover:text-purple-200 transition-colors">Celebration</h3>
                <p className="text-sm text-zinc-400 mt-1">Groups, events, parties</p>
              </div>
            </div>

            {/* Views Card - Spans 4 columns */}
            <div className="group relative md:col-span-4 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-orange-500/30 transition-all duration-500">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Rooftop views" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <Sunset className="h-5 w-5 text-orange-400" />
                  <span className="text-xs text-zinc-300 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">9,800 searches</span>
                </div>
                <h3 className="text-xl font-bold group-hover:text-orange-200 transition-colors">Views & Scenery</h3>
                <p className="text-sm text-zinc-400 mt-1">Rooftop, outdoor, scenic</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-32 relative z-10 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-orange-400 text-sm font-medium tracking-widest uppercase mb-4 block">
                For restaurant & café partners
              </span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
                Make your place
                <span className="block text-zinc-500">easy to discover</span>
              </h2>
              
              <div className="space-y-8">
                {[ 
                  {
                    icon: Target,
                    title: "Right guests, not just more guests",
                    text: "Appear in front of people who are looking for your kind of place (date night, group hangout, work-friendly) instead of random traffic."
                  },
                  {
                    icon: BarChart3,
                    title: "See what works",
                    text: "Understand which vibes and photos attract the most views so you can improve your listing over time."
                  },
                  {
                    icon: Shield,
                    title: "Professional presence",
                    text: "Give your restaurant or café a clean, trustworthy profile instead of just relying on word of mouth or social posts."
                  }
                ].map((benefit, index) => (
                  <div key={index} className="group flex gap-6 p-4 -mx-4 rounded-2xl hover:bg-white/[0.02] transition-colors cursor-default">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-orange-500/30 group-hover:bg-orange-500/5 transition-all duration-300">
                      <benefit.icon className="h-5 w-5 text-zinc-400 group-hover:text-orange-400 transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2 text-white group-hover:text-orange-200 transition-colors">{benefit.title}</h4>
                      <p className="text-zinc-400 leading-relaxed text-sm">{benefit.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Abstract Visual */}
            <div className="relative h-[600px] hidden lg:block">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Orbital Rings */}
                  <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
                  <div className="absolute inset-8 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                  <div className="absolute inset-16 border border-white/5 rounded-full animate-[spin_30s_linear_infinite]" />
                  
                  {/* Central Hub */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-orange-500 to-rose-600 rounded-full blur-2xl opacity-20 animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-zinc-900 rounded-full border border-orange-500/30 flex items-center justify-center z-10">
                    <Sparkles className="h-6 w-6 text-orange-400" />
                  </div>


                  <div className="absolute top-1/3 left-10 bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-3 shadow-2xl animate-float delay-500">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="text-sm font-semibold text-white">New Visitors</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Simple pricing
            </h2>
            <p className="text-zinc-400 text-lg mb-6">Start free. Scale when you're ready.</p>
            
            {/* Free Offer Banner */}
            <div className="max-w-2xl mx-auto mb-8 p-6 rounded-2xl bg-gradient-to-r from-orange-500/20 to-rose-500/20 border border-orange-500/30">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Gift className="h-5 w-5 text-orange-400" />
                <span className="text-lg font-semibold text-white">Special Launch Offer</span>
              </div>
              <p className="text-zinc-300 text-sm">
                Currently we are giving <span className="font-bold text-orange-400">first two months FREE</span> for all plans with all facilities included!
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
              <div className="absolute -top-3 right-6">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-1 font-bold text-xs shadow-lg shadow-green-500/30">
                  FREE TRIAL
                </Badge>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="h-5 w-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Starter</h3>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-black text-white">Free</span>
                  </div>
                  <p className="text-sm font-medium text-green-400">for first 2 months</p>
                </div>
              </div>
              
              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Create your restaurant or café profile and try <span className="font-semibold text-white">all features free</span> for the first two months.
                </p>
              </div>
              
              <Button 
                onClick={scrollToRegister}
                className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold h-12 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Pro - Highlighted */}
            <div className="group relative p-8 rounded-3xl bg-zinc-900/50 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 md:-mt-4 md:mb-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-orange-500 text-black border-0 px-4 py-1 font-semibold">
                  Most Popular
                </Badge>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-2">Professional</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">₹999</span>
                  <span className="text-zinc-500">/mo</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {["Priority placement", "20 photos + videos", "Verified badge", "Advanced analytics", "Direct messaging", "Menu management"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-orange-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={scrollToRegister}
                className="w-full rounded-xl bg-white text-black hover:bg-zinc-100 font-semibold"
              >
                Get Started
              </Button>
            </div>

            {/* Enterprise */}
            <div className="group relative p-8 rounded-3xl bg-zinc-950 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-2">Enterprise</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">Custom</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {["Multiple locations", "API access", "Dedicated manager", "Custom branding", "Priority support"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-400">
                    <CheckCircle2 className="h-4 w-4 text-zinc-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" className="w-full rounded-xl border-white/10 hover:bg-white/5 text-white">
                Contact Sales
              </Button>
            </div>
          </div>
          
          {/* Registration Note */}
          <div className="mt-12 text-center">
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Please fill the form below and your restaurant or cafe will <span className="font-semibold text-white">automatically register</span> on our website.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section ref={registerRef} id="register" className="py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
            <div className="relative bg-zinc-950 rounded-[22px] p-8 md:p-12 border border-white/10">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the platform</h2>
                <p className="text-zinc-400">Create your venue profile in under 5 minutes</p>
              </div>
              
              <div className="max-w-xl mx-auto">
                <RestaurantForm />
              </div>
              
              <div className="mt-8 text-center text-xs text-zinc-500">
                By registering, you agree to our <Link href="#" className="text-zinc-300 hover:text-white underline">Terms</Link> and <Link href="#" className="text-zinc-300 hover:text-white underline">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 sm:py-14 md:py-20 lg:py-24 border-t border-white/5 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12 md:mb-16">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="font-bold text-xl sm:text-2xl tracking-tighter flex items-center gap-2 mb-4 sm:mb-6">
                <img 
                  src="/wampin.png" 
                  alt="Wampin Logo" 
                  className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-25 lg:w-25 object-contain" 
                />
                <span className="text-gradient">Wampin</span>
              </Link>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                The ultimate guide to exploring the best food and vibes around you.
              </p>
              <div className="flex gap-3 sm:gap-4">
                <a 
                  href="https://www.instagram.com/_wampin_?igsh=ZDJmMTc4Y2xjeHpy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                >
                  <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 hover:text-white text-zinc-400 h-8 w-8 sm:h-9 sm:w-9">
                    <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </a>
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 hover:text-white text-zinc-400 h-8 w-8 sm:h-9 sm:w-9">
                  <Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 hover:text-white text-zinc-400 h-8 w-8 sm:h-9 sm:w-9">
                  <Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base">Discover</h4>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4 text-xs sm:text-sm text-zinc-500">
                <li><Link href="/explore" className="hover:text-purple-400 transition-colors">Trending Spots</Link></li>
                <li><Link href="/explore?vibe=couple" className="hover:text-purple-400 transition-colors">Date Night</Link></li>
                <li><Link href="/explore?vibe=party" className="hover:text-purple-400 transition-colors">Party Places</Link></li>
                <li><Link href="/explore?vibe=aesthetic" className="hover:text-purple-400 transition-colors">Aesthetic Cafes</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4 text-xs sm:text-sm text-zinc-500">
                <li><Link href="#" className="hover:text-purple-400 transition-colors">About Us</Link></li>
                <li><Link href="/register" className="hover:text-purple-400 transition-colors">Partner with Us</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="font-bold text-white mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base">Stay Updated</h4>
              <p className="text-zinc-500 text-xs sm:text-sm mb-3 sm:mb-4">Get the latest vibe checks directly to your inbox.</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Email address" 
                  className="bg-white/5 border-white/10 focus-visible:ring-purple-500 text-white text-xs sm:text-sm h-9 sm:h-10" 
                />
                <Button size="icon" className="bg-white text-black hover:bg-zinc-200 shrink-0 h-9 w-9 sm:h-10 sm:w-10">
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs text-zinc-600">
            <p className="text-center sm:text-left">© 2025 Wampin Inc. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for food lovers
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 4s ease infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}