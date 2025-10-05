const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt'); // for hashing password
const validator = require('validator');


//const secret = '1c6a6fce11212a208f8245aea268e73e'
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'});
}

// GET /users
const getAllUsers = async (req,res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error){
        res.status(500).json({message: "Failed to retrieve users"});
    }
};

// POST /uars
// const createUser = async (req, res) => {
//     try {
//     const newUser = await User.create({...req.body})
//     res.status(201).json(newUser);
//     } catch (error) {
//         res.status(400).json({message: "Failed to create user", error: error.message})
//     }
// };


// signUp function
const signUp = async (req,res) => {
    const {name, email, username, password} = req.body;

    try{
        if(!name || !email || !username || !password) {
            throw Error('All fields must be filled');
        }

        if(!validator.isEmail(email)){
            throw Error('Email not valid');
        }
        if(!validator.isStrongPassword(password)){
            throw Error('Password not strong enough');
        }

        const existsEmail = await User.findOne({email})
        if(existsEmail){
            throw Error('Email already in use');
        }

        const existsUserName = await User.findOne({username});
        if(existsUserName){
            throw Error('Username already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({email, username, password: hashedPassword, name});
        const token = createToken(user._id);
        res.status(201).json({username, token});
    }catch(err){
        res.status(400).json({err: err.message});
    }
}

// const createUser = async (req, res) => {
//     try {
//         // destructuring password and the rest of user datas
//         const {password, ...userData} = req.body;
//         // hashing the password
//         const hashedPassword = await bcrypt.hash(password, 10);
//         // creating user with the hashed password
//         const newUser = await User.create({...userData, password: hashedPassword})
//         res.status(201).json(newUser);
//     } catch (error) {
//         res.status(400).json({message: "Failed to create user", error: error.message})
//     }
// };

// logIn function
const logIn =  async (req,res) => {
    const {username, password} = req.body; // or email also
    try{
        if(!username || !password){
            throw Error('All fields must be filled');
        }

        const user = await User.findOne({username}); // or email
        if(!user) {
            throw Error('Incorrect email');
        }

        // comparing plain text password to the hashed one
        const match = await bcrypt.compare(password, user.password); 
        if(!match) {
            throw Error('Incorrect password');
        }

        const token = createToken(user._id);
        console.log(token);
        res.status(200).json({username, token});
    }catch(err){
        res.status(400).json({err: err.message});
    }
} 


// GET /users/:userId
const getUserById = async (req,res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    try {
        const user  = await User.findById(userId);
        if (user) {
        res.status(200).json(user);
        } else {
        res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({message: "Failed to retrieve user"});
    }
};

 // PUT /users/:userId
const updateUser = async (req,res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    try{

    const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { ...req.body },
    { new: true }
    );
    
    if(updatedUser) {
        res.status(204).json(updatedUser);
    } else {
        res.status(404).json({ message: "User not found" });
    }
    } catch(error){
        res.status(500).json({message: "Failed to update User"})
    }
};

// DELETE /users/:userId
const deleteUser = async (req,res) => {
    const {userId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    try{

        const deletedUser = await User.findOneAndDelete({_id: userId});
        if(deletedUser){
            res.status(200).json({message: "User deleted successfully"});
        } else{
            res.status(404).json({message: "User not found"});
        }
    } catch(error){
        res.status(500).json({message: "Failed to delete user"})
    }
       
 };

 module.exports = {
    getAllUsers,
    signUp,
    logIn,
    getUserById,
    updateUser,
    deleteUser,
};