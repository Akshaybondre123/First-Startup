"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Upload, X, CheckCircle2, UtensilsCrossed, Sparkles, Shield, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

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

const PRICE_RANGES = [
  { value: "200-400", label: "₹200-400" },
  { value: "400-800", label: "₹400-800" },
  { value: "800-1200", label: "₹800-1200" },
  { value: "1200+", label: "₹1200+" },
];

export default function RestaurantForm() {
  const [formData, setFormData] = useState({
    name: "",
    image: null as File | null,
    galleryImages: [] as File[],
    priceRange: "400-800",
    cuisines: "",
    tags: [] as string[],
    address: "",
    description: "",
    latitude: "",
    longitude: "",
    features: "",
    phone: "",
    email: "",
    website: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Get user location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
        }));
        setLoading(false);
      },
      (err) => {
        setError("Unable to retrieve your location. Please enter manually.");
        setLoading(false);
      }
    );
  };

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Restaurant name is required";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    if (!formData.latitude || !formData.longitude) {
      errors.location = "Location coordinates are required";
    } else {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.latitude = "Invalid latitude (must be between -90 and 90)";
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.longitude = "Invalid longitude (must be between -180 and 180)";
      }
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errors.website = "Please enter a valid URL (must start with http:// or https://)";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Convert File to base64 for now (backend should handle file uploads properly)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const cuisinesArray = formData.cuisines
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c);

      const featuresArray = formData.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f);

      // Convert main image to base64
      let mainImageUrl = "";
      if (formData.image) {
        mainImageUrl = await fileToBase64(formData.image);
      }

      // Convert gallery images to base64
      const galleryImageUrls = await Promise.all(
        formData.galleryImages.map((file) => fileToBase64(file))
      );

      const data = await api.restaurants.create({
        name: formData.name,
        image: mainImageUrl,
        galleryImages: galleryImageUrls,
        priceRange: formData.priceRange,
        cuisines: cuisinesArray,
        tags: formData.tags,
        address: formData.address,
        description: formData.description,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        features: featuresArray,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
      });

      if (data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: "",
          image: null,
          galleryImages: [],
          priceRange: "400-800",
          cuisines: "",
          tags: [],
          address: "",
          description: "",
          latitude: "",
          longitude: "",
          features: "",
          phone: "",
          email: "",
          website: "",
        });
        setImagePreview(null);
        setGalleryPreviews([]);
        setLocation(null);
      } else {
        setError(data.error || "Failed to register restaurant");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const newGalleryImages = [...formData.galleryImages];
      newGalleryImages[index] = file;
      setFormData((prev) => ({ ...prev, galleryImages: newGalleryImages }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...galleryPreviews];
        newPreviews[index] = reader.result as string;
        setGalleryPreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGalleryImages = formData.galleryImages.filter((_, i) => i !== index);
    const newPreviews = galleryPreviews.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, galleryImages: newGalleryImages }));
    setGalleryPreviews(newPreviews);
  };

  const removeMainImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const FormContent = (
    <form onSubmit={handleSubmit} className="space-y-10">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                    <UtensilsCrossed className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Basic Information</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2.5 text-zinc-200">
                      Restaurant Name *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, name: e.target.value }));
                        if (validationErrors.name) {
                          setValidationErrors((prev) => ({ ...prev, name: "" }));
                        }
                      }}
                      className={`bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all ${
                        validationErrors.name ? "border-red-500" : ""
                      }`}
                      placeholder="e.g., The Rustic Table"
                    />
                    {validationErrors.name && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2.5 text-zinc-200">
                      Main Image (shown everywhere) *
                    </label>
                    {!imagePreview ? (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 hover:border-orange-500/50 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-zinc-400 group-hover:text-orange-400 transition-colors" />
                          <p className="mb-2 text-sm text-zinc-400 group-hover:text-zinc-300">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-zinc-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleMainImageChange}
                        />
                      </label>
                    ) : (
                      <div className="relative mt-3 rounded-lg overflow-hidden border border-white/10 group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeMainImage}
                          className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2.5 text-zinc-200">
                      Gallery Images (2–3 optional, shown on restaurant page)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[0, 1, 2].map((index) => {
                        const preview = galleryPreviews[index];
                        const hasImage = formData.galleryImages[index];
                        return (
                          <div key={index} className="relative">
                            {!preview ? (
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 hover:border-orange-500/50 transition-all group">
                                <Upload className="w-6 h-6 mb-1 text-zinc-400 group-hover:text-orange-400 transition-colors" />
                                <p className="text-xs text-zinc-400 group-hover:text-zinc-300">Upload</p>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleGalleryImageChange(e, index)}
                                />
                              </label>
                            ) : (
                              <div className="relative group rounded-lg overflow-hidden border border-white/10">
                                <img
                                  src={preview}
                                  alt={`Gallery ${index + 1}`}
                                  className="w-full h-32 object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeGalleryImage(index)}
                                  className="absolute top-1 right-1 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3 text-white" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">
                      Price Range *
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {PRICE_RANGES.map((range) => (
                        <Button
                          key={range.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, priceRange: range.value }))
                          }
                          variant={formData.priceRange === range.value ? "default" : "outline"}
                          className={
                            formData.priceRange === range.value
                              ? "bg-white text-black hover:bg-zinc-200"
                              : "border-white/10 text-white hover:bg-white/10"
                          }
                        >
                          {range.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">
                      Cuisines (comma-separated)
                    </label>
                    <Input
                      value={formData.cuisines}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, cuisines: e.target.value }))
                      }
                      className="bg-[#050505] border-white/10 text-white"
                      placeholder="North Indian, Chinese, Italian"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      rows={4}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Tell us about your restaurant..."
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                  </div>
                  <label className="text-2xl font-bold text-white">
                    Tags (Select all that apply)
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`cursor-pointer px-4 py-2 ${
                        formData.tags.includes(tag)
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-[#050505] text-zinc-400 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Location</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">
                      Address *
                    </label>
                    <Input
                      required
                      value={formData.address}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, address: e.target.value }));
                        if (validationErrors.address) {
                          setValidationErrors((prev) => ({ ...prev, address: "" }));
                        }
                      }}
                      className={`bg-[#050505] border-white/10 text-white ${
                        validationErrors.address ? "border-red-500" : ""
                      }`}
                      placeholder="Enter full address"
                    />
                    {validationErrors.address && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.address}</p>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {loading ? "Getting Location..." : "Use My Current Location"}
                  </Button>

                  {location && (
                    <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                      <p className="text-sm text-green-400">
                        Location found: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-300">
                        Latitude *
                      </label>
                      <Input
                        required
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, latitude: e.target.value }));
                          if (validationErrors.latitude) {
                            setValidationErrors((prev) => ({ ...prev, latitude: "" }));
                          }
                        }}
                        className={`bg-[#050505] border-white/10 text-white ${
                          validationErrors.latitude ? "border-red-500" : ""
                        }`}
                        placeholder="21.1458"
                      />
                      {validationErrors.latitude && (
                        <p className="text-red-400 text-xs mt-1">{validationErrors.latitude}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-300">
                        Longitude *
                      </label>
                      <Input
                        required
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, longitude: e.target.value }));
                          if (validationErrors.longitude) {
                            setValidationErrors((prev) => ({ ...prev, longitude: "" }));
                          }
                        }}
                        className={`bg-[#050505] border-white/10 text-white ${
                          validationErrors.longitude ? "border-red-500" : ""
                        }`}
                        placeholder="79.0882"
                      />
                      {validationErrors.longitude && (
                        <p className="text-red-400 text-xs mt-1">{validationErrors.longitude}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Features */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-rose-500/20 border border-orange-500/30 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Contact & Features</h3>
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-300">
                        Phone
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="bg-[#050505] border-white/10 text-white"
                        placeholder="+91 712 1234567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-300">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, email: e.target.value }));
                          if (validationErrors.email) {
                            setValidationErrors((prev) => ({ ...prev, email: "" }));
                          }
                        }}
                        className={`bg-[#050505] border-white/10 text-white ${
                          validationErrors.email ? "border-red-500" : ""
                        }`}
                        placeholder="info@restaurant.com"
                      />
                      {validationErrors.email && (
                        <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">
                      Website
                    </label>
                    <Input
                      value={formData.website}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, website: e.target.value }));
                        if (validationErrors.website) {
                          setValidationErrors((prev) => ({ ...prev, website: "" }));
                        }
                      }}
                      className={`bg-[#050505] border-white/10 text-white ${
                        validationErrors.website ? "border-red-500" : ""
                      }`}
                      placeholder="https://restaurant.com"
                    />
                    {validationErrors.website && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.website}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">
                      Features (comma-separated)
                    </label>
                    <Input
                      value={formData.features}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, features: e.target.value }))
                      }
                      className="bg-[#050505] border-white/10 text-white"
                      placeholder="Free Wi-Fi, Parking, Live Music"
                    />
                  </div>
                </div>
              </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6 border-t border-white/10">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Register Restaurant
                </div>
              )}
            </Button>
            <p className="text-center text-xs text-zinc-500 mt-4">
              Your restaurant will be live immediately after submission
            </p>
          </div>
        </form>
  );

  if (success) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="border-green-500/50 bg-green-500/10">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-white">
                Restaurant Registered!
              </h2>
              <p className="text-zinc-400 mb-6">
                Your restaurant has been submitted successfully. Our team will
                review it and mark it as verified soon.
              </p>
              <Button
                onClick={() => setSuccess(false)}
                className="bg-white text-black hover:bg-zinc-200"
              >
                Register Another Restaurant
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {FormContent}
      </div>
    );
  }

  return <div className="max-w-4xl mx-auto">{FormContent}</div>;
}

