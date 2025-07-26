const UserService = require('../../src/services/userService');

jest.mock('../../src/models/userModel');
const UserModel = require('../../src/models/userModel');

jest.mock('bcryptjs');
const bcrypt = require('bcryptjs');

// Tests de couverture pour le service utilisateur
describe('UserService - Tests de Couverture', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('devrait retourner tous les utilisateurs', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', name: 'User 1' },
        { id: '2', email: 'user2@example.com', name: 'User 2' }
      ];
      
      UserModel.findAll.mockResolvedValue(mockUsers);

      const result = await UserService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(UserModel.findAll).toHaveBeenCalledTimes(1);
    });

    it('devrait propager les erreurs du modèle', async () => {
      const error = new Error('Erreur de base de données');
      UserModel.findAll.mockRejectedValue(error);

      await expect(UserService.getAllUsers()).rejects.toThrow('Erreur de base de données');
    });
  });

  describe('getUserById', () => {
    it('devrait retourner un utilisateur par ID', async () => {
      const mockUser = { id: '1', email: 'user1@example.com', name: 'User 1' };
      UserModel.findById.mockResolvedValue(mockUser);

      const result = await UserService.getUserById('1');

      expect(result).toEqual(mockUser);
      expect(UserModel.findById).toHaveBeenCalledWith('1');
    });

    it('devrait lever une erreur si l\'utilisateur n\'existe pas', async () => {
      UserModel.findById.mockResolvedValue(null);

      await expect(UserService.getUserById('999')).rejects.toThrow('Utilisateur non trouvé');
    });

    it('devrait propager les erreurs du modèle', async () => {
      const error = new Error('Erreur de base de données');
      UserModel.findById.mockRejectedValue(error);

      await expect(UserService.getUserById('1')).rejects.toThrow('Erreur de base de données');
    });
  });

  describe('updateUser', () => {
    it('devrait mettre à jour un utilisateur avec succès', async () => {
      const existingUser = { id: '1', email: 'old@example.com', first_name: 'Old Name' };
      const updatedUser = { id: '1', email: 'new@example.com', first_name: 'New Name' };
      
      UserModel.findById.mockResolvedValue(existingUser);
      UserModel.update.mockResolvedValue(updatedUser);
      bcrypt.hash.mockResolvedValue('hashed_password');

      const updateData = { first_name: 'New Name', email: 'new@example.com' };
      const result = await UserService.updateUser('1', updateData);

      expect(result).toEqual(updatedUser);
      expect(UserModel.findById).toHaveBeenCalledWith('1');
      expect(UserModel.update).toHaveBeenCalledWith('1', {
        first_name: 'New Name',
        email: 'new@example.com'
      });
    });

    it('devrait hasher le mot de passe si fourni', async () => {
      const existingUser = { id: '1', email: 'user@example.com' };
      const updatedUser = { id: '1', email: 'user@example.com', password_hash: 'hashed_password' };
      
      UserModel.findById.mockResolvedValue(existingUser);
      UserModel.update.mockResolvedValue(updatedUser);
      bcrypt.hash.mockResolvedValue('hashed_password');

      const updateData = { password: 'newpassword' };
      const result = await UserService.updateUser('1', updateData);

      expect(result).toEqual(updatedUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(UserModel.update).toHaveBeenCalledWith('1', {
        password_hash: 'hashed_password'
      });
    });

    it('devrait lever une erreur si l\'utilisateur n\'existe pas', async () => {
      UserModel.findById.mockResolvedValue(null);

      const updateData = { first_name: 'New Name' };
      await expect(UserService.updateUser('999', updateData)).rejects.toThrow('Utilisateur non trouvé');
    });

    it('devrait lever une erreur si l\'email existe déjà', async () => {
      const existingUser = { id: '1', email: 'user@example.com' };
      const userWithEmail = { id: '2', email: 'existing@example.com' };
      
      UserModel.findById.mockResolvedValue(existingUser);
      UserModel.findByEmail.mockResolvedValue(userWithEmail);

      const updateData = { email: 'existing@example.com' };
      await expect(UserService.updateUser('1', updateData)).rejects.toThrow('Un utilisateur avec cet email existe déjà');
    });

    it('devrait permettre la modification de son propre email', async () => {
      const existingUser = { id: '1', email: 'user@example.com' };
      const updatedUser = { id: '1', email: 'new@example.com' };
      
      UserModel.findById.mockResolvedValue(existingUser);
      UserModel.findByEmail.mockResolvedValue(existingUser);
      UserModel.update.mockResolvedValue(updatedUser);

      const updateData = { email: 'new@example.com' };
      const result = await UserService.updateUser('1', updateData);

      expect(result).toEqual(updatedUser);
    });

    it('devrait filtrer les champs non autorisés', async () => {
      const existingUser = { id: '1', email: 'user@example.com' };
      const updatedUser = { id: '1', email: 'user@example.com', first_name: 'New Name' };
      
      UserModel.findById.mockResolvedValue(existingUser);
      UserModel.update.mockResolvedValue(updatedUser);

      const updateData = { 
        first_name: 'New Name', 
        unauthorized_field: 'should_be_ignored',
        email: 'user@example.com'
      };
      const result = await UserService.updateUser('1', updateData);

      expect(result).toEqual(updatedUser);
      expect(UserModel.update).toHaveBeenCalledWith('1', {
        first_name: 'New Name',
        email: 'user@example.com'
      });
    });

    it('devrait propager les erreurs du modèle', async () => {
      const error = new Error('Erreur de base de données');
      UserModel.findById.mockRejectedValue(error);

      const updateData = { first_name: 'New Name' };
      await expect(UserService.updateUser('1', updateData)).rejects.toThrow('Erreur de base de données');
    });
  });

  describe('deleteUser', () => {
    it('devrait supprimer un utilisateur avec succès', async () => {
      const deletedUser = { id: '1', email: 'deleted@example.com', name: 'Deleted User' };
      UserModel.delete.mockResolvedValue(deletedUser);

      const result = await UserService.deleteUser('1');

      expect(result).toEqual(deletedUser);
      expect(UserModel.delete).toHaveBeenCalledWith('1');
    });

    it('devrait lever une erreur si l\'utilisateur n\'existe pas', async () => {
      UserModel.delete.mockResolvedValue(null);

      await expect(UserService.deleteUser('999')).rejects.toThrow('Utilisateur non trouvé');
    });

    it('devrait propager les erreurs du modèle', async () => {
      const error = new Error('Erreur de base de données');
      UserModel.delete.mockRejectedValue(error);

      await expect(UserService.deleteUser('1')).rejects.toThrow('Erreur de base de données');
    });
  });
}); 