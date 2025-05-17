import express from 'express';
import Budget from '../models/Budget.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user's budget history
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id })
      .sort({ date: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save new budget analysis
router.post('/', auth, async (req, res) => {
  try {
    const { name, totalIncome, savingsGoal, expenses } = req.body;

    // Calculate analysis
    const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + value, 0);
    const remainingMoney = totalIncome - totalExpenses;
    const savingsComparison = remainingMoney - savingsGoal;

    const budget = new Budget({
      user: req.user.id,
      name,
      totalIncome,
      savingsGoal,
      expenses,
      analysis: {
        totalExpenses,
        remainingMoney,
        savingsComparison
      }
    });

    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;