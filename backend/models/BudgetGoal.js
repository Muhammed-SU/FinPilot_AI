const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  targetAmount: Number,
  currentAmount: { type: Number, default: 0 },
  targetDate: Date,
  category: String,
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  status: { type: String, enum: ['active', 'completed', 'paused', 'cancelled'], default: 'active' },
  color: String,
  isRecurring: Boolean,
  recurringPeriod: { type: String, enum: ['weekly', 'monthly', 'quarterly', 'yearly'] },
}, { timestamps: true });

module.exports = mongoose.model('BudgetGoal', goalSchema);
