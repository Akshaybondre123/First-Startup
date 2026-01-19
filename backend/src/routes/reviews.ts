import express, { Request, Response } from 'express';
import Review from '../models/Review';
import Restaurant from '../models/Restaurant';

const router = express.Router();

// POST /api/reviews - Create a new review
router.post('/', async (req: Request, res: Response) => {
  try {
    const { restaurantId, userName, userEmail, rating, comment } = req.body;

    // Validate required fields
    if (!restaurantId || !userName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: restaurantId, userName, rating, comment'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    // Create review
    const review = await Review.create({
      restaurantId,
      userName,
      userEmail,
      rating,
      comment,
    });

    // Calculate new average rating
    const reviews = await Review.find({ restaurantId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

    // Update restaurant rating
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: averageRating,
      reviewCount: reviews.length,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/reviews/:restaurantId - Get all reviews for a restaurant
router.get('/:restaurantId', async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ restaurantId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ restaurantId });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

