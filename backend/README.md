# NagpurVibes Backend API

Express.js backend API for NagpurVibes restaurant discovery platform.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file in the `backend` folder:
```env
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/FoodPradise?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. Run development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

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

## Database

Uses MongoDB Atlas with:
- 2dsphere index for geospatial queries
- Indexes on tags, verified status, and rating

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with sample restaurants

