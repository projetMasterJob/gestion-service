const UserService = require('../services/userService');

class UserController {

  // Récupérer tous les utilisateurs
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer un utilisateur par ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      if (error.message === 'Utilisateur non trouvé') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // Mettre à jour un utilisateur
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedUser = await UserService.updateUser(id, updateData);
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error.message === 'Utilisateur non trouvé') {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('email existe déjà')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await UserService.deleteUser(id);
      res.status(200).json(deletedUser);
    } catch (error) {
      if (error.message === 'Utilisateur non trouvé') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async createApplication(req, res) {
    try {
      const applicationData = req.body;
      const newApplication = await UserService.createApplication(applicationData);
      res.status(201).json(newApplication);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = UserController; 