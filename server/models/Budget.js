import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  totalIncome: {
    type: Number,
    required: true
  },
  savingsGoal: {
    type: Number,
    required: true
  },
  expenses: {
    housing: Number,
    transportation: Number,
    food: Number,
    utilities: Number,
    healthcare: Number,
    education: Number,
    entertainment: Number,
    debt: Number,
    other: Number
  },
  analysis: {
    totalExpenses: Number,
    remainingMoney: Number,
    savingsComparison: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;