const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;

const userSchema = new Schema (
    {
    name: { 
        type: String, 
        required: true
    },
    username: {
        type: String, 
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    },
    address: {
        type: String,
         required: false 
    },
    profilePic: {
         type: String, 
         required: false 
        },
    areaCode: {
        type: Number,
        required: false
    }
    },
    { timestamps: true }
);

// static signup method
// userSchema.statics.signup = async function(name, username, email, password) {
//     if(!name || !username || !email || !password){
//         throw Error("All field required");
//     }
//     if(!validator.isEmail(email)){
//         throw Error('Email is not valid');
//     }
//     if(!validator.isStrongPassword(password)){
//         throw Error('Password not strong enough');
//     }

//     const existsEmail = await this.findOne({email});
//     if(existsEmail){
//         throw Error('Email already in use');
//     }

//     const existsUsername = await this.findOne({username});
//     if(existsUsername){
//         throw Error('Username already in use');
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
    
// }


module.exports = mongoose.model('User', userSchema, "bookish-users");