const Book = require('../models/bookModel');
const mongoose = require('mongoose');


// GET /books
const getAllBooks = async (req, res) => {
  try {
        const books = await Book.find({})
        res.status(200).json(books)
   } catch (error) {
    console.error(error);
        res.status(500).json({message: "Failed to retrieve books"});
    }
};

// POST /books
const createBook = async (req, res) => {
    try {
        const newBook = await Book.create({...req.body});
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({message: "Failed to create book"})
    }
};

// GET /books/:bookId
const getBookById = async (req, res) => {
    const {bookId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

    try {
        const book = await Book.findById(bookId);
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({message: "Book not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Failed to find book"})
    }
}

// PUT /books/:bookId
const updateBook = async (req, res) => {
  const { bookId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

try {
  const updatedBook = await Book.findOneAndUpdate(
    { _id: bookId },
    { ...req.body },
    { new: true }
  );
  if (updatedBook) {
    res.status(200).json(updatedBook);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
} catch (error) {
    res.status(500).json({message: "Failed to update book"})
}
};

// // DELETE /books/:bookId
// const deleteBook = async (req, res) => {
//   const { bookId } = req.params;


//   if (!mongoose.Types.ObjectId.isValid(bookId)) {
//     return res.status(400).json({ message: "Invalid book ID" });
//   }
//     try {
//     const deletedBook = await Book.findOneAndDelete({ _id: bookId });
//     if (deletedBook) {
//         res.status(200).json({ message: "Book deleted successfully" });
//     } else {
//         res.status(404).json({ message: "Book not found" });
//     }
//     } catch (error) {
//         res.status(500).json({message: "Failed to update book"})
//     }
// };

const deleteAll = async  (req,res) => {
  try{
    const isDeleted = await Book.deleteMany({});
    if(isDeleted){
      res.status(200).json({message: 'Books deleted, database reset!'});
    } else{
      res.status(400).json({message: "Error occured while resetting"});

    }
  }catch(err){
    res.status(500).json({message: 'Failed to delete books and reset database'});
  }
}

module.exports = {
    getAllBooks,
    createBook,
    getBookById,
    updateBook,
    //deleteBook,
    deleteAll
}