const Transaction = require("../models/Transaction");

const addTransaction = async (req, res) => {
  const { amount, category, date, description } = req.body;

  if (!amount || !category || !date) {
    return res.status(400).json({ error: "Amount, category, and date are required." });
  }

  try {
    const tx = await Transaction.create({
      amount,
      category,
      date,
      description,
    });

    res.status(201).json({ message: "Transaction saved", data: tx });
  } catch (err) {
    console.error("Error saving transaction:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTransactionsByMonth = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "Month query param is required" });
  }

  const startDate = new Date(`${month}-01`);
  const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

  try {
    const transactions = await Transaction.find({
      date: { $gte: startDate, $lt: endDate },
    });

    return res.status(200).json({ data: transactions });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addTransaction,
  getTransactionsByMonth, // 👈 export this too
};

