const express = require("express");
const router = express.Router();
const { addTransaction,getTransactionsByMonth } = require("../controllers/transactionController");

router.post("/transactions", addTransaction);
router.get("/transactions", getTransactionsByMonth)
module.exports = router;
