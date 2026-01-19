"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Star, Heart, Users, Music, Camera, UtensilsCrossed, Flame, ArrowRight, Sparkles, ChevronRight, ChevronLeft, Instagram, Twitter, Facebook, Mail } from "lucide-react";
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
          // User denied or error getting location
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
      case "couple": return <Heart className="h-6 w-6" />;
      case "family": return <Users className="h-6 w-6" />;
      case "party": return <Music className="h-6 w-6" />;
      case "aesthetic": return <Camera className="h-6 w-6" />;
      case "dinner": return <UtensilsCrossed className="h-6 w-6" />;
      case "special": return <Flame className="h-6 w-6" />;
      default: return <Star className="h-6 w-6" />;
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

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      
      {/* Floating Glass Navbar with Smart Search */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-15 py-3">
        <div className="glass-nav container mx-auto rounded-full px-6 py-3 flex items-center justify-between gap-6">
          <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2 shrink-0">
            <img src="/wampin.png" alt="Wampin Logo" className="h-13 w-19 object-contain" />
            <span className="text-gradient inline-block -translate-x-2 -translate-y-0">
  Wampin
</span>

          </Link>
          
          <div className="flex items-center gap-4 ml-auto">
             {/* Search Bar - Moved to Right */}
             <div className="hidden md:flex relative w-64 transition-all duration-300 focus-within:w-80">
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
               <Button className="rounded-full bg-white text-black hover:bg-zinc-200 font-bold px-5 h-9 text-sm shrink-0">
                 Partner with Us
               </Button>
             </Link>
          </div>
        </div>
      </nav>

      {/* Immersive Hero Carousel */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div className="embla h-full" ref={emblaRef}>
          <div className="embla__container h-full flex">
            {HERO_IMAGES.map((img, index) => (
              <div key={index} className="embla__slide relative h-full flex-[0_0_100%]">
                 <img 
                   src={img.url} 
                   alt={img.title}
                   className="absolute inset-0 w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent"></div>
                 <div className="absolute bottom-0 left-0 right-0 p-8 md:p-20 container mx-auto z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Badge className="mb-4 bg-white/10 backdrop-blur border-white/10 text-white hover:bg-white/20 px-4 py-1.5 uppercase tracking-widest text-xs font-bold">
                        Featured Collection
                      </Badge>
                      <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 leading-none">
                        {img.title}
                      </h1>
                      <p className="text-xl md:text-2xl text-zinc-300 font-light mb-8 max-w-xl">
                        {img.subtitle}
                      </p>
                      <div className="flex gap-4">
                        <Button size="lg" className="rounded-full bg-white text-black hover:bg-zinc-200 h-14 px-8 text-lg font-bold">
                          View Details
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 h-14 px-8 text-lg bg-transparent backdrop-blur-sm">
                          Explore More
                        </Button>
                      </div>
                    </motion.div>
                 </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 right-8 md:right-20 flex gap-2 z-20">
          {HERO_IMAGES.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-300", 
                i === selectedIndex ? "w-8 bg-white" : "w-2 bg-white/30"
              )} 
            />
          ))}
        </div>
      </section>

      {/* Vibe Stories (Horizontal Scroll) */}
      <section className="py-12 border-b border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-lg font-bold mb-6 text-zinc-400 uppercase tracking-widest text-xs">Browse by Mood</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {vibes.map((vibe) => (
              <Link href={`/explore?vibe=${vibe.id}`} key={vibe.id} className="flex flex-col items-center gap-3 group shrink-0">
                <div className={cn("w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr group-hover:scale-105 transition-transform duration-300", getVibeGradient(vibe.id))}>
                  <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center border-4 border-[#050505]">
                    {getVibeIcon(vibe.id)}
                  </div>
                </div>
                <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">{vibe.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Collections (Moving Marquee) */}
      <section className="py-16 bg-[#050505] overflow-hidden">
         <div className="container mx-auto px-4 mb-8 flex justify-between items-end">
            <div>
               <h2 className="text-2xl font-black tracking-tighter mb-1">Curated For You ✨</h2>
               <p className="text-zinc-400 text-sm">Handpicked collections for every mood.</p>
            </div>
            <Button variant="link" className="text-purple-400 hover:text-purple-300 text-sm">View All</Button>
         </div>
         
         {/* Marquee Container */}
         <div className="relative w-full">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
            
            <motion.div 
               className="flex gap-6 w-max"
               animate={{ x: ["0%", "-50%"] }}
               transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
               {[...Array(2)].map((_, i) => (
                  <>
                     <Link href="/explore?vibe=couple" className="group relative h-64 w-80 rounded-3xl overflow-hidden cursor-pointer border border-white/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80"></div>
                        <div className="absolute bottom-0 left-0 p-6">
                           <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center mb-3 text-white shadow-lg shadow-rose-500/30">
                              <Heart className="h-5 w-5" />
                           </div>
                           <h3 className="text-xl font-black mb-1 text-white group-hover:text-rose-300 transition-colors">Date Night</h3>
                           <p className="text-zinc-300 text-xs font-medium">Romantic spots.</p>
                        </div>
                     </Link>
                     
                     <Link href="/explore?vibe=party" className="group relative h-64 w-80 rounded-3xl overflow-hidden cursor-pointer border border-white/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1570554520913-ce615f1f1d17?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80"></div>
                        <div className="absolute bottom-0 left-0 p-6">
                           <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mb-3 text-white shadow-lg shadow-purple-500/30">
                              <Music className="h-5 w-5" />
                           </div>
                           <h3 className="text-xl font-black mb-1 text-white group-hover:text-purple-300 transition-colors">Group Hangouts</h3>
                           <p className="text-zinc-300 text-xs font-medium">Squad goals.</p>
                        </div>
                     </Link>

                     <Link href="/explore?vibe=aesthetic" className="group relative h-64 w-80 rounded-3xl overflow-hidden cursor-pointer border border-white/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1507133750069-775b0e98585f?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80"></div>
                        <div className="absolute bottom-0 left-0 p-6">
                           <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mb-3 text-white shadow-lg shadow-blue-500/30">
                              <Camera className="h-5 w-5" />
                           </div>
                           <h3 className="text-xl font-black mb-1 text-white group-hover:text-blue-300 transition-colors">Solo & Work</h3>
                           <p className="text-zinc-300 text-xs font-medium">Cafe workspace.</p>
                        </div>
                     </Link>
                     
                     <Link href="/explore?vibe=dinner" className="group relative h-64 w-80 rounded-3xl overflow-hidden cursor-pointer border border-white/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80"></div>
                        <div className="absolute bottom-0 left-0 p-6">
                           <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center mb-3 text-white shadow-lg shadow-amber-500/30">
                              <UtensilsCrossed className="h-5 w-5" />
                           </div>
                           <h3 className="text-xl font-black mb-1 text-white group-hover:text-amber-300 transition-colors">Fine Dining</h3>
                           <p className="text-zinc-300 text-xs font-medium">Luxury meals.</p>
                        </div>
                     </Link>
                  </>
               ))}
            </motion.div>
         </div>
      </section>

      {/* Smart Collections Section */}
      <RestaurantCollections restaurants={restaurants} userLocation={userLocation} />

      {/* Trending Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
             <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">Trending Near You <span className="text-purple-500">🔥</span></h2>
                <p className="text-zinc-400">The hottest spots everyone is talking about.</p>
             </div>
             <Button variant="link" className="text-zinc-400 hover:text-white">View All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center py-12 text-zinc-400">Loading restaurants...</div>
            ) : featuredRestaurants.length === 0 ? (
              <div className="col-span-4 text-center py-12 text-zinc-400">
                No restaurants found. <Link href="/register" className="text-purple-400 hover:underline">Register your restaurant</Link>
              </div>
            ) : (
              featuredRestaurants.map((restaurant, i) => (
              <Link href={`/restaurant/${restaurant._id}`} key={restaurant._id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative bg-[#111] rounded-3xl overflow-hidden border border-white/5"
                >
                   <div className="aspect-[4/5] w-full overflow-hidden relative">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>
                      
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-white/10">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {restaurant.rating}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                         <h3 className="text-xl font-bold mb-1 leading-tight">{restaurant.name}</h3>
                         <p className="text-sm text-zinc-400 mb-3 line-clamp-1">{restaurant.cuisines.join(", ")}</p>
                         <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
                            <MapPin className="h-3 w-3" /> {restaurant.address}
                            {restaurant.distance && (
                              <span className="text-purple-400">• {restaurant.distance} km</span>
                            )}
                         </div>
                         {restaurant.verified && (
                           <Badge className="mb-2 bg-green-500/20 text-green-400 border-green-500/50 text-[10px]">
                             Verified
                           </Badge>
                         )}
                         <div className="flex gap-2 flex-wrap">
                           {restaurant.tags.slice(0, 2).map(tag => (
                             <Badge key={tag} variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none text-[10px]">
                               {tag}
                             </Badge>
                           ))}
                         </div>
                      </div>
                   </div>
                </motion.div>
              </Link>
            )))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black -z-10"></div>
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
              GROW YOUR <br/> <span className="text-gradient">BUSINESS.</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-12 max-w-xl mx-auto">
              List your restaurant on Wampin to reach thousands of food lovers and grow your footfall.
            </p>
            <div className="flex justify-center gap-4">
               <Link href="/register">
                 <Button size="lg" className="h-16 px-10 rounded-full bg-white text-black hover:bg-zinc-200 text-lg font-bold">
                    Become a Partner
                 </Button>
               </Link>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 bg-[#050505]">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
               <div className="md:col-span-1">
                  <Link href="/" className="font-bold text-2xl tracking-tighter flex items-center gap-2 mb-6">
                     <img src="/wampin.png" alt="Wampin Logo" className="h-25 w-25 object-contain" />
                     <span className="text-gradient">Wampin</span>
                  </Link>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                     The ultimate guide to exploring the best food and vibes around you. Curated with love for foodies, explorers, and vibe seekers.
                  </p>
                  <div className="flex gap-4">
                     <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 hover:text-white text-zinc-400">
                        <Instagram className="h-5 w-5" />
                     </Button>
                     <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 hover:text-white text-zinc-400">
                        <Twitter className="h-5 w-5" />
                     </Button>
                     <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 hover:text-white text-zinc-400">
                        <Facebook className="h-5 w-5" />
                     </Button>
                  </div>
               </div>
               
               <div>
                  <h4 className="font-bold text-white mb-6">Discover</h4>
                  <ul className="space-y-4 text-sm text-zinc-500">
                     <li><Link href="/explore" className="hover:text-purple-400 transition-colors">Trending Spots</Link></li>
                     <li><Link href="/explore?vibe=couple" className="hover:text-purple-400 transition-colors">Date Night</Link></li>
                     <li><Link href="/explore?vibe=party" className="hover:text-purple-400 transition-colors">Party Places</Link></li>
                     <li><Link href="/explore?vibe=aesthetic" className="hover:text-purple-400 transition-colors">Aesthetic Cafes</Link></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-white mb-6">Company</h4>
                  <ul className="space-y-4 text-sm text-zinc-500">
                     <li><Link href="#" className="hover:text-purple-400 transition-colors">About Us</Link></li>
                     <li><Link href="#" className="hover:text-purple-400 transition-colors">Partner with Us</Link></li>
                     <li><Link href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                     <li><Link href="#" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-white mb-6">Stay Updated</h4>
                  <p className="text-zinc-500 text-sm mb-4">Get the latest vibe checks directly to your inbox.</p>
                  <div className="flex gap-2">
                     <Input placeholder="Email address" className="bg-white/5 border-white/10 focus-visible:ring-purple-500 text-white" />
                     <Button size="icon" className="bg-white text-black hover:bg-zinc-200 shrink-0">
                        <ArrowRight className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
            </div>
            
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
               <p>© 2025 Wampin Inc. All rights reserved.</p>
               <p className="flex items-center gap-1">Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for food lovers</p>
            </div>
         </div>
      </footer>

    </main>
  );
}
