const express = require("express");
const router = express.Router();

// IMPORTANT: exact casing + correct relative path
const { generateSearchText } = require("../controllers/bookRecsControllers");

// If you want a log, do it INSIDE the handler
router.post("/generate", (req, res, next) => {
  console.log("➡️  /api/search/generate hit", req.body);
  next();
}, generateSearchText);

module.exports = router;
