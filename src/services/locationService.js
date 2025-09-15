const locationModel = require('../models/locationModel');

// Créer une nouvelle location
exports.createLocation = async (locationData) => {
  if (!locationData.entity_type) {
    const err = new Error('"entity_type" est requis');
    err.status = 400; throw err;
  }
  if (!locationData.entity_id) {
    const err = new Error('"entity_id" est requis');
    err.status = 400; throw err;
  }
  if (!locationData.latitude) {
    const err = new Error('"latitude" est requis');
    err.status = 400; throw err;
  }
  if (!locationData.longitude) {
    const err = new Error('"longitude" est requis');
    err.status = 400; throw err;
  }

  const location = await locationModel.createLocation(locationData);
  return location;
};

// Récupérer une location par ID
exports.getLocationById = async (locationId) => {
  if (!locationId) {
    const err = new Error('"locationId" est requis');
    err.status = 400; throw err;
  }

  const location = await locationModel.getLocationById(locationId);
  if (!location) {
    const err = new Error('Location introuvable');
    err.status = 404; throw err;
  }

  return location;
};

// Récupérer une location par entity_type et entity_id
exports.getLocationByEntity = async (entityType, entityId) => {
  if (!entityType) {
    const err = new Error('"entityType" est requis');
    err.status = 400; throw err;
  }
  if (!entityId) {
    const err = new Error('"entityId" est requis');
    err.status = 400; throw err;
  }

  const location = await locationModel.getLocationByEntity(entityType, entityId);
  return location; // Peut être null si pas trouvé
};

// Mettre à jour une location
exports.updateLocation = async (locationId, locationData) => {
  if (!locationId) {
    const err = new Error('"locationId" est requis');
    err.status = 400; throw err;
  }
  if (!locationData || typeof locationData !== 'object') {
    const err = new Error('Données de location invalides');
    err.status = 400; throw err;
  }

  const updated = await locationModel.updateLocation(locationId, locationData);
  if (!updated) {
    const err = new Error('Location introuvable');
    err.status = 404; throw err;
  }

  return updated;
};

// Supprimer une location
exports.deleteLocation = async (locationId) => {
  if (!locationId) {
    const err = new Error('"locationId" est requis');
    err.status = 400; throw err;
  }

  const deleted = await locationModel.deleteLocation(locationId);
  if (!deleted) {
    const err = new Error('Location introuvable');
    err.status = 404; throw err;
  }

  return deleted;
};

// Supprimer une location par entity_type et entity_id
exports.deleteLocationByEntity = async (entityType, entityId) => {
  if (!entityType) {
    const err = new Error('"entityType" est requis');
    err.status = 400; throw err;
  }
  if (!entityId) {
    const err = new Error('"entityId" est requis');
    err.status = 400; throw err;
  }

  const deleted = await locationModel.deleteLocationByEntity(entityType, entityId);
  return deleted; // Peut être null si pas trouvé
};
