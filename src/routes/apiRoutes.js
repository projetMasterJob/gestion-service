const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Route pour l'inscription
router.post('/', apiController.register);

module.exports = router;