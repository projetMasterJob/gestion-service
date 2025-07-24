const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

// Routes RUD
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

module.exports = router; 