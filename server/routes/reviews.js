import express from 'express';
import Review from '../models/Review.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all reviews for a deal
router.get('/deal/:dealId', async (req, res) => {
  try {
    const reviews = await Review.find({ deal: req.params.dealId })
      .sort({ date: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's review for a deal
router.get('/user/:dealId', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      deal: req.params.dealId,
      user: req.user.id
    });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update a review
router.post('/', auth, async (req, res) => {
  try {
    const { deal, rating, comment } = req.body;
    
    // Find existing review
    let review = await Review.findOne({ deal, user: req.user.id });
    
    if (review) {
      // Update existing review
      review.rating = rating;
      review.comment = comment;
      review.date = Date.now();
    } else {
      // Create new review with user reference
      review = new Review({
        deal,
        user: req.user.id,
        name: `${req.user.firstName} ${req.user.lastName}`,
        rating,
        comment
      });
    }

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      res.status(400).json({ message: 'You have already reviewed this deal' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Update a review
router.patch('/:id', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    review.rating = rating;
    review.comment = comment;
    review.date = Date.now();

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;