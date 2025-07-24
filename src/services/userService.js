const UserModel = require('../models/userModel');

class UserService {
  // Récupérer tous les utilisateurs
  static async getAllUsers() {
    try {
      const users = await UserModel.findAll();
      return users;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer un utilisateur par ID
  static async getUserById(id) {
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  static async updateUser(id, updateData) {
    try {
      // Vérifier si l'utilisateur existe
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        throw new Error('Utilisateur non trouvé');
      }

      // Filtrer seulement les champs modifiables
      const allowedFields = ['first_name', 'last_name', 'email', 'address', 'phone', 'password', 'description'];
      const filteredData = {};
      
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          if (field === 'password') {
            // Hasher le mot de passe si fourni
            const bcrypt = require('bcryptjs');
            const saltRounds = 10;
            filteredData.password_hash = await bcrypt.hash(updateData[field], saltRounds);
          } else {
            filteredData[field] = updateData[field];
          }
        }
      }

      // Si l'email est modifié, vérifier qu'il n'existe pas déjà
      if (filteredData.email && filteredData.email !== existingUser.email) {
        const userWithEmail = await UserModel.findByEmail(filteredData.email);
        if (userWithEmail && userWithEmail.id !== id) {
          throw new Error('Un utilisateur avec cet email existe déjà');
        }
      }

      const updatedUser = await UserModel.update(id, filteredData);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(id) {
    try {
      const deletedUser = await UserModel.delete(id);
      if (!deletedUser) {
        throw new Error('Utilisateur non trouvé');
      }
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService; 