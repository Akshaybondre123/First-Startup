import express, { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';

const router = express.Router();

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

// GET /api/restaurants - Get all restaurants with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string || '0');
    const lng = parseFloat(req.query.lng as string || '0');
    const tags = req.query.tags ? (req.query.tags as string).split(',') : [];
    const verified = req.query.verified === 'true';
    const maxDistance = parseFloat(req.query.maxDistance as string || '10000'); // in meters, default 10km
    const search = req.query.search as string || '';

    let query: any = {};

    // Tag filter
    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    // Verified filter
    if (verified) {
      query.verified = true;
    }

    // Search filter (name, cuisines, address, tags, description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisines: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let restaurants;

    // If location is provided, use geospatial query
    if (lat && lng && lat !== 0 && lng !== 0) {
      restaurants = await Restaurant.find({
        ...query,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat], // MongoDB uses [lng, lat]
            },
            $maxDistance: maxDistance,
          },
        },
      }).limit(100);
    } else {
      // Otherwise, just get all matching restaurants sorted by rating
      restaurants = await Restaurant.find(query).sort({ rating: -1, verified: -1 }).limit(100);
    }

    // Calculate distance if location is provided
    const restaurantsWithDistance = restaurants.map((restaurant) => {
      const restaurantData = restaurant.toObject();
      
      if (lat && lng && lat !== 0 && lng !== 0) {
        const [restLng, restLat] = restaurant.location.coordinates;
        const distance = calculateDistance(lat, lng, restLat, restLng);
        return {
          ...restaurantData,
          distance: distance, // in kilometers
        };
      }
      
      return restaurantData;
    });

    // Sort by distance if location is provided, otherwise by rating
    if (lat && lng && lat !== 0 && lng !== 0) {
      restaurantsWithDistance.sort((a: any, b: any) => {
        // First by verified status
        if (a.verified !== b.verified) {
          return a.verified ? -1 : 1;
        }
        // Then by distance
        return a.distance - b.distance;
      });
    }

    res.json({ success: true, data: restaurantsWithDistance });
  } catch (error: any) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/restaurants/:id - Get a single restaurant
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    res.json({ success: true, data: restaurant });
  } catch (error: any) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/restaurants - Create a new restaurant
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, image, priceRange, cuisines, tags, address, description, latitude, longitude, features, phone, email, website } = req.body;

    // Validate required fields
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, address, latitude, longitude'
      });
    }

    const restaurant = await Restaurant.create({
      name,
      image: image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
      rating: 0,
      reviewCount: 0,
      priceRange: priceRange || '₹₹',
      cuisines: cuisines || [],
      tags: tags || [],
      address,
      description: description || '',
      location: {
        type: 'Point',
        coordinates: [longitude, latitude], // MongoDB uses [lng, lat]
      },
      features: features || [],
      verified: false,
      phone,
      email,
      website,
    });

    res.status(201).json({ success: true, data: restaurant });
  } catch (error: any) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/restaurants/:id - Update a restaurant
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    res.json({ success: true, data: restaurant });
  } catch (error: any) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/restaurants/:id - Delete a restaurant
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    res.json({ success: true, message: 'Restaurant deleted' });
  } catch (error: any) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

