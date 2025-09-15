// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authmiddleware');

router.use(protect); 

router.get('/', getAllUsers);

router
  .route('/:id')
  .get(isAdmin, getUser) 
  .put(isAdmin, updateUser) 
  .delete(isAdmin, deleteUser); 
module.exports = router;