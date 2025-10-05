const { generateBookRecs, generateSearch } = require("../services/bookRecs");
const Book = require('../models/bookModel');

// GENERATE BOOK RECS (kept as before — inserts valid recs)
const generateBookRecsText = async (req, res) => {
  try {
    const { title, author, rating } = req.body;
    if (!title || !author || !rating) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const markdownResponse = await generateBookRecs(title, author, rating);
    const jsonMatch = markdownResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) return res.status(500).json({ error: "Invalid response format. No JSON found." });

    let bookRecs;
    try { bookRecs = JSON.parse(jsonMatch[1]); }
    catch { return res.status(500).json({ error: "Error parsing JSON response." }); }

    const validRecs = bookRecs.filter(
      rec => rec.title && rec.author && rec.description && rec.booktheme && rec.published && rec.genre
    );

    if (validRecs.length === 0) {
      return res.status(400).json({ error: "AI did not return valid book recommendations." });
    }

    const savedBooks = await Book.insertMany(validRecs);
    return res.status(201).json(savedBooks);
  } catch (err) {
    console.error("Error in bookrecs generation:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// GENERATE SEARCHBAR RECS (returns list only)
const generateSearchText = async (req, res) => {
  try {
    const { genre, pageAmount, yearPublished } = req.body;
    if (!genre || !pageAmount || !yearPublished) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const markdownResponse = await generateSearch(genre, pageAmount, yearPublished);
    const jsonMatch = markdownResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) return res.status(500).json({ error: "Invalid response format. No JSON found." });

    let searchRecs;
    try { searchRecs = JSON.parse(jsonMatch[1]); }
    catch { return res.status(500).json({ error: "Error parsing JSON response." }); }

    return res.status(200).json(Array.isArray(searchRecs) ? searchRecs : []);
  } catch (err) {
    console.error("Error in searchbar recs generation:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = {
  generateBookRecsText,
  generateSearchText,
};
