const db = require('../config/dbConfig');

class UserModel {
  // Récupérer tous les utilisateurs
  static async findAll() {
    const query = `
      SELECT id, first_name, last_name, email, address, phone, role, created_at, is_verified, description
      FROM users
      ORDER BY created_at DESC
    `;

    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer un utilisateur par ID
  static async findById(id) {
    const query = `
      SELECT id, first_name, last_name, email, address, phone, role, created_at, is_verified, description
      FROM users
      WHERE id = $1
    `;

    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Récupérer un utilisateur par email
  static async findByEmail(email) {
    const query = `
      SELECT id, first_name, last_name, email, address, phone, role, created_at, is_verified, description
      FROM users
      WHERE email = $1
    `;

    try {
      const result = await db.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  static async update(id, updateData) {
    const {
      first_name,
      last_name,
      email,
      address,
      phone,
      password_hash,
      description
    } = updateData;

    const query = `
      UPDATE users
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          email = COALESCE($3, email),
          address = COALESCE($4, address),
          phone = COALESCE($5, phone),
          password_hash = COALESCE($6, password_hash),
          description = COALESCE($7, description)
      WHERE id = $8
      RETURNING id, first_name, last_name, email, address, phone, role, created_at, is_verified, description
    `;

    const values = [first_name, last_name, email, address, phone, password_hash, description, id];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Supprimer un utilisateur
  static async delete(id) {
    const query = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id, first_name, last_name, email
    `;

    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createApplication(applicationData) {
    const query = `
      INSERT INTO applications (user_id, job_id, applied_at)
      VALUES ($1, $2, NOW())
      RETURNING id, job_id, user_id, status, applied_at
    `;

    const values = [
      applicationData.user_id,
      applicationData.job_id
    ];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel; 