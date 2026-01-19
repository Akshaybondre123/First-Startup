"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Star, Filter, SlidersHorizontal, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import QuickFilters, { FilterState } from "@/components/QuickFilters";
import SmartSearch from "@/components/SmartSearch";

const AVAILABLE_TAGS = [
  "Budget",
  "Family Friendly",
  "Late Night",
  "Pure Veg",
  "Student Friendly",
  "Couple Friendly",
  "Party Place",
  "Best Dinner Spot",
  "Aesthetic Cafe",
  "City Special",
  "Private Cafe",
  "Private Dining",
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

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [],
    minRating: 0,
    maxDistance: null,
    sortBy: "rating",
  });

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

  // Debounced search
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, []);

  // Fetch restaurants with debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchRestaurants = async () => {
        try {
          setLoading(true);

          // Map UI sort option to API-supported sort key
          let apiSortBy: "rating" | "distance" | "name" | undefined;
          if (filters.sortBy === "rating") apiSortBy = "rating";
          else if (filters.sortBy === "distance") apiSortBy = "distance";
          else if (filters.sortBy === "price") apiSortBy = "name"; // backend doesn't support price; use name
          else if (filters.sortBy === "newest") apiSortBy = "rating"; // fallback

          const data = await api.restaurants.getAll({
            lat: userLocation?.lat,
            lng: userLocation?.lng,
            tags: selectedTags,
            verified: showVerifiedOnly,
            search: searchQuery,
            maxDistance: filters.maxDistance ? filters.maxDistance * 1000 : 50000,
            sortBy: apiSortBy,
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
    }, searchQuery ? 500 : 0); // 500ms debounce for search, no delay for other filters

    return () => clearTimeout(timeoutId);
  }, [userLocation, selectedTags, showVerifiedOnly, searchQuery, filters.maxDistance, filters.sortBy]);

  // Apply client-side filters (price range, rating)
  useEffect(() => {
    let filtered = [...restaurants];

    // Price range filter
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(r => filters.priceRange.includes(r.priceRange));
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(r => r.rating >= filters.minRating);
    }

    // Distance filter (already handled by API, but double-check)
    if (filters.maxDistance !== null) {
      filtered = filtered.filter(r => !r.distance || r.distance <= filters.maxDistance!);
    }

    // Client-side sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "distance":
          return (a.distance || 999) - (b.distance || 999);
        case "price":
          const priceOrder = { "₹": 1, "₹₹": 2, "₹₹₹": 3, "₹₹₹₹": 4 };
          return (priceOrder[a.priceRange as keyof typeof priceOrder] || 0) - (priceOrder[b.priceRange as keyof typeof priceOrder] || 0);
        case "newest":
          // Would need createdAt field for this to work properly
          return 0;
        default:
          return 0;
      }
    });

    setFilteredRestaurants(filtered);
  }, [restaurants, filters]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
       <nav className="fixed top-0 left-0 right-0 h-20 glass-nav z-50">
        <div className="container mx-auto px-4 h-full flex items-center gap-6">
          <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2 hidden md:flex">
             <img src="/wampin.png" alt="Wampin Logo" className="h-18 w-18 object-contain" />
             <span className="text-gradient">Wampin</span>
          </Link>
          <div className="flex-1 max-w-2xl relative">
            <SmartSearch
              value={searchQuery}
              onChange={setSearchQuery}
              onTagSelect={(tag) => {
                // Auto-select tag when clicked from suggestions
                if (!selectedTags.includes(tag)) {
                  setSelectedTags([...selectedTags, tag]);
                }
              }}
              placeholder="Search places, cuisines, or tags (e.g., 'family', 'couple', 'budget')..."
            />
          </div>
          <Button variant="outline" size="icon" className="md:hidden rounded-xl border-white/10 bg-[#111] text-white">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-28 pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar (Desktop) */}
          <aside className="w-64 hidden md:block shrink-0 space-y-8 h-[calc(100vh-120px)] sticky top-28 overflow-y-auto no-scrollbar">
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-white">
              <SlidersHorizontal className="h-5 w-5 text-purple-500" /> Filters
            </h3>

            {/* Quick Filters */}
            <div className="mb-8">
              <QuickFilters onFilterChange={setFilters} filters={filters} />
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold mb-4 block text-zinc-500 uppercase tracking-widest">Tags</label>
                <div className="space-y-2">
                  <div 
                    className={cn(
                      "text-sm cursor-pointer px-4 py-3 rounded-xl transition-all font-medium border", 
                      selectedTags.length === 0 ? "bg-white text-black border-white" : "bg-[#111] border-white/5 text-zinc-400 hover:text-white hover:border-white/20"
                    )}
                    onClick={() => setSelectedTags([])}
                  >
                    All Tags
                  </div>
                  {AVAILABLE_TAGS.map(tag => (
                    <div 
                      key={tag}
                      className={cn(
                        "text-sm cursor-pointer px-4 py-3 rounded-xl transition-all font-medium border", 
                        selectedTags.includes(tag) ? "bg-purple-600 text-white border-purple-600" : "bg-[#111] border-white/5 text-zinc-400 hover:text-white hover:border-white/20"
                      )}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold mb-4 block text-zinc-500 uppercase tracking-widest">Options</label>
                <div 
                  className={cn(
                    "text-sm cursor-pointer px-4 py-3 rounded-xl transition-all font-medium border", 
                    showVerifiedOnly ? "bg-purple-600 text-white border-purple-600" : "bg-[#111] border-white/5 text-zinc-400 hover:text-white hover:border-white/20"
                  )}
                  onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                >
                  Verified Only
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {selectedTags.length > 0 ? selectedTags.join(", ") : "All Spots"}
            </h1>
            <p className="text-zinc-500">{filteredRestaurants.length} places found for you</p>
            
            {/* Mobile Tag Horizontal Scroll */}
            <div className="md:hidden w-full overflow-x-auto pb-2 flex gap-2 mt-6 no-scrollbar">
               <Badge 
                  variant={selectedTags.length === 0 ? "default" : "outline"}
                  className={cn("cursor-pointer px-4 py-2 h-8 rounded-full text-sm", selectedTags.length === 0 ? "bg-white text-black hover:bg-zinc-200" : "border-white/20 text-zinc-400")}
                  onClick={() => setSelectedTags([])}
                >
                  All
                </Badge>
                {AVAILABLE_TAGS.map(tag => (
                  <Badge 
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={cn("whitespace-nowrap cursor-pointer px-4 py-2 h-8 rounded-full text-sm", selectedTags.includes(tag) ? "bg-purple-600 border-none text-white" : "border-white/20 text-zinc-400")}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-32 text-zinc-500">Loading restaurants...</div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="text-center py-32 text-zinc-500 bg-[#111] rounded-3xl border border-dashed border-white/10">
              <p className="text-lg font-medium">No places found matching your filters.</p>
              <Button variant="link" onClick={() => {setSearchQuery(""); setSelectedTags([]); setShowVerifiedOnly(false); setFilters({priceRange: [], minRating: 0, maxDistance: null, sortBy: "rating"})}} className="text-purple-400 mt-2">Reset Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant, i) => (
                <Link href={`/restaurant/${restaurant._id}`} key={restaurant._id}>
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
                      {restaurant.verified && (
                        <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-green-400">
                          Verified
                        </div>
                      )}
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
                        {restaurant.distance && (
                          <span className="ml-2 text-purple-400">• {restaurant.distance} km</span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                        {restaurant.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-400 border-none font-medium hover:bg-white/10 hover:text-white">
                            {tag}
                          </Badge>
                        ))}
                        {restaurant.tags.length > 3 && (
                           <span className="text-[10px] text-zinc-600 self-center">+{restaurant.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
