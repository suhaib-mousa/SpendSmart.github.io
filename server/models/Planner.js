import mongoose from 'mongoose';

const plannerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  monthlyIncome: {
    type: Number,
    required: true
  },
  expenses: {
    charity: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    housing: { type: Number, default: 0 },
    utilities: { type: Number, default: 0 },
    maintenance: { type: Number, default: 0 },
    transportation: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    entertainment: { type: Number, default: 0 },
    debt: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    savings: { type: Number, default: 0 },
    others: { type: Number, default: 0 }
  },
  analysis: {
    totalExpenses: Number,
    remainingIncome: Number,
    savingsRate: Number,
    debtToIncomeRatio: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Planner = mongoose.model('Planner', plannerSchema);

export default Planner;