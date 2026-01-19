"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useState } from "react";

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
}

export default function SocialShare({ title, url, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        setShowMenu(!showMenu);
      }
    } else {
      // Fallback: Show menu
      setShowMenu(!showMenu);
    }
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
    setShowMenu(false);
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
    setShowMenu(false);
  };

  const shareToWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`,
      '_blank'
    );
    setShowMenu(false);
  };

  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setShowMenu(false);
      });
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleShare}
        variant="outline"
        className="gap-2 rounded-full h-14 px-8 text-lg font-medium border-zinc-200"
      >
        <Share2 className="h-5 w-5" /> {copied ? 'Copied!' : 'Share'}
      </Button>

      {showMenu && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-xl p-2 z-50 min-w-[200px]">
          <div className="flex flex-col gap-2">
            <button
              onClick={shareToFacebook}
              className="text-left px-4 py-2 rounded-lg hover:bg-zinc-50 text-zinc-700 font-medium transition-colors"
            >
              Facebook
            </button>
            <button
              onClick={shareToTwitter}
              className="text-left px-4 py-2 rounded-lg hover:bg-zinc-50 text-zinc-700 font-medium transition-colors"
            >
              Twitter
            </button>
            <button
              onClick={shareToWhatsApp}
              className="text-left px-4 py-2 rounded-lg hover:bg-zinc-50 text-zinc-700 font-medium transition-colors"
            >
              WhatsApp
            </button>
            <button
              onClick={copyLink}
              className="text-left px-4 py-2 rounded-lg hover:bg-zinc-50 text-zinc-700 font-medium transition-colors"
            >
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

