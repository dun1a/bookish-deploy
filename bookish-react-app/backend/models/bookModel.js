const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    booktheme: {
        type: String,
        required: true
    },
    published : {type: Number, required: true},
    genre: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Book", bookSchema, "bookish-books");