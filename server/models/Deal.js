import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currentPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isNew: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate discount percentage before saving
dealSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate discount percentage
  const discountAmount = this.originalPrice - this.currentPrice;
  const discountPercentage = (discountAmount / this.originalPrice) * 100;
  this.discount = `${Math.round(discountPercentage)}%`;
  
  next();
});

const Deal = mongoose.model('Deal', dealSchema);

export default Deal;