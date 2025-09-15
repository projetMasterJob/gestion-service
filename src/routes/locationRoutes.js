const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const middleware = require('../middleware/authMiddleware');

// Routes CRUD pour les locations

// Créer une nouvelle location
router.post('/', middleware.authenticateToken, locationController.createLocation);

// Récupérer une location par ID
router.get('/:id', middleware.authenticateToken, locationController.getLocationById);

// Récupérer une location par entity_type et entity_id
router.get('/entity/:entity_type/:entity_id', middleware.authenticateToken, locationController.getLocationByEntity);

// Mettre à jour une location
router.put('/:id', middleware.authenticateToken, locationController.updateLocation);

// Supprimer une location
router.delete('/:id', middleware.authenticateToken, locationController.deleteLocation);

module.exports = router;
