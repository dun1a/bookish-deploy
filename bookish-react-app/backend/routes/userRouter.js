const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    signUp,
    logIn,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userControllers');
const auth = require('../middleware/auth');

//router.post('/', createUser);

// login route
router.post("/login", logIn);
  
// signup route
router.post("/signup", signUp);

//router.use(auth) 

// Get all users
router.get('/', getAllUsers);
// Get user
router.get('/:userId', getUserById);
// Update user
router.put('/:userId', updateUser);
// Delete user
router.delete('/:userId', deleteUser);

module.exports = router;