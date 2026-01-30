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
  'http://localhost:3002',
  'https://first-startup-pink.vercel.app',
  /^https:\/\/.*\.vercel\.app$/, // Allow all Vercel preview deployments
  /^https:\/\/.*-akshay-bondres-projects\.vercel\.app$/, // Allow your specific Vercel deployments
];

// Simple CORS setup for deployment
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Additional CORS headers for Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(503).json({ 
      success: false, 
      error: 'Database connection failed',
      message: 'Service temporarily unavailable. Please try again later.' 
    });
  }
});

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
  res.json({ 
    success: true, 
    message: 'Backend API is running',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
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

// Start server - ensure DB connection before listening
async function startServer() {
  try {
    await connectDB();
    console.log('✓ Database connected');
    
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Only start server if not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  startServer();
}

// Export for Vercel serverless
export default app;

