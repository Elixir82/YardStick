const express=require('express');
const router=express.Router();
const {setOrUpdateBudget,getBudgetsByMonth,getBudgetComparison}=require('../controllers/budgetController.js');
router.post('/budgets', setOrUpdateBudget);
router.get('/budgets',getBudgetsByMonth);
router.get('/comparison',getBudgetComparison);

module.exports=router;