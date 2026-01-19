# NagpurVibes - Restaurant Discovery Platform

A modern restaurant discovery platform built with Next.js, Express.js, MongoDB Atlas, and geolocation-based search. Find the best restaurants, cafes, and party places in Nagpur based on your location and preferences.

## Features

- 🗺️ **Location-Based Search** - Find nearby restaurants using MongoDB geospatial queries
- 🏷️ **Tag-Based Discovery** - Filter by Budget, Family Friendly, Late Night, Pure Veg, Student Friendly, etc.
- ✅ **Verified Restaurants** - Trusted restaurants marked as verified
- 📍 **Geolocation Integration** - Automatic location detection and distance calculation
- 📝 **Restaurant Registration** - Easy onboarding form for restaurant owners
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: MongoDB Atlas (Free Tier - M0)
- **Maps**: Google Maps Embed (no API key needed for basic display)

## Project Structure

```
First-Startup/
├── app/                 # Next.js frontend app
├── components/          # React components
├── lib/                 # Frontend utilities
├── public/              # Static assets
├── backend/             # Express.js backend API
│   ├── src/
│   │   ├── config/     # Database configuration
│   │   ├── models/     # MongoDB models
│   │   ├── routes/     # API routes
│   │   └── server.ts   # Express server
│   └── package.json
└── package.json         # Frontend dependencies
```

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- MongoDB connection string

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 3. Environment Variables

**Frontend** - Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Backend** - Create a `.env` file in the `backend` folder:

```env
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/FoodPradise?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Note**: Replace the MONGO_URI with your actual MongoDB Atlas connection string.

### 3. Database Setup

The MongoDB schema includes:
- Restaurant details (name, image, rating, price range, etc.)
- Tags (Budget, Family Friendly, Late Night, Pure Veg, etc.)
- Location with latitude & longitude
- 2dsphere index for geospatial queries

The index is automatically created when you first save a restaurant with location data. However, you can also create it manually:

```bash
# Option 1: Use the setup script (requires tsx)
npm install -D tsx
npx tsx scripts/setup-db.ts

# Option 2: Create index via MongoDB Compass or Atlas UI
# Index: { location: "2dsphere" }
```

### 4. Seed Initial Data (Optional)

To add 3-4 sample restaurants, make a POST request to the seed endpoint:

```bash
# Using curl
curl -X POST http://localhost:3000/api/restaurants/seed

# Or visit in browser after starting the server
# http://localhost:3000/api/restaurants/seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

All API endpoints are available at `http://localhost:5000/api`

### Restaurants

- `GET /api/restaurants` - Get all restaurants
  - Query params: `?lat=21.1458&lng=79.0882&tags=Budget,Family Friendly&verified=true&search=keyword&maxDistance=10000`
- `GET /api/restaurants/:id` - Get single restaurant
- `POST /api/restaurants` - Create new restaurant
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant
- `POST /api/restaurants/seed` - Seed sample restaurants

### Health Check

- `GET /api/health` - Check if API is running

## Pages

- `/` - Home page with featured restaurants
- `/explore` - Browse all restaurants with filters
- `/restaurant/[id]` - Restaurant detail page
- `/register` - Restaurant registration form

## Restaurant Registration

Restaurant owners can register their restaurant at `/register`. The form includes:

- Basic information (name, image, price range, cuisines, description)
- Tags selection (Budget, Family Friendly, Late Night, etc.)
- Location (address + coordinates, or use geolocation)
- Contact information (phone, email, website)
- Features list

New restaurants are marked as unverified by default. Admin can verify them by updating the `verified` field in the database.

## Location Search

The app uses MongoDB's `$near` query with a 2dsphere index for efficient geospatial searches:

- Automatically detects user location (with permission)
- Finds restaurants within a specified radius (default: 10km)
- Calculates and displays distance
- Sorts by distance and verified status

## Tag System

Available tags:
- Budget
- Family Friendly
- Late Night
- Pure Veg
- Student Friendly
- Couple Friendly
- Party Place
- Best Dinner Spot
- Aesthetic Cafe
- Nagpur Special
- Private Cafe
- Private Dining

## Database Schema

```typescript
{
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  priceRange: string; // ₹, ₹₹, ₹₹₹, ₹₹₹₹
  cuisines: string[];
  tags: string[];
  address: string;
  description: string;
  location: {
    type: 'Point';
    coordinates: [longitude, latitude]; // MongoDB format
  };
  features: string[];
  verified: boolean;
  phone?: string;
  email?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL
   - `NEXT_PUBLIC_APP_URL` - Your frontend URL
4. Deploy

### Backend (Render/Railway/Heroku)

1. Push your code to GitHub
2. Create new service on Render/Railway/Heroku
3. Add environment variables:
   - `MONGO_URI` - Your MongoDB Atlas connection string
   - `PORT` - Server port (usually auto-set)
   - `FRONTEND_URL` - Your frontend URL
   - `NODE_ENV` - Set to `production`
4. Deploy

### Environment Variables for Production

**Frontend:**
- `NEXT_PUBLIC_API_URL` - Your backend API URL (e.g., `https://api.yourapp.com/api`)
- `NEXT_PUBLIC_APP_URL` - Your frontend URL

**Backend:**
- `MONGO_URI` - Your MongoDB Atlas connection string
- `PORT` - Server port
- `FRONTEND_URL` - Your frontend URL for CORS
- `NODE_ENV` - Set to `production`

## Notes

- The 2dsphere index is created automatically when restaurants are saved
- Google Maps embed is used for displaying location (no API key required for basic embed)
- For directions, the app uses Google Maps directions URL
- All location searches use MongoDB geospatial queries (no Google Places API needed)

## License

MIT

MIT
