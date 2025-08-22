const express = require('express');
const UserController = require('../controllers/userController');
const { authenticateToken, authorizeUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes RUD
router.get('/users', authenticateToken, UserController.getAllUsers);
router.get('/users/:id', authenticateToken, authorizeUser, UserController.getUserById);
router.put('/users/:id', authenticateToken, authorizeUser, UserController.updateUser);
router.delete('/users/:id', authenticateToken, authorizeUser, UserController.deleteUser);

module.exports = router;