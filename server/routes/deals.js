import express from 'express';
import Deal from '../models/Deal.js';
import mongoose from 'mongoose';
import Category from '../models/Category.js';

const router = express.Router();

// Get all deals
// Get all deals with optional category filter
router.get('/', async (req, res) => {
  try {
    const { category } = req.query; // category can be name or ID
    let filter = {};

    if (category) {
      //  إذا المستخدم أرسل اسم الكاتيجوري بدل الـ ID           هاي عملتها عشان ازبط الداتابيس كان ما بنادي زي ما بدي  
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else if (mongoose.Types.ObjectId.isValid(category)) {
        // أو يمكن أرسل ID مباشرة
        filter.category = category;
      } else {
        return res.status(400).json({ message: 'Invalid category filter' });
      }
    }

    const deals = await Deal.find(filter)
      .populate('category')
      .sort({ createdAt: -1 });

    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get a single deal
router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).populate('category');
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new deal
router.post('/', async (req, res) => {
  const deal = new Deal(req.body);
  try {
    const newDeal = await deal.save();
    res.status(201).json(newDeal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a deal
router.patch('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    Object.assign(deal, req.body);
    const updatedDeal = await deal.save();
    res.json(updatedDeal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a deal
router.delete('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    await deal.deleteOne();
    res.json({ message: 'Deal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;