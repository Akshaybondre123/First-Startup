export type Restaurant = {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  cuisines: string[];
  vibes: string[];
  address: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
};

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "The Nagpur Kitchen",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 1240,
    priceRange: "₹₹₹",
    cuisines: ["North Indian", "Mughlai", "Continental"],
    vibes: ["Family Friendly", "Best Dinner Spot"],
    address: "Civil Lines, Nagpur",
    description: "Experience the finest dining with authentic flavors in the heart of Nagpur. Perfect for family gatherings.",
    coordinates: { lat: 21.1458, lng: 79.0882 },
    features: ["Valet Parking", "Live Music", "Outdoor Seating"]
  },
  {
    id: "2",
    name: "Love & Latte",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop",
    rating: 4.6,
    reviewCount: 850,
    priceRange: "₹₹",
    cuisines: ["Cafe", "Italian", "Desserts"],
    vibes: ["Couple Friendly", "Aesthetic Cafe", "Private Cafe"],
    address: "Dharampeth, Nagpur",
    description: "A cozy aesthetic cafe perfect for couples. Offers private seating areas and delicious brews.",
    coordinates: { lat: 21.1370, lng: 79.0650 },
    features: ["Free Wi-Fi", "Private Booths", "Insta-worthy"]
  },
  {
    id: "3",
    name: "Sky High Lounge",
    image: "https://images.unsplash.com/photo-1570554886111-e811ac3abce9?q=80&w=1000&auto=format&fit=crop",
    rating: 4.5,
    reviewCount: 2100,
    priceRange: "₹₹₹₹",
    cuisines: ["Asian", "Finger Food", "Cocktails"],
    vibes: ["Party Place", "Best Dinner Spot"],
    address: "Sadar, Nagpur",
    description: "Nagpur's premier rooftop lounge. The best place to party with a view of the city skyline.",
    coordinates: { lat: 21.1620, lng: 79.0860 },
    features: ["Rooftop", "DJ", "Full Bar"]
  },
  {
    id: "4",
    name: "Saoji Delight",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 3400,
    priceRange: "₹₹",
    cuisines: ["Saoji", "Maharashtrian"],
    vibes: ["Nagpur Special", "Family Friendly"],
    address: "Wardha Road, Nagpur",
    description: "Authentic spicy Saoji cuisine. A must-visit for spice lovers and those seeking the true taste of Nagpur.",
    coordinates: { lat: 21.1200, lng: 79.0500 },
    features: ["Spicy Challenge", "AC Dining"]
  },
  {
    id: "5",
    name: "Secret Garden",
    image: "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 600,
    priceRange: "₹₹₹",
    cuisines: ["European", "Modern Indian"],
    vibes: ["Couple Friendly", "Aesthetic Cafe", "Private Dining"],
    address: "Bajaj Nagar, Nagpur",
    description: "A hidden gem with lush greenery and romantic lighting. Ideal for date nights.",
    coordinates: { lat: 21.1300, lng: 79.0700 },
    features: ["Candle Light Dinner", "Garden Seating"]
  },
  {
    id: "6",
    name: "Biryani Blues",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop",
    rating: 4.4,
    reviewCount: 1500,
    priceRange: "₹₹",
    cuisines: ["Biryani", "Kebab"],
    vibes: ["Nagpur Special", "Family Friendly"],
    address: "Itwari, Nagpur",
    description: "Famous for its aromatic Nagpur style Biryani. Quick service and great taste.",
    coordinates: { lat: 21.1500, lng: 79.1000 },
    features: ["Home Delivery", "Family Pack"]
  }
];

export const vibes = [
  { id: "couple", label: "Couple Friendly", icon: "Heart" },
  { id: "family", label: "Family Friendly", icon: "Users" },
  { id: "party", label: "Party Places", icon: "Music" },
  { id: "aesthetic", label: "Aesthetic Cafes", icon: "Camera" },
  { id: "dinner", label: "Best Dinner", icon: "UtensilsCrossed" },
  { id: "special", label: "Nagpur Special", icon: "Flame" },
];
