"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SmartSearchProps {
  value: string;
  onChange: (value: string) => void;
  onTagSelect?: (tag: string) => void;
  placeholder?: string;
}

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

const TAG_KEYWORDS: Record<string, string[]> = {
  "family": ["Family Friendly"],
  "couple": ["Couple Friendly"],
  "single": ["Aesthetic Cafe", "Student Friendly"],
  "party": ["Party Place"],
  "budget": ["Budget", "Student Friendly"],
  "veg": ["Pure Veg"],
  "vegetarian": ["Pure Veg"],
  "late": ["Late Night"],
  "night": ["Late Night"],
  "dinner": ["Best Dinner Spot"],
  "private": ["Private Cafe", "Private Dining"],
  "aesthetic": ["Aesthetic Cafe"],
  "cafe": ["Aesthetic Cafe", "Private Cafe"],
};

export default function SmartSearch({ value, onChange, onTagSelect, placeholder = "Search places, cuisines, or tags..." }: SmartSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value.trim()) {
      const query = value.toLowerCase();
      
      // Find matching tags based on keywords
      const matchedTags: string[] = [];
      
      // Direct tag match
      AVAILABLE_TAGS.forEach(tag => {
        if (tag.toLowerCase().includes(query)) {
          matchedTags.push(tag);
        }
      });

      // Keyword-based matching
      Object.entries(TAG_KEYWORDS).forEach(([keyword, tags]) => {
        if (query.includes(keyword)) {
          tags.forEach(tag => {
            if (!matchedTags.includes(tag)) {
              matchedTags.push(tag);
            }
          });
        }
      });

      setSuggestedTags(matchedTags.slice(0, 6));
      setShowSuggestions(matchedTags.length > 0);
    } else {
      setSuggestedTags([]);
      setShowSuggestions(false);
    }
  }, [value]);

  const handleTagClick = (tag: string) => {
    onChange(tag);
    if (onTagSelect) {
      onTagSelect(tag);
    }
    setShowSuggestions(false);
  };

  const handleClear = () => {
    onChange("");
    setShowSuggestions(false);
  };

  const isHomepage = placeholder?.includes("Search places, tags");

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className={cn(
        "relative",
        isHomepage && "bg-[#111] rounded-full border border-white/10 transition-colors focus-within:border-purple-500/50"
      )}>
        <Search className={cn(
          "absolute text-zinc-400 pointer-events-none",
          isHomepage ? "left-4 top-2.5 h-4 w-4" : "left-4 top-3.5 h-5 w-5 text-zinc-500 z-10"
        )} />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (suggestedTags.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className={cn(
            "pr-12 text-white placeholder:text-zinc-500 outline-none",
            isHomepage 
              ? "pl-10 bg-transparent border-none h-9 w-full text-sm focus:ring-0"
              : "pl-12 bg-[#111] border-white/10 h-12 rounded-xl focus-visible:ring-2 focus-visible:ring-purple-500 placeholder:text-zinc-600"
          )}
        />
        {value && (
          <button
            onClick={handleClear}
            className={cn(
              "absolute text-zinc-500 hover:text-white transition-colors z-10",
              isHomepage ? "right-3 top-2.5" : "right-4 top-3.5"
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && suggestedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-white/10 rounded-xl p-3 shadow-2xl z-50 max-h-64 overflow-y-auto"
          >
            <div className="flex items-center gap-2 mb-3 px-2">
              <Hash className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Tag Suggestions
              </span>
            </div>
            <div className="space-y-1">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-purple-500/30 flex items-center gap-2"
                >
                  <Hash className="h-3.5 w-3.5 text-purple-400" />
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

