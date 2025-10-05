const Bookshelf = require('../models/bookShelfModel');
const mongoose = require('mongoose');

// Get bookshelfs/notes/:bookId

const getAllNotes = async (req, res) => {
    const {bookId} = req.params
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ message: "Invalid bookshelf ID" });
    }
    //console.log(bookId)
    try{
        const book = await Bookshelf.findById(bookId);
        //console.log(book)
        res.status(200).json(book.notes); 
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Failed to retrieve notes"});
    }
};

// POST /bookshelfs/notes/:bookId

const createNote = async (req,res) => {
    const {bookId} = req.params
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ message: "Invalid bookshelf ID" });
    }
    //const note = {...req.body}
    
    try {
        const book = await Bookshelf.findById(bookId);
        const newNote = {...req.body};
        book.notes.push(newNote); 
        await book.save(); 
        book.noteAmount = book.notes.length
        await book.save(); 
        res.status(201).json(book.notes);
    } catch(err) {
        res.status(500).json({message: "Failed to create note"});
    }

};

// GET /notes/:bookId/:noteId
const getNoteById = async (req,res) => {
    const {bookId, noteId} = req.params;
    console.log("Book id: ", bookId, "noteId: ", noteId)

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ message: "Invalid bookshelf ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }
    try{
        const book = await Bookshelf.findById(bookId);
        const note = book.notes.id(noteId); 
        //const data = await note.json()
        if(note) {
            res.status(200).json(note);
        } else {
            res.status(404).json({message: "Note not found"});
        }
    }catch(err) {
        res.status(500).json({message: "Failed to retrieve note"});
    }
};


// PUT /notes/:bookId/:noteId

const updateNote = async (req, res) => {
    
  const { bookId, noteId } = req.params;

 // console.log("Book id: ", bookId, "noteId: ", noteId)

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: "Invalid bookshelf ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({ message: "Invalid note ID" });
  }

try {
    const book = await Bookshelf.findById(bookId)
    const note = book.notes.id(noteId)
    const ogText = note.text
    const ogDate = note.date
    const ogPage = note.page
    const updatedNote = note.set({...req.body})
    await book.save();

  if (updatedNote.text !== ogText || updatedNote.date !== ogDate || updatedNote.page !== ogPage) {
    res.status(200).json(updatedNote);
  } else {
    res.status(404).json({ message: "Could not update note" });
  }
} catch (error) {
    res.status(500).json({message: "Failed to update note"})
}
};

// Delete /notes/:noteId
const deleteNote = async (req,res) => {
    const { bookId, noteId } = req.params;

 // console.log("Book id: ", bookId, "noteId: ", noteId)

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: "Invalid bookshelf ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({ message: "Invalid note ID" });
  }
    try{
        const book = await Bookshelf.findById(bookId)
        book.notes = book.notes.filter(n => n._id.toString() !== noteId);
        book.noteAmount = book.notes.length;
    
        await book.save();
        res.json({ message: 'Note deleted' });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
};

module.exports = {
    getAllNotes,
    createNote,
    getNoteById,
    updateNote,
    deleteNote
};