const pool = require('../config/dbConfig');

// Créer une nouvelle location
exports.createLocation = async (locationData) => {
  const { entity_type, entity_id, latitude, longitude, address, cp } = locationData;
  const query = `
    INSERT INTO locations (entity_type, entity_id, latitude, longitude, address, cp, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
    RETURNING *
  `;
  const values = [entity_type, entity_id, latitude, longitude, address, cp];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Récupérer une location par ID
exports.getLocationById = async (locationId) => {
  const query = `SELECT * FROM locations WHERE id = $1`;
  const result = await pool.query(query, [locationId]);
  return result.rows[0];
};

// Récupérer une location par entity_type et entity_id
exports.getLocationByEntity = async (entityType, entityId) => {
  const query = `SELECT * FROM locations WHERE entity_type = $1 AND entity_id = $2`;
  const result = await pool.query(query, [entityType, entityId]);
  return result.rows[0];
};

// Mettre à jour une location
exports.updateLocation = async (locationId, locationData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  // Construire dynamiquement la requête UPDATE
  Object.keys(locationData).forEach(key => {
    if (locationData[key] !== undefined && locationData[key] !== null) {
      fields.push(`${key} = $${paramCount}`);
      values.push(locationData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    throw new Error('Aucune donnée à mettre à jour');
  }

  values.push(locationId); // ID en dernier paramètre
  const query = `UPDATE locations SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Supprimer une location
exports.deleteLocation = async (locationId) => {
  const query = `DELETE FROM locations WHERE id = $1 RETURNING *`;
  const result = await pool.query(query, [locationId]);
  return result.rows[0];
};

// Supprimer une location par entity_type et entity_id
exports.deleteLocationByEntity = async (entityType, entityId) => {
  const query = `DELETE FROM locations WHERE entity_type = $1 AND entity_id = $2 RETURNING *`;
  const result = await pool.query(query, [entityType, entityId]);
  return result.rows[0];
};
