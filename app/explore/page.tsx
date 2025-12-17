"use client";

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Star, Filter, SlidersHorizontal, ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { restaurants, vibes } from "@/data/restaurants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          restaurant.cuisines.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedVibe) {
       const vibeObj = vibes.find(v => v.id === selectedVibe);
       if (vibeObj) {
         return matchesSearch && restaurant.vibes.includes(vibeObj.label);
       }
    }
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
       <nav className="fixed top-0 left-0 right-0 h-20 glass-nav z-50">
        <div className="container mx-auto px-4 h-full flex items-center gap-6">
          <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2 hidden md:flex">
             <span className="text-gradient">NagpurVibes</span>
          </Link>
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500" />
            <Input 
              placeholder="Search places, cuisines, or vibes..." 
              className="pl-12 bg-[#111] border-white/10 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-purple-500 text-white placeholder:text-zinc-600" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="md:hidden rounded-xl border-white/10 bg-[#111] text-white">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-28 pb-8 flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar (Desktop) */}
        <aside className="w-64 hidden md:block shrink-0 space-y-8 h-[calc(100vh-120px)] sticky top-28 overflow-y-auto no-scrollbar">
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-white">
              <SlidersHorizontal className="h-5 w-5 text-purple-500" /> Filters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold mb-4 block text-zinc-500 uppercase tracking-widest">Vibe</label>
                <div className="space-y-2">
                  <div 
                    className={cn(
                      "text-sm cursor-pointer px-4 py-3 rounded-xl transition-all font-medium border", 
                      selectedVibe === null ? "bg-white text-black border-white" : "bg-[#111] border-white/5 text-zinc-400 hover:text-white hover:border-white/20"
                    )}
                    onClick={() => setSelectedVibe(null)}
                  >
                    All Vibes
                  </div>
                  {vibes.map(vibe => (
                    <div 
                      key={vibe.id}
                      className={cn(
                        "text-sm cursor-pointer px-4 py-3 rounded-xl transition-all font-medium border", 
                        selectedVibe === vibe.id ? "bg-purple-600 text-white border-purple-600" : "bg-[#111] border-white/5 text-zinc-400 hover:text-white hover:border-white/20"
                      )}
                      onClick={() => setSelectedVibe(vibe.id)}
                    >
                      {vibe.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {selectedVibe ? vibes.find(v => v.id === selectedVibe)?.label : "All Spots"}
            </h1>
            <p className="text-zinc-500">{filteredRestaurants.length} places found in Nagpur</p>
            
            {/* Mobile Vibe Horizontal Scroll */}
            <div className="md:hidden w-full overflow-x-auto pb-2 flex gap-2 mt-6 no-scrollbar">
               <Badge 
                  variant={selectedVibe === null ? "default" : "outline"}
                  className={cn("cursor-pointer px-4 py-2 h-8 rounded-full text-sm", selectedVibe === null ? "bg-white text-black hover:bg-zinc-200" : "border-white/20 text-zinc-400")}
                  onClick={() => setSelectedVibe(null)}
                >
                  All
                </Badge>
                {vibes.map(vibe => (
                  <Badge 
                    key={vibe.id}
                    variant={selectedVibe === vibe.id ? "default" : "outline"}
                    className={cn("whitespace-nowrap cursor-pointer px-4 py-2 h-8 rounded-full text-sm", selectedVibe === vibe.id ? "bg-purple-600 border-none text-white" : "border-white/20 text-zinc-400")}
                    onClick={() => setSelectedVibe(vibe.id)}
                  >
                    {vibe.label}
                  </Badge>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant, i) => (
              <Link href={`/restaurant/${restaurant.id}`} key={restaurant.id}>
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.05 }}
                   whileHover={{ y: -5 }}
                   className="group bg-[#111] rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300 h-full flex flex-col shadow-lg shadow-black/50"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-white/10">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {restaurant.rating}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg leading-tight text-white group-hover:text-purple-400 transition-colors">{restaurant.name}</h3>
                        <span className="text-xs font-bold text-zinc-400 bg-white/5 px-2 py-1 rounded border border-white/5">{restaurant.priceRange}</span>
                      </div>
                      <p className="text-zinc-500 text-sm line-clamp-1">
                        {restaurant.cuisines.join(", ")}
                      </p>
                    </div>
                    
                    <div className="flex items-center text-xs text-zinc-500 mb-5 mt-auto">
                      <MapPin className="h-3 w-3 mr-1 shrink-0" />
                      <span className="truncate">{restaurant.address}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                      {restaurant.vibes.slice(0, 2).map((vibe) => (
                        <Badge key={vibe} variant="secondary" className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-400 border-none font-medium hover:bg-white/10 hover:text-white">
                          {vibe}
                        </Badge>
                      ))}
                      {restaurant.vibes.length > 2 && (
                         <span className="text-[10px] text-zinc-600 self-center">+{restaurant.vibes.length - 2}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          
          {filteredRestaurants.length === 0 && (
            <div className="text-center py-32 text-zinc-500 bg-[#111] rounded-3xl border border-dashed border-white/10">
              <p className="text-lg font-medium">No places found matching your vibe.</p>
              <Button variant="link" onClick={() => {setSearchQuery(""); setSelectedVibe(null)}} className="text-purple-400 mt-2">Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
