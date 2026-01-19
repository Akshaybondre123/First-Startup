"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PhotoGalleryProps {
  images: string[];
  restaurantName: string;
}

export default function PhotoGallery({ images, restaurantName }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const displayImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop"];

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % displayImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + displayImages.length) % displayImages.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {displayImages.slice(0, 5).map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
              index === 0 ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2" : ""
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={image}
              alt={`${restaurantName} - Photo ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            {index === 4 && displayImages.length > 5 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  +{displayImages.length - 5} more
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Full-screen Gallery Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-zinc-400 z-10"
            >
              <X className="h-8 w-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 text-white hover:text-zinc-400 z-10"
            >
              <ChevronLeft className="h-12 w-12" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 text-white hover:text-zinc-400 z-10"
            >
              <ChevronRight className="h-12 w-12" />
            </button>

            <motion.img
              key={selectedImage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={displayImages[selectedImage]}
              alt={`${restaurantName} - Photo ${selectedImage + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {selectedImage + 1} / {displayImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

