const Budget = require("../models/Budget.js");
const Transaction = require("../models/Transaction.js")
const setOrUpdateBudget = async (req, res) => {
  console.log(req.body);
  const { category, month, amount } = req.body;

  try {
    const updatedBudget = await Budget.findOneAndUpdate(
      { category, month },
      { amount },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    if (updatedBudget) {
      return res.status(200).json({
        message: "Budget successfully set or updated",
        data: updatedBudget,
      });
    } else {
      return res.status(500).json({ error: "Could not save budget" });
    }
  } catch (error) {
    console.error("Error in setOrUpdateBudget:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const getBudgetsByMonth = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "Month query param is required" });
  }

  try {
    const budgets = await Budget.find({ month });

    return res.status(200).json({ data: budgets });
  } catch (error) {
    console.error("Error in getBudgetsByMonth:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getBudgetComparison = async (req, res) => {
  const { month } = req.query; // Use query instead of body for GET-style access

  if (!month) {
    return res.status(400).json({ error: "Month query param is required" });
  }

  const startDate = new Date(`${month}-01`);
  const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

  try {
    // Step 1: Get all transactions for the month
    const transactions = await Transaction.find({
      date: { $gte: startDate, $lt: endDate }
    });

    // Step 2: Group by category and sum
    const actualSpending = {};
    transactions.forEach(tx => {
      const cat = tx.category;
      actualSpending[cat] = (actualSpending[cat] || 0) + tx.amount;
    });

    // Step 3: Get all budgets for the month
    const budgets = await Budget.find({ month });

    // Step 4: Compare
    const comparison = budgets.map(b => ({
      category: b.category,                                                                                                                                                                                                          
      budgeted: b.amount,
      spent: actualSpending[b.category] || 0
    }));

    let insights=comparison.map((item)=>{
      let {category,budgeted,spent}= item;
      if (spent > budgeted) {
        return `You overspent on ${category} by ₹${spent - budgeted}`;
      } else if (spent < budgeted) {
        return `You stayed under budget on ${category} by ₹${budgeted - spent}`;
      } else {
        return `You perfectly balanced your spending on ${category}`;
      }
  })

    return res.status(200).json({ data: comparison,insights: insights });
  } catch (error) {
    console.error("Error in getBudgetComparison:", error);
    return res.status(500).json({ error: "Internal server error" });
  }


};


module.exports = {
  setOrUpdateBudget,
  getBudgetsByMonth,
  getBudgetComparison
};
