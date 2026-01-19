"use client";

import { Clock, MapPin, DollarSign, Star, X, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface QuickFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  filters: FilterState;
}

export interface FilterState {
  priceRange: string[];
  minRating: number;
  maxDistance: number | null;
  sortBy: "rating" | "distance" | "price" | "newest";
}

export default function QuickFilters({ onFilterChange, filters }: QuickFiltersProps) {
  const [priceSlider, setPriceSlider] = useState(2); // 1-4 (₹ to ₹₹₹₹)
  const [ratingSlider, setRatingSlider] = useState(0); // 0-4 (0 to 4.5+)
  const [distanceSlider, setDistanceSlider] = useState(0); // 0-4 (0 to 20km)

  // Sync sliders with filters
  useEffect(() => {
    if (filters.priceRange.length > 0) {
      const maxPrice = Math.max(...filters.priceRange.map(p => {
        if (p === "₹") return 1;
        if (p === "₹₹") return 2;
        if (p === "₹₹₹") return 3;
        return 4;
      }));
      setPriceSlider(maxPrice);
    }
    
    if (filters.minRating > 0) {
      if (filters.minRating >= 4.5) setRatingSlider(4);
      else if (filters.minRating >= 4.0) setRatingSlider(3);
      else if (filters.minRating >= 3.5) setRatingSlider(2);
      else setRatingSlider(1);
    } else {
      setRatingSlider(0);
    }

    if (filters.maxDistance) {
      if (filters.maxDistance <= 2) setDistanceSlider(1);
      else if (filters.maxDistance <= 5) setDistanceSlider(2);
      else if (filters.maxDistance <= 10) setDistanceSlider(3);
      else setDistanceSlider(4);
    } else {
      setDistanceSlider(0);
    }
  }, [filters]);

  const getPriceLabel = (value: number) => {
    if (value === 1) return "₹";
    if (value === 2) return "₹₹";
    if (value === 3) return "₹₹₹";
    return "₹₹₹₹";
  };

  const getRatingLabel = (value: number) => {
    if (value === 0) return "Any Rating";
    if (value === 1) return "3.0+ Stars";
    if (value === 2) return "3.5+ Stars";
    if (value === 3) return "4.0+ Stars";
    return "4.5+ Stars";
  };

  const getDistanceLabel = (value: number) => {
    if (value === 0) return "Any Distance";
    if (value === 1) return "Within 2 km";
    if (value === 2) return "Within 5 km";
    if (value === 3) return "Within 10 km";
    return "Within 20 km";
  };

  const handlePriceChange = (value: number) => {
    setPriceSlider(value);
    const selectedPrices: string[] = [];
    for (let i = 1; i <= value; i++) {
      selectedPrices.push(getPriceLabel(i));
    }
    onFilterChange({ ...filters, priceRange: value > 0 ? selectedPrices : [] });
  };

  const handleRatingChange = (value: number) => {
    setRatingSlider(value);
    let minRating = 0;
    if (value === 1) minRating = 3.0;
    else if (value === 2) minRating = 3.5;
    else if (value === 3) minRating = 4.0;
    else if (value === 4) minRating = 4.5;
    onFilterChange({ ...filters, minRating });
  };

  const handleDistanceChange = (value: number) => {
    setDistanceSlider(value);
    let maxDistance: number | null = null;
    if (value === 1) maxDistance = 2;
    else if (value === 2) maxDistance = 5;
    else if (value === 3) maxDistance = 10;
    else if (value === 4) maxDistance = 20;
    onFilterChange({ ...filters, maxDistance });
  };

  const handleSortChange = (sortBy: FilterState["sortBy"]) => {
    onFilterChange({ ...filters, sortBy });
  };

  const clearFilters = () => {
    setPriceSlider(2);
    setRatingSlider(0);
    setDistanceSlider(0);
    onFilterChange({
      priceRange: [],
      minRating: 0,
      maxDistance: null,
      sortBy: "rating",
    });
  };

  const hasActiveFilters = filters.priceRange.length > 0 || filters.minRating > 0 || filters.maxDistance !== null;

  return (
    <div className="space-y-6">
      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <DollarSign className="h-3.5 w-3.5" />
            Price Range
          </label>
          <span className="text-sm font-bold text-purple-400">{getPriceLabel(priceSlider)}</span>
        </div>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="4"
            value={priceSlider}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="w-full h-2 bg-[#050505] rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(priceSlider / 4) * 100}%, #1a1a1a ${(priceSlider / 4) * 100}%, #1a1a1a 100%)`
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-zinc-500 mt-2 px-2">
          <span>Any</span>
          <span>₹</span>
          <span>₹₹</span>
          <span>₹₹₹</span>
          <span>₹₹₹₹</span>
        </div>
      </div>

      {/* Rating Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Star className="h-3.5 w-3.5" />
            Minimum Rating
          </label>
          <span className="text-sm font-bold text-yellow-400">{getRatingLabel(ratingSlider)}</span>
        </div>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="4"
            value={ratingSlider}
            onChange={(e) => handleRatingChange(Number(e.target.value))}
            className="w-full h-2 bg-[#050505] rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #eab308 0%, #eab308 ${(ratingSlider / 4) * 100}%, #1a1a1a ${(ratingSlider / 4) * 100}%, #1a1a1a 100%)`
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-zinc-500 mt-2 px-2">
          <span>Any</span>
          <span>3.0+</span>
          <span>3.5+</span>
          <span>4.0+</span>
          <span>4.5+</span>
        </div>
      </div>

      {/* Distance Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            Maximum Distance
          </label>
          <span className="text-sm font-bold text-blue-400">{getDistanceLabel(distanceSlider)}</span>
        </div>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="4"
            value={distanceSlider}
            onChange={(e) => handleDistanceChange(Number(e.target.value))}
            className="w-full h-2 bg-[#050505] rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(distanceSlider / 4) * 100}%, #1a1a1a ${(distanceSlider / 4) * 100}%, #1a1a1a 100%)`
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-zinc-500 mt-2 px-2">
          <span>Any</span>
          <span>2km</span>
          <span>5km</span>
          <span>10km</span>
          <span>20km</span>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort By
          </label>
        </div>
        <div className="space-y-2">
          {[
            { value: "rating" as const, label: "Highest Rated" },
            { value: "distance" as const, label: "Nearest First" },
            { value: "price" as const, label: "Price: Low to High" },
            { value: "newest" as const, label: "Newest First" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                filters.sortBy === option.value
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-[#111] border-white/5 text-zinc-400 hover:text-white hover:border-white/20"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-white/10 hover:border-white/20 flex items-center justify-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear All Filters
        </button>
      )}

    </div>
  );
}
