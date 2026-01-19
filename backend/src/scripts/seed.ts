import dotenv from 'dotenv';
import { resolve } from 'path';
import connectDB from '../config/database';
import Restaurant from '../models/Restaurant';

// Load environment variables from backend/.env
dotenv.config({ path: resolve(__dirname, '../../.env') });

const seedRestaurants = [
  {
    name: 'The Nagpur Kitchen',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 1240,
    priceRange: '₹₹₹',
    cuisines: ['North Indian', 'Mughlai', 'Continental'],
    tags: ['Family Friendly', 'Best Dinner Spot'],
    address: 'Civil Lines, Nagpur',
    description: 'Experience the finest dining with authentic flavors in the heart of Nagpur. Perfect for family gatherings.',
    location: {
      type: 'Point',
      coordinates: [79.0882, 21.1458],
    },
    features: ['Valet Parking', 'Live Music', 'Outdoor Seating'],
    verified: true,
    phone: '+91 712 1234567',
    email: 'info@nagpurkitch.com',
  },
  {
    name: 'Love & Latte',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 850,
    priceRange: '₹₹',
    cuisines: ['Cafe', 'Italian', 'Desserts'],
    tags: ['Couple Friendly', 'Aesthetic Cafe', 'Private Cafe', 'Student Friendly'],
    address: 'Dharampeth, Nagpur',
    description: 'A cozy aesthetic cafe perfect for couples. Offers private seating areas and delicious brews.',
    location: {
      type: 'Point',
      coordinates: [79.0650, 21.1370],
    },
    features: ['Free Wi-Fi', 'Private Booths', 'Insta-worthy'],
    verified: true,
    phone: '+91 712 2345678',
    email: 'hello@loveandlatte.com',
  },
  {
    name: 'Sky High Lounge',
    image: 'https://images.unsplash.com/photo-1570554886111-e811ac3abce9?q=80&w=1000&auto=format&fit=crop',
    rating: 4.5,
    reviewCount: 2100,
    priceRange: '₹₹₹₹',
    cuisines: ['Asian', 'Finger Food', 'Cocktails'],
    tags: ['Party Place', 'Best Dinner Spot', 'Late Night'],
    address: 'Sadar, Nagpur',
    description: "Nagpur's premier rooftop lounge. The best place to party with a view of the city skyline.",
    location: {
      type: 'Point',
      coordinates: [79.0860, 21.1620],
    },
    features: ['Rooftop', 'DJ', 'Full Bar'],
    verified: true,
    phone: '+91 712 3456789',
    email: 'events@skyhigh.com',
  },
  {
    name: 'Saoji Delight',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 3400,
    priceRange: '₹₹',
    cuisines: ['Saoji', 'Maharashtrian'],
    tags: ['Nagpur Special', 'Family Friendly', 'Budget', 'Pure Veg'],
    address: 'Wardha Road, Nagpur',
    description: 'Authentic spicy Saoji cuisine. A must-visit for spice lovers and those seeking the true taste of Nagpur.',
    location: {
      type: 'Point',
      coordinates: [79.0500, 21.1200],
    },
    features: ['Spicy Challenge', 'AC Dining'],
    verified: true,
    phone: '+91 712 4567890',
    email: 'contact@saojidelight.com',
  },
];

async function seed() {
  try {
    await connectDB();
    
    // Clear existing restaurants
    await Restaurant.deleteMany({});
    console.log('✓ Cleared existing restaurants');

    // Insert seed data
    const restaurants = await Restaurant.insertMany(seedRestaurants);
    console.log(`✓ Seeded ${restaurants.length} restaurants`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();

