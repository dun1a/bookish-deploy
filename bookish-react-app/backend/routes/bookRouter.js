const express = require("express");

const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteAll
  // patchBook
} = require("../controllers/bookControllers");
const auth = require('../middleware/auth');

router.use(auth) 

// GET /books
router.get("/", getAllBooks);
// POST /books
router.post("/", createBook);
// GET /books/:bookId
router.get("/:bookId", getBookById);
// PUT /books/:bookId
router.put("/:bookId", updateBook);
// DELETE /books/:bookId
//router.delete("/:bookId", deleteBook);
// DELETE ALL 
router.delete("/reset", deleteAll);

module.exports = router;