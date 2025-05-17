import express from 'express';
import Tip from '../models/Tip.js';

const router = express.Router();

// Get all tips
router.get('/', async (req, res) => {
  try {
    const tips = await Tip.find().sort({ order: 1, createdAt: -1 });
    res.json(tips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new tip
router.post('/', async (req, res) => {
  try {
    const tip = new Tip(req.body);
    const newTip = await tip.save();
    res.status(201).json(newTip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;