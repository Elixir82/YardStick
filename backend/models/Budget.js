const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,       
    trim: true
  },
  month: {
    type: String,
    required: true,       
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be positive']
  }
}, {
  timestamps: true        
});

module.exports = mongoose.model('Budget', BudgetSchema);
