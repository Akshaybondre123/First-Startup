import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import restaurantRoutes from './routes/restaurants';
import seedRoutes from './routes/seed';
import reviewRoutes from './routes/reviews';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Allow local frontends and production frontend
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001',
  'https://first-startup-cav7-2sxsnctmh-akshay-bondres-projects.vercel.app',
  /^https:\/\/.*\.vercel\.app$/, // Allow all Vercel preview deployments
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser / same-origin requests (e.g. curl, Postman, SSR)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list
      if (allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') {
          return allowed === origin;
        }
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return false;
      })) {
        return callback(null, true);
      }

      // In production, allow all origins (you can restrict this later)
      if (process.env.NODE_ENV === 'production') {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS: Origin ${origin} is not allowed`),
        false
      );
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB().catch(console.error);

// Routes
// Root route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Wampin Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      restaurants: '/api/restaurants',
      reviews: '/api/reviews'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend API is running' });
});

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/restaurants/seed', seedRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: {
      root: '/',
      health: '/api/health',
      restaurants: '/api/restaurants',
      reviews: '/api/reviews'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  // Handle CORS errors specifically
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ 
      success: false, 
      error: err.message,
      message: 'CORS policy violation. Please check allowed origins.' 
    });
  }
  
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

