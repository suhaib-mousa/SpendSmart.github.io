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
  
  const stats = await Review.aggregate([
    {
      $match: { deal: dealId }
    },
    {
      $group: {
        _id: '$deal',
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Deal').findByIdAndUpdate(dealId, {
      rating: Math.round(stats[0].avgRating * 10) / 10
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;