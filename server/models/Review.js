import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  deal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Update deal rating when a review is added or modified
reviewSchema.post('save', async function() {
  const Review = this.constructor;
  const dealId = this.deal;
  
  try {
    const stats = await Review.aggregate([
      {
        $match: { deal: dealId }
      },
      {
        $group: {
          _id: '$deal',
          avgRating: { $avg: '$rating' },
          numReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await mongoose.model('Deal').findByIdAndUpdate(dealId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        numReviews: stats[0].numReviews
      });
    }
  } catch (error) {
    console.error('Error updating deal rating:', error);
  }
});

// Also update rating when a review is deleted
reviewSchema.post('remove', async function() {
  const Review = this.constructor;
  const dealId = this.deal;
  
  try {
    const stats = await Review.aggregate([
      {
        $match: { deal: dealId }
      },
      {
        $group: {
          _id: '$deal',
          avgRating: { $avg: '$rating' },
          numReviews: { $sum: 1 }
        }
      }
    ]);

    const update = stats.length > 0 
      ? {
          rating: Math.round(stats[0].avgRating * 10) / 10,
          numReviews: stats[0].numReviews
        }
      : {
          rating: 0,
          numReviews: 0
        };

    await mongoose.model('Deal').findByIdAndUpdate(dealId, update);
  } catch (error) {
    console.error('Error updating deal rating after review deletion:', error);
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;