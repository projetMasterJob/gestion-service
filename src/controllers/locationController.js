const locationService = require('../services/locationService');

// Créer une nouvelle location
exports.createLocation = async (req, res) => {
  const locationData = req.body;
  try {
    const location = await locationService.createLocation(locationData);
    return res.status(201).json({ message: 'Location créée avec succès', location });
  } catch (error) {
    const status = error.status || (error.message ? 400 : 500);
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

// Récupérer une location par ID
exports.getLocationById = async (req, res) => {
  const { id } = req.params;
  try {
    const location = await locationService.getLocationById(id);
    return res.status(200).json(location);
  } catch (error) {
    const status = error.status || (error.message ? 400 : 500);
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

// Récupérer une location par entity_type et entity_id
exports.getLocationByEntity = async (req, res) => {
  const { entity_type, entity_id } = req.params;
  try {
    const location = await locationService.getLocationByEntity(entity_type, entity_id);
    if (!location) {
      return res.status(404).json({ message: 'Location introuvable' });
    }
    return res.status(200).json(location);
  } catch (error) {
    const status = error.status || (error.message ? 400 : 500);
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

// Mettre à jour une location
exports.updateLocation = async (req, res) => {
  const { id } = req.params;
  const locationData = req.body;
  try {
    const location = await locationService.updateLocation(id, locationData);
    return res.status(200).json({ message: 'Location mise à jour avec succès', location });
  } catch (error) {
    const status = error.status || (error.message ? 400 : 500);
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

// Supprimer une location
exports.deleteLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const location = await locationService.deleteLocation(id);
    return res.status(200).json({ message: 'Location supprimée avec succès', location });
  } catch (error) {
    const status = error.status || (error.message ? 400 : 500);
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};
