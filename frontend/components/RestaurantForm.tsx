"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Upload, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import PricingPlans from "@/components/PricingPlans";

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

const PRICE_RANGES = ["₹", "₹₹", "₹₹₹", "₹₹₹₹"];

export default function RestaurantForm() {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    priceRange: "₹₹",
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

      const data = await api.restaurants.create({
        name: formData.name,
        image: formData.image,
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
          image: "",
          priceRange: "₹₹",
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

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-8"
      >
        <Card className="border-green-500/50 bg-green-500/10">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-white">Restaurant Registered!</h2>
            <p className="text-zinc-400 mb-6">
              Your restaurant has been submitted successfully. Our team will review it and mark it as verified soon.
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
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Pricing Plans Section */}
      <PricingPlans />

      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Register Your <span className="text-gradient">Restaurant</span>
            </h1>
            <p className="text-zinc-400 text-lg">
              Join Wampin and reach thousands of food lovers around you
            </p>
          </motion.div>

        <Card className="bg-[#111] border-white/10">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-white">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">
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
                      className={`bg-[#050505] border-white/10 text-white ${
                        validationErrors.name ? "border-red-500" : ""
                      }`}
                      placeholder="Enter restaurant name"
                    />
                    {validationErrors.name && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">
                      Image URL
                    </label>
                    <Input
                      value={formData.image}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, image: e.target.value }))
                      }
                      className="bg-[#050505] border-white/10 text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.image && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">
                      Price Range *
                    </label>
                    <div className="flex gap-2">
                      {PRICE_RANGES.map((range) => (
                        <Button
                          key={range}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, priceRange: range }))
                          }
                          variant={formData.priceRange === range ? "default" : "outline"}
                          className={
                            formData.priceRange === range
                              ? "bg-white text-black hover:bg-zinc-200"
                              : "border-white/10 text-white hover:bg-white/10"
                          }
                        >
                          {range}
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
              <div>
                <label className="block text-sm font-medium mb-4 text-zinc-300">
                  Tags (Select all that apply)
                </label>
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
              <div>
                <h3 className="text-xl font-bold mb-6 text-white">Location</h3>
                <div className="space-y-4">
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
              <div>
                <h3 className="text-xl font-bold mb-6 text-white">Contact & Features</h3>
                <div className="space-y-4">
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
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-zinc-200"
              >
                {loading ? "Submitting..." : "Register Restaurant"}
              </Button>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}

