"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, TrendingUp, DollarSign, Award, Clock, Users, Heart, Zap, TrendingDown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

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
  distance?: number;
  verified: boolean;
}

interface Collection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  filter: (restaurants: Restaurant[]) => Restaurant[];
  gradient: string;
}

export default function RestaurantCollections({ restaurants, userLocation }: { restaurants: Restaurant[]; userLocation?: { lat: number; lng: number } | null }) {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const collections: Collection[] = [
    {
      id: "trending",
      title: "🔥 Trending Now",
      description: "Most popular places this week",
      icon: <TrendingUp className="h-5 w-5" />,
      filter: (restaurants) => restaurants
        .filter(r => r.reviewCount > 10)
        .sort((a, b) => (b.reviewCount * b.rating) - (a.reviewCount * a.rating))
        .slice(0, 6),
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "top-rated",
      title: "⭐ Top Rated",
      description: "Highest rated restaurants",
      icon: <Award className="h-5 w-5" />,
      filter: (restaurants) => restaurants
        .filter(r => r.rating >= 4.0 && r.reviewCount >= 5)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6),
      gradient: "from-yellow-500 to-amber-500",
    },
    {
      id: "budget",
      title: "💰 Budget-Friendly",
      description: "Great food at affordable prices",
      icon: <DollarSign className="h-5 w-5" />,
      filter: (restaurants) => restaurants
        .filter(r => r.priceRange === "₹" || r.priceRange === "₹₹")
        .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
        .slice(0, 6),
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "nearby",
      title: "📍 Near You",
      description: "Closest restaurants to your location",
      icon: <MapPin className="h-5 w-5" />,
      filter: (restaurants) => restaurants
        .filter(r => r.distance !== undefined)
        .sort((a, b) => (a.distance || 999) - (b.distance || 999))
        .slice(0, 6),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "fast",
      title: "⚡ Quick Service",
      description: "Fast and efficient dining",
      icon: <Zap className="h-5 w-5" />,
      filter: (restaurants) => restaurants
        .filter(r => r.tags.includes("Student Friendly") || r.tags.includes("Budget"))
        .slice(0, 6),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "romantic",
      title: "💕 Romantic Spots",
      description: "Perfect for date nights",
      icon: <Heart className="h-5 w-5" />,
      filter: (restaurants) => restaurants
        .filter(r => r.tags.includes("Couple Friendly") || r.tags.includes("Private Dining"))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6),
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const displayedCollection = selectedCollection
    ? collections.find(c => c.id === selectedCollection)
    : collections[0];

  const filteredRestaurants = displayedCollection
    ? displayedCollection.filter(restaurants)
    : [];

  return (
    <section className="py-16 bg-[#050505]">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">
            Smart Collections <span className="text-purple-500">✨</span>
          </h2>
          <p className="text-zinc-400">Curated lists to help you discover the best spots</p>
        </div>

        {/* Collection Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-4 no-scrollbar">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => setSelectedCollection(collection.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all shrink-0 ${
                selectedCollection === collection.id || (!selectedCollection && collection.id === "trending")
                  ? `bg-gradient-to-r ${collection.gradient} text-white shadow-lg`
                  : "bg-[#111] text-zinc-400 border border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {collection.icon}
              {collection.title.replace(/\p{Emoji}/gu, "").trim()}
            </button>
          ))}
        </div>

        {/* Collection Content */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant, i) => (
              <Link href={`/restaurant/${restaurant._id}`} key={restaurant._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-[#111] rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg leading-tight text-white group-hover:text-purple-400 transition-colors">
                        {restaurant.name}
                      </h3>
                      <span className="text-xs font-bold text-zinc-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                        {restaurant.priceRange}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-sm line-clamp-1 mb-3">
                      {restaurant.cuisines.join(", ")}
                    </p>
                    <div className="flex items-center text-xs text-zinc-500 mb-3">
                      <MapPin className="h-3 w-3 mr-1 shrink-0" />
                      <span className="truncate">{restaurant.address}</span>
                      {restaurant.distance && (
                        <span className="ml-2 text-purple-400">• {restaurant.distance} km</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-400 border-none"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-400 bg-[#111] rounded-3xl border border-dashed border-white/10">
            <p>No restaurants found in this collection.</p>
          </div>
        )}
      </div>
    </section>
  );
}

