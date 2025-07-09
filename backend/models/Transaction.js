const mongoose = require('mongoose');

const TransactionModel = new mongoose.Schema({
  amount: {
    type: Number,            
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,              
    required: true
  },
  description: String
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionModel);
