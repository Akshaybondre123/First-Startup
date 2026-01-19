"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, MessageSquare, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  restaurantId: string;
}

export default function ReviewSection({ restaurantId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    rating: 0,
    comment: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [restaurantId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await api.reviews.getByRestaurant(restaurantId, 1, 10);
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.rating || !formData.comment) {
      return;
    }

    setSubmitting(true);
    try {
      const data = await api.reviews.create({
        restaurantId,
        userName: formData.userName,
        userEmail: formData.userEmail || undefined,
        rating: formData.rating,
        comment: formData.comment,
      });

      if (data.success) {
        setFormData({ userName: "", userEmail: "", rating: 0, comment: "" });
        setShowForm(false);
        fetchReviews(); // Refresh reviews
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-zinc-400" />
          Reviews & Ratings
        </h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full h-12 px-6 font-bold bg-black text-white hover:bg-zinc-800"
        >
          Write a Review
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-zinc-200 shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-700">
                      Your Name *
                    </label>
                    <Input
                      required
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      className="bg-white border-zinc-200"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-700">
                      Email (Optional)
                    </label>
                    <Input
                      type="email"
                      value={formData.userEmail}
                      onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                      className="bg-white border-zinc-200"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-700">
                      Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= (hoveredStar || formData.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-zinc-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-700">
                      Your Review *
                    </label>
                    <textarea
                      required
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      rows={4}
                      className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Share your experience..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={submitting || !formData.rating}
                      className="flex-1 rounded-full h-12 font-bold bg-black text-white hover:bg-zinc-800"
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                      <Send className="h-4 w-4 ml-2" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setFormData({ userName: "", userEmail: "", rating: 0, comment: "" });
                      }}
                      className="rounded-full h-12 px-6 border-zinc-200"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-zinc-400 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-zinc-300" />
          <p className="text-lg font-medium">No reviews yet.</p>
          <p className="text-sm">Be the first to review this restaurant!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white font-bold">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">{review.userName}</h4>
                    <p className="text-sm text-zinc-500">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-zinc-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-zinc-700 leading-relaxed">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

