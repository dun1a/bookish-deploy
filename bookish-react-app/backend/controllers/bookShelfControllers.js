const Bookshelf = require('../models/bookShelfModel');
const mongoose = require('mongoose');

// GET /api/bookshelf
const getAllBookshelfs = async (_req, res) => {
    try {
        const bookshelfs = await Bookshelf.find({});
        res.status(200).json(bookshelfs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to retrieve bookshelf books" });
    }
};

// POST /api/bookshelf  (duplicate-safe)
const createBookshelf = async (req, res) => {
    try {
        const title = (req.body.title || "").trim();
        const author = (req.body.author || "").trim();
        if (!title) return res.status(400).json({ message: "Title is required" });

        const exists = await Bookshelf
            .findOne({ title, author })
            .collation({ locale: "en", strength: 2 });

        if (exists) {
            return res.status(409).json({ message: "Book already exists in your shelf" });
        }

        const newBookshelf = await Bookshelf.create({ ...req.body, title, author });
        return res.status(201).json(newBookshelf);
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: "Book already exists in your shelf" });
        }
        res.status(400).json({ message: "Failed to create bookshelf book" });
    }
};

// GET /api/bookshelf/:bookshelfId
const getBookshelfById = async (req, res) => {
    const { bookshelfId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookshelfId)) {
        return res.status(400).json({ message: "Invalid bookshelf book ID" });
    }
    try {
        const bookshelf = await Bookshelf.findById(bookshelfId);
        if (bookshelf) return res.status(200).json(bookshelf);
        return res.status(404).json({ message: "Bookshelf book not found" });
    } catch (err) {
        res.status(500).json({ message: "Failed to retrieve bookshelf book" });
    }
};

// PUT /api/bookshelf/:bookshelfId
// PUT /api/bookshelf/:bookshelfId
const updateBookshelf = async (req, res) => {
    const { bookshelfId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookshelfId)) {
        return res.status(400).json({ message: "Invalid bookshelf book ID" });
    }
    try {
        const updatedBookshelf = await Bookshelf.findOneAndUpdate(
            { _id: bookshelfId },
            { $set: req.body },                // ← only set what came in
            { new: true, runValidators: true } // ← keep validators on
        );
        if (updatedBookshelf) return res.status(200).json(updatedBookshelf);
        return res.status(404).json({ message: "Bookshelf book not found" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update bookshelf book" });
    }
};


// DELETE /api/bookshelf/:bookshelfId
const deleteBookshelf = async (req, res) => {
    const { bookshelfId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookshelfId)) {
        return res.status(400).json({ message: "Invalid bookshelf book ID" });
    }
    try {
        const deletedBookshelf = await Bookshelf.findOneAndDelete({ _id: bookshelfId });
        if (deletedBookshelf) return res.status(200).json({ message: "Bookshelf book deleted successfully" });
        return res.status(404).json({ message: "Bookshelf book not found" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete bookshelf book" });
    }
};

module.exports = {
    getAllBookshelfs,
    createBookshelf,
    getBookshelfById,
    updateBookshelf,
    deleteBookshelf
};