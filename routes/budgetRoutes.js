const express = require("express");
const { generateBudget } = require("../controllers/budgetController");
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/generate", protect, generateBudget);

module.exports = router;
