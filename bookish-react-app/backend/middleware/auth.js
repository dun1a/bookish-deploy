const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// const secret = '1c6a6fce11212a208f8245aea268e73e';

const auth = async (req,res, next) => {
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({err: 'Authorization token required'});
    }

    const token = authorization.split(' ')[1];
    console.log(token)
    try{
        const {_id} = jwt.verify(token, process.env.SECRET);
        req.user = await User.findOne({_id}).select('_id');
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({err: 'Request is not authorized'});
    }

}

module.exports = auth;