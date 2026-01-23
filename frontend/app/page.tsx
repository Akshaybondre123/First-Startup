"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Star, Heart, Users, Music, Camera, UtensilsCrossed, Flame, ArrowRight, Sparkles, ChevronRight, ChevronLeft, Instagram, Twitter, Facebook, Mail, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import RestaurantCollections from "@/components/RestaurantCollections";
import SmartSearch from "@/components/SmartSearch";

const vibes = [
  { id: "couple", label: "Couple Friendly", icon: "Heart" },
  { id: "family", label: "Family Friendly", icon: "Users" },
  { id: "party", label: "Party Places", icon: "Music" },
  { id: "aesthetic", label: "Aesthetic Cafes", icon: "Camera" },
  { id: "dinner", label: "Best Dinner", icon: "UtensilsCrossed" },
  { id: "special", label: "City Special", icon: "Flame" },
];

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000&auto=format&fit=crop",
    title: "The Signature Kitchen",
    subtitle: "Fine Dining & Cocktails"
  },
  {
    url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop",
    title: "Sky High Lounge",
    subtitle: "Rooftop Party Vibes"
  },
  {
    url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop",
    title: "Love & Latte",
    subtitle: "Aesthetic Coffee Dates"
  }
];

interface Restaurant {
  _id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  cuisines: string[];
  tags: string[];
  address: string;
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  features: string[];
  verified: boolean;
  distance?: number;
}

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setUserLocation(null);
        }
      );
    }
  }, []);

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await api.restaurants.getAll({
          lat: userLocation?.lat,
          lng: userLocation?.lng,
          maxDistance: 10000,
        });
        if (data.success) {
          setRestaurants(data.data);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [userLocation]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  // Auto-play carousel
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const featuredRestaurants = restaurants.slice(0, 4);

  const getVibeIcon = (id: string) => {
    switch (id) {
      case "couple": return <Heart className="h-5 w-5 md:h-6 md:w-6" />;
      case "family": return <Users className="h-5 w-5 md:h-6 md:w-6" />;
      case "party": return <Music className="h-5 w-5 md:h-6 md:w-6" />;
      case "aesthetic": return <Camera className="h-5 w-5 md:h-6 md:w-6" />;
      case "dinner": return <UtensilsCrossed className="h-5 w-5 md:h-6 md:w-6" />;
      case "special": return <Flame className="h-5 w-5 md:h-6 md:w-6" />;
      default: return <Star className="h-5 w-5 md:h-6 md:w-6" />;
    }
  };

  const getVibeGradient = (id: string) => {
    switch (id) {
      case "couple": return "from-pink-500 to-rose-500";
      case "family": return "from-blue-500 to-cyan-500";
      case "party": return "from-purple-500 to-indigo-500";
      case "aesthetic": return "from-fuchsia-500 to-pink-500";
      case "dinner": return "from-amber-500 to-orange-500";
      case "special": return "from-red-500 to-orange-500";
      default: return "from-zinc-500 to-zinc-400";
    }
  };

  // Handle mobile search
  const handleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showMobileSearch && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-0 z-50 pt-16 px-4"
          >
            <div className="glass-nav rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <SmartSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onTagSelect={(tag: string) => {
                    window.location.href = `/explore?search=${encodeURIComponent(tag)}`;
                    setShowMobileSearch(false);
                  }}
                  placeholder="Search restaurants, cuisines..."
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowMobileSearch(false)}
                  className="shrink-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="text-xs text-zinc-400">
                Try: "Pizza", "Date Night", "Cafes", "Fine Dining"
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glass Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 md:px-15 py-2 sm:py-3">
        <div className="glass-nav container mx-auto rounded-2xl md:rounded-full px-4 sm:px-5 md:px-6 py-2 sm:py-3 flex items-center justify-between gap-3 sm:gap-4 md:gap-6">
          <Link href="/" className="font-bold text-lg sm:text-xl tracking-tight flex items-center gap-2 shrink-0">
            <img 
              src="/wampin.png" 
              alt="Wampin Logo" 
              className="h-6 w-9 sm:h-8 sm:w-12 md:h-10 md:w-14 lg:h-13 lg:w-19 object-contain" 
            />
            <span className="text-gradient hidden sm:inline-block -translate-x-2 -translate-y-0">
              Wampin
            </span>
          </Link>
          
          {/* Mobile Search Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleMobileSearch}
              className="rounded-full"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Link href="/register">
              <Button className="rounded-full bg-white text-black hover:bg-zinc-200 font-bold px-3 h-8 text-xs shrink-0 whitespace-nowrap">
                Partner
              </Button>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-3 lg:gap-4 ml-auto">
            {/* Search Bar */}
            <div className="relative w-48 lg:w-64 xl:w-80 transition-all duration-300">
              <SmartSearch
                value={searchQuery}
                onChange={setSearchQuery}
                onTagSelect={(tag: string) => {
                  window.location.href = `/explore?search=${encodeURIComponent(tag)}`;
                }}
                placeholder="Search places, tags..."
              />
            </div>

            <Link href="/register">
              <Button className="rounded-full bg-white text-black hover:bg-zinc-200 font-bold px-4 lg:px-5 h-8 lg:h-9 text-xs lg:text-sm shrink-0 whitespace-nowrap">
                Partner with Us
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Immersive Hero Carousel - Fixed button overlap */}
      <section className="relative h-[65vh] sm:h-[70vh] md:h-[75vh] lg:h-[85vh] w-full overflow-hidden">
        <div className="embla h-full" ref={emblaRef}>
          <div className="embla__container h-full flex">
            {HERO_IMAGES.map((img, index) => (
              <div key={index} className="embla__slide relative h-full flex-[0_0_100%] min-w-0">
                <img 
                  src={img.url} 
                  alt={img.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
                
                {/* Main Content Container */}
                <div className="absolute inset-0 container mx-auto z-10">
                  <div className="h-full flex flex-col justify-end px-4 sm:px-6 md:px-8 lg:px-20 pb-20 sm:pb-16 md:pb-8 lg:pb-20">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Badge className="mb-2 sm:mb-3 md:mb-4 bg-white/10 backdrop-blur border-white/10 text-white hover:bg-white/20 px-2 sm:px-3 md:px-4 py-1 uppercase tracking-widest text-[10px] sm:text-xs font-bold">
                        Featured Collection
                      </Badge>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl 2xl:text-8xl font-black tracking-tighter mb-2 sm:mb-3 md:mb-4 leading-tight">
                        {img.title}
                      </h1>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-zinc-300 font-light mb-4 sm:mb-5 md:mb-6 lg:mb-8 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl">
                        {img.subtitle}
                      </p>
                      
                      {/* Buttons with safe spacing */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 md:gap-4">
                        <Button 
                          size={isMobile ? "default" : "lg"} 
                          className="rounded-full bg-white text-black hover:bg-zinc-200 h-12 sm:h-10 md:h-12 lg:h-14 px-5 sm:px-5 md:px-6 lg:px-8 text-sm sm:text-sm md:text-base lg:text-lg font-bold shadow-lg"
                        >
                          View Details
                        </Button>
                        <Button 
                          size={isMobile ? "default" : "lg"} 
                          variant="outline" 
                          className="rounded-full border-white/30 text-white hover:bg-white/10 h-12 sm:h-10 md:h-12 lg:h-14 px-5 sm:px-5 md:px-6 lg:px-8 text-sm sm:text-sm md:text-base lg:text-lg bg-white/5 backdrop-blur-sm"
                        >
                          Explore More
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Carousel Indicators - Always in right corner */}
        <div className={cn(
          "absolute flex gap-2 z-20",
          "bottom-3 right-4 sm:bottom-4 md:bottom-6 lg:bottom-8 sm:right-6 md:right-8 lg:right-8 xl:right-20"
        )}>
          {HERO_IMAGES.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-2 rounded-full transition-all duration-300", 
                i === selectedIndex ? "w-6 bg-white" : "w-2 bg-white/30"
              )} 
            />
          ))}
        </div>
      </section>

      {/* Vibe Stories */}
      <section className="py-8 sm:py-10 md:py-12 border-b border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-xs sm:text-sm font-bold mb-4 sm:mb-6 text-zinc-400 uppercase tracking-widest">Browse by Mood</h2>
          <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-2 sm:pb-4 no-scrollbar -mx-4 px-4">
            {vibes.map((vibe) => (
              <Link href={`/explore?vibe=${vibe.id}`} key={vibe.id} className="flex flex-col items-center gap-2 sm:gap-3 group shrink-0">
                <div className={cn("w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full p-[1.5px] sm:p-[2px] bg-gradient-to-tr group-hover:scale-105 transition-transform duration-300", getVibeGradient(vibe.id))}>
                  <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center border-2 sm:border-3 md:border-4 border-[#050505]">
                    {getVibeIcon(vibe.id)}
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-zinc-400 group-hover:text-white transition-colors text-center max-w-[70px] sm:max-w-none leading-tight">
                  {vibe.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Collections - Improved Mobile Design */}
      {/* Curated Collections - Fixed corner issue */}
<section className="py-10 sm:py-12 md:py-14 lg:py-16 bg-[#050505] overflow-hidden">
  <div className="container mx-auto px-4 mb-6 sm:mb-8">
    <div className="flex justify-between items-start mb-6 sm:mb-8">
      <div className="max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tighter">
            Curated For You ✨
          </h2>
        </div>
        <p className="text-zinc-400 text-xs sm:text-sm">Handpicked collections for every mood & occasion</p>
      </div>
      <Button variant="link" className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm hidden sm:block">
        View All
      </Button>
    </div>
    
    {/* Mobile Collections Cards */}
    <div className="sm:hidden space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Link href="/explore?vibe=couple" className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-rose-500/20 z-0"></div>
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-overlay opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          <div className="relative z-10 h-full p-4 flex flex-col justify-end">
            <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center mb-2 text-white shadow-lg">
              <Heart className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold mb-1 text-white">Date Night</h3>
            <p className="text-zinc-300 text-xs">Romantic spots for couples</p>
          </div>
        </Link>
        
        <Link href="/explore?vibe=party" className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 z-0"></div>
          <img 
            src="https://images.unsplash.com/photo-1570554520913-ce615f1f1d17?q=80&w=600&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-overlay opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          <div className="relative z-10 h-full p-4 flex flex-col justify-end">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mb-2 text-white shadow-lg">
              <Music className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold mb-1 text-white">Party Places</h3>
            <p className="text-zinc-300 text-xs">Vibrant nightlife spots</p>
          </div>
        </Link>
      </div>
      
      <Link href="/explore?vibe=aesthetic" className="group relative h-32 w-full rounded-2xl overflow-hidden cursor-pointer border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 z-0"></div>
        <img 
          src="https://images.unsplash.com/photo-1507133750069-775b0e98585f?q=80&w=1200&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-overlay opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        <div className="relative z-10 h-full p-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3 text-white shadow-lg">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold mb-1 text-white">Solo & Work</h3>
            <p className="text-zinc-300 text-xs">Cafe workspace & chill</p>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400 ml-auto" />
        </div>
      </Link>
    </div>
    
    {/* Desktop Marquee */}
    <div className="hidden sm:block relative w-full py-4">
      <motion.div 
        className="flex gap-6 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        style={{ willChange: 'transform' }}
      >
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            <Link href="/explore?vibe=couple" className="group relative h-56 md:h-64 w-72 md:w-80 rounded-3xl overflow-hidden cursor-pointer border border-white/5 shrink-0 hover:border-white/20 transition-all duration-300 shadow-xl shadow-black/30">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-rose-500/20 z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-overlay opacity-70"
                style={{ borderRadius: '1.5rem' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center mb-3 text-white shadow-lg shadow-rose-500/30">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold mb-1 text-white group-hover:text-rose-300 transition-colors">Date Night</h3>
                <p className="text-zinc-300 text-sm">Romantic spots for couples</p>
              </div>
            </Link>
            
            <Link href="/explore?vibe=party" className="group relative h-56 md:h-64 w-72 md:w-80 rounded-3xl overflow-hidden cursor-pointer border border-white/5 shrink-0 hover:border-white/20 transition-all duration-300 shadow-xl shadow-black/30">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1570554520913-ce615f1f1d17?q=80&w=800&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-overlay opacity-70"
                style={{ borderRadius: '1.5rem' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mb-3 text-white shadow-lg shadow-purple-500/30">
                  <Music className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold mb-1 text-white group-hover:text-purple-300 transition-colors">Group Hangouts</h3>
                <p className="text-zinc-300 text-sm">Squad goals & nightlife</p>
              </div>
            </Link>

            <Link href="/explore?vibe=aesthetic" className="group relative h-56 md:h-64 w-72 md:w-80 rounded-3xl overflow-hidden cursor-pointer border border-white/5 shrink-0 hover:border-white/20 transition-all duration-300 shadow-xl shadow-black/30">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1507133750069-775b0e98585f?q=80&w=800&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-overlay opacity-70"
                style={{ borderRadius: '1.5rem' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mb-3 text-white shadow-lg shadow-blue-500/30">
                  <Camera className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold mb-1 text-white group-hover:text-blue-300 transition-colors">Solo & Work</h3>
                <p className="text-zinc-300 text-sm">Cafe workspace & chill</p>
              </div>
            </Link>
            
            <Link href="/explore?vibe=dinner" className="group relative h-56 md:h-64 w-72 md:w-80 rounded-3xl overflow-hidden cursor-pointer border border-white/5 shrink-0 hover:border-white/20 transition-all duration-300 shadow-xl shadow-black/30">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-orange-500/20 z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-overlay opacity-70"
                style={{ borderRadius: '1.5rem' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center mb-3 text-white shadow-lg shadow-amber-500/30">
                  <UtensilsCrossed className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold mb-1 text-white group-hover:text-amber-300 transition-colors">Fine Dining</h3>
                <p className="text-zinc-300 text-sm">Luxury meals & experience</p>
              </div>
            </Link>
          </React.Fragment>
        ))}
      </motion.div>
    </div>
    
    {/* Mobile View All Button */}
    <div className="sm:hidden mt-6 flex justify-center">
      <Button 
        variant="outline" 
        className="w-full rounded-full border-white/20 text-white hover:bg-white/10 h-10"
        asChild
      >
        <Link href="/explore">
          View All Collections
          <ChevronRight className="h-4 w-4 ml-2" />
        </Link>
      </Button>
    </div>
  </div>
</section>

      {/* Smart Collections Section */}
      <RestaurantCollections restaurants={restaurants} userLocation={userLocation} />

      {/* Trending Section */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-6 sm:mb-8 md:mb-10">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter mb-1 sm:mb-2">
                Trending Near You <span className="text-purple-500">🔥</span>
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm">The hottest spots everyone is talking about.</p>
            </div>
            <Button variant="link" className="text-zinc-400 hover:text-white text-xs sm:text-sm hidden sm:block">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8 sm:py-12 text-zinc-400">Loading restaurants...</div>
            ) : featuredRestaurants.length === 0 ? (
              <div className="col-span-full text-center py-8 sm:py-12 text-zinc-400 text-sm sm:text-base">
                No restaurants found. <Link href="/register" className="text-purple-400 hover:underline">Register your restaurant</Link>
              </div>
            ) : (
              featuredRestaurants.map((restaurant, i) => (
                <Link href={`/restaurant/${restaurant._id}`} key={restaurant._id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: isMobile ? 0 : -10 }}
                    className="group relative bg-[#111] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden border border-white/5"
                  >
                    <div className="aspect-[4/5] w-full overflow-hidden relative">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>
                      
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/50 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 border border-white/10">
                        <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
                        {restaurant.rating}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 leading-tight">{restaurant.name}</h3>
                        <p className="text-xs sm:text-sm text-zinc-400 mb-2 sm:mb-3 line-clamp-1">{restaurant.cuisines.join(", ")}</p>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-zinc-500 mb-3 sm:mb-4">
                          <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> 
                          <span className="truncate">{restaurant.address.split(',')[0]}</span>
                          {restaurant.distance && (
                            <span className="text-purple-400 whitespace-nowrap">• {restaurant.distance} km</span>
                          )}
                        </div>
                        {restaurant.verified && (
                          <Badge className="mb-2 bg-green-500/20 text-green-400 border-green-500/50 text-[9px] sm:text-[10px]">
                            Verified
                          </Badge>
                        )}
                        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                          {restaurant.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none text-[9px] sm:text-[10px] px-2 py-0.5">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
          
          {/* Mobile View All Button */}
          <div className="sm:hidden mt-6 flex justify-center">
            <Button variant="outline" className="w-full rounded-full border-white/20 text-white hover:bg-white/10 h-10">
              View All Restaurants
            </Button>
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black -z-10"></div>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black tracking-tighter mb-4 sm:mb-6 md:mb-8">
            GROW YOUR <br/> <span className="text-gradient">BUSINESS.</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-400 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-xs sm:max-w-sm md:max-w-lg mx-auto">
            List your restaurant on Wampin to reach thousands of food lovers and grow your footfall.
          </p>
          <div className="flex justify-center">
            <Link href="/register">
              <Button size={isMobile ? "default" : "lg"} className="h-10 sm:h-12 md:h-14 lg:h-16 px-6 sm:px-8 md:px-10 rounded-full bg-white text-black hover:bg-zinc-200 text-sm sm:text-base md:text-lg font-bold">
                Become a Partner
              </Button>
            </Link>
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
    </main>
  );
}