# Setup Guide - NagpurVibes

## Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### 2. Environment Variables

**Frontend** - Create `.env.local` in root:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Backend** - Create `.env` in `backend/` folder:
```env
MONGO_URI=mongodb+srv://akshaybondresitcom:Jyoti%402828@cluster0.zihf2hi.mongodb.net/FoodPradise?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Run Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on: http://localhost:3000

### 4. Seed Database (Optional)

```bash
cd backend
npm run seed
```

Or make POST request to: http://localhost:5000/api/restaurants/seed

## Project Structure

```
First-Startup/
├── app/                    # Next.js frontend
│   ├── page.tsx           # Home page
│   ├── explore/           # Explore page
│   ├── register/          # Registration page
│   └── restaurant/[id]/    # Restaurant detail
├── components/             # React components
│   └── RestaurantForm.tsx # Registration form
├── lib/                    # Frontend utilities
│   └── api.ts             # API client
├── backend/                # Express.js backend
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── server.ts      # Express server
│   └── package.json
└── package.json           # Frontend deps
```

## API Endpoints

Base URL: `http://localhost:5000/api`

- `GET /restaurants` - List restaurants (with filters)
- `GET /restaurants/:id` - Get restaurant
- `POST /restaurants` - Create restaurant
- `PUT /restaurants/:id` - Update restaurant
- `DELETE /restaurants/:id` - Delete restaurant
- `POST /restaurants/seed` - Seed data
- `GET /health` - Health check

## Troubleshooting

1. **Backend not connecting to MongoDB:**
   - Check `.env` file in `backend/` folder
   - Verify MONGO_URI is correct
   - Check MongoDB Atlas network access settings

2. **Frontend can't reach backend:**
   - Ensure backend is running on port 5000
   - Check `NEXT_PUBLIC_API_URL` in `.env.local`
   - Check CORS settings in backend

3. **CORS errors:**
   - Update `FRONTEND_URL` in backend `.env`
   - Restart backend server

