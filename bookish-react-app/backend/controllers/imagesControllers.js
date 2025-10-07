const Bookshelf = require("../models/bookShelfModel");
const mongoose = require('mongoose');

const getAllImages = async (req,res) => {
    const {bookId} = req.params;
    if(!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({message: "Invalid bookshelf ID"});
    }
    try{
    const book = await Bookshelf.findById(bookId);
    res.status(200).json(book.images);

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to retrieve images"});
    }
};

// POST /images
const createImage = async (req,res) => {
    const {bookId} = req.params;
    console.log('Book id:', bookId);

    if(!mongoose.Types.ObjectId.isValid(bookId)){
        return res.status(400).json({message: "Invalid booksheld ID"});
    }
    try{
        const book = await Bookshelf.findById(bookId);
        console.log(book);
        const newImage = {...req.body};
        book.images.push(newImage);
        console.log(newImage);
        await book.save();
        //console.log(newImage);
        book.imageAmount = book.images.length;
        await book.save();
        res.status(201).json(book.images);
    }catch(err){
        console.error('Error saving image', err);
        res.status(500).json({message: "Failed to create image"});
    }
};

// GET /images/:bookId/:imageId
const getImageById = async (req,res) => {
    const {bookId, imageId} = req.params;
    console.log('Book id:', bookId, 'images id:', imageId);
    
    if(!mongoose.Types.ObjectId.isValid(bookId)){
        return res.status(400).json({message: "Invalid bookshelf ID"})
    }
    if(!mongoose.Types.ObjectId.isValid(imageId)){
        return res.status(400).json({message: "Invalid image"})
    }

    try{
        const book = await Bookshelf.findById(bookId);
        const image = book.images.id(imageId);
        if(image){
            res.status(200).json(image);
        }else{
            res.status(404).json({message: "Image not found"});
        }
    }catch(err){
        console.error('Error saving image', err);
        res.status(500).json({message: "Failed to retrieve images"});
    }
};

// PUT /images/:imageId
const updateImage = async(req,res) => {
    const { bookId, imageId } = req.params;
    console.log('FOR UPDATE', 'bookid:', bookId, 'imagesId:', imageId);

    if(!mongoose.Types.ObjectId.isValid(bookId)){
        return res.status(400).json({message: "Invalid bookshelf ID"});
    }
    if(!mongoose.Types.ObjectId.isValid(imageId)){
        return res.status(400).json({message: "Invalid images ID"});
    }
    try{
        const book = await Bookshelf.findById(bookId);
        const image = book.images.id(imageId);
        const ogUrl = image.url;
        const ogDate = image.date;
        const updatedImage = image.set({...req.body});
        await book.save();

    if(updatedImage.url !== ogUrl || updatedImage.date !== ogDate){
        res.status(200).json(updatedImage);
    }else{
        res.status(404).josn({message: "Could not update image"});
    }

    }catch(err){
        console.log('Error for updating:', err);
        res.status(500).json({message: "Failed to update image"});
    }

};

// DELETE /images/:imageId
const deleteImage = async (req,res) => {
    const {bookId, imageId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(bookId)){
        return res.status(400).json({message: "Invalid vookshelf ID"});
    }
    if(!mongoose.Types.ObjectId.isValid(imageId)){
        return res.status(400).json({message: "Invalid image ID"});
    }

    try{
        const book = await Bookshelf.findById(bookId);
        book.images = book.images.filter(i => i._id.toString() != imageId);
        book.imageAmount = book.images.length;
        await book.save();
        res.json({message: "Image deleted"});

    } catch(err){
        res.status(500).json({err: err.message});
    }
}

module.exports = {
    getAllImages,
    createImage,
    getImageById,
    updateImage,
    deleteImage
};