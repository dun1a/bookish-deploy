// const mongoose = require("mongoose");

// const bookShelfSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     author: { type: String, default: "Unknown" },
//     description: { type: String, default: "" },
//     booktheme: { type: String, default: "" },
//     genre: { type: String, default: "" },
//     published: { type: Number },
//     status: { type: String, enum: ["TBR", "Reading", "Read"], default: "TBR", required: true },
//     notes: { type: [String], default: [] },
//     images: { type: [String], default: [] },
// });

// // case-insensitive unique on (title, author)
// bookShelfSchema.index(
//     { title: 1, author: 1 },
//     { unique: true, collation: { locale: "en", strength: 2 } }
// );

// // ✅ Guard against OverwriteModelError on hot reloads
// const Bookshelf =
//     mongoose.models.Bookshelf || mongoose.model("Bookshelf", bookShelfSchema);

// module.exports = Bookshelf;

// models/bookShelfModel.js
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        text: { type: String, required: true },
        date: { type: Date, default: Date.now },
        page: { type: Number },
    },
    { _id: true, timestamps: true } // gives each note its own _id
);

const imageSchema = new mongoose.Schema(
    {
        src: { type: String, required: true },
        name: { type: String, default: "" },
    },
    { _id: true }
);

const bookShelfSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    booktheme: { type: String, required: true },
    genre: { type: String, required: true },
    published: { type: Number, required: true },
    status: { type: String, enum: ["TBR", "Reading", "Read"], default: "TBR", required: true },
    notes: { type: [noteSchema], required: true },
    images: { type: [imageSchema], required: true },
    rating: {
                stars: {
                    type: Number,
                    enum: [0, 1, 2, 3, 4, 5],
                    required: false,
                    default: 0
                },
                review: {
                    type: String,
                    required: false,
                    default: 'default'
                }
            },

    // optional, since your controller references it
    noteAmount: { type: Number, default: 0 },
});

// case-insensitive unique on (title, author)
bookShelfSchema.index(
    { title: 1, author: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.models.Bookshelf || mongoose.model("Bookshelf", bookShelfSchema);
// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const bookshelfSchema = new Schema(
//     {
//         title: {
//             type: String,
//             required: true
//         },
//         author: {
//             type: String,
//             required: true
//         },
//         published: { type: Number, required: true },
//         genre: { type: String, required: true },
//         notes: [
//             {
//                 text: { type: String, required: true },
//                 date: { type: Date, required: true },
//                 page: { type: String, required: false }
//             }
//         ],
//         noteAmount: { type: Number, default: 0 },
//         images: [
//             {
//                 url: { type: String, required: true },
//                 date: { type: Date, required: true }
//             }
//         ],
//         imageAmount: { type: Number, default: 0 },
//         rating: {
//             stars: {
//                 type: Number,
//                 //enum: [0, 1, 2, 3, 4, 5],
//                 required: false,
//                 default: 0
//             },
//             review: {
//                 type: String,
//                 required: false,
//                 default: 'default'
//             }
//         },
//         status: {
//             type: String,
//             enum: ['tbr', 'reading', 'read'],
//             default: 'tbr'
//         }

//     }, { timestamps: true });

// module.exports = mongoose.model("Bookshelf", bookshelfSchema, "bookish-bookshelf");
// I think this is the previous schema you guys are talking about