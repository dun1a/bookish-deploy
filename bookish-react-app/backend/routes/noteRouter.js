const express = require("express");
const router = express.Router();

const {
    getAllNotes,
    createNote,
    getNoteById,
    updateNote,
    deleteNote
} = require("../controllers/notesControllers")

const auth = require('../middleware/auth');

router.use(auth) 
// GET /notes
router.get('/:bookId', getAllNotes)

//POST /notes
router.post('/:bookId', createNote)

// GET /notes/:noteId
router.get('/:bookId/:noteId', getNoteById)

// PUT /notes/:noteId
router.put('/:bookId/:noteId', updateNote)

// DELETE /notes/:noteId
router.delete('/:bookId/:noteId', deleteNote)

module.exports = router;