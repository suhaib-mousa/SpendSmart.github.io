import express from 'express';
import Planner from '../models/Planner.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all planner entries for a user
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Planner.find({ user: req.user.id })
      .sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new planner entry
router.post('/', auth, async (req, res) => {
  try {
    const { monthlyIncome, expenses } = req.body;

    // Calculate analysis
    const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + value, 0);
    const remainingIncome = monthlyIncome - totalExpenses;
    const savingsRate = (expenses.savings / monthlyIncome) * 100;
    const debtToIncomeRatio = (expenses.debt / monthlyIncome) * 100;

    const planner = new Planner({
      user: req.user.id,
      monthlyIncome,
      expenses,
      analysis: {
        totalExpenses,
        remainingIncome,
        savingsRate,
        debtToIncomeRatio
      }
    });

    const savedPlanner = await planner.save();
    res.status(201).json(savedPlanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;