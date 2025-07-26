const UserController = require('../../src/controllers/userController');
const UserService = require('../../src/services/userService');

// Mock du service utilisateur
jest.mock('../../src/services/userService');

describe('UserController - Tests de Couverture', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('devrait retourner tous les utilisateurs avec succès', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', name: 'User 1' },
        { id: '2', email: 'user2@example.com', name: 'User 2' }
      ];
      
      UserService.getAllUsers.mockResolvedValue(mockUsers);

      await UserController.getAllUsers(mockReq, mockRes);

      expect(UserService.getAllUsers).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    it('devrait gérer les erreurs du service', async () => {
      const errorMessage = 'Erreur de base de données';
      UserService.getAllUsers.mockRejectedValue(new Error(errorMessage));

      await UserController.getAllUsers(mockReq, mockRes);

      expect(UserService.getAllUsers).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getUserById', () => {
    it('devrait retourner un utilisateur par ID avec succès', async () => {
      const mockUser = { id: '1', email: 'user1@example.com', name: 'User 1' };
      mockReq.params.id = '1';
      
      UserService.getUserById.mockResolvedValue(mockUser);

      await UserController.getUserById(mockReq, mockRes);

      expect(UserService.getUserById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('devrait retourner 404 si l\'utilisateur n\'existe pas', async () => {
      mockReq.params.id = '999';
      UserService.getUserById.mockRejectedValue(new Error('Utilisateur non trouvé'));

      await UserController.getUserById(mockReq, mockRes);

      expect(UserService.getUserById).toHaveBeenCalledWith('999');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Utilisateur non trouvé' });
    });

    it('devrait gérer les erreurs serveur', async () => {
      mockReq.params.id = '1';
      const errorMessage = 'Erreur de base de données';
      UserService.getUserById.mockRejectedValue(new Error(errorMessage));

      await UserController.getUserById(mockReq, mockRes);

      expect(UserService.getUserById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('updateUser', () => {
    it('devrait mettre à jour un utilisateur avec succès', async () => {
      const updateData = { name: 'Nouveau nom', email: 'nouveau@example.com' };
      const updatedUser = { id: '1', ...updateData };
      
      mockReq.params.id = '1';
      mockReq.body = updateData;
      
      UserService.updateUser.mockResolvedValue(updatedUser);

      await UserController.updateUser(mockReq, mockRes);

      expect(UserService.updateUser).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedUser);
    });

    it('devrait retourner 404 si l\'utilisateur n\'existe pas', async () => {
      mockReq.params.id = '999';
      mockReq.body = { name: 'Test' };
      
      UserService.updateUser.mockRejectedValue(new Error('Utilisateur non trouvé'));

      await UserController.updateUser(mockReq, mockRes);

      expect(UserService.updateUser).toHaveBeenCalledWith('999', { name: 'Test' });
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Utilisateur non trouvé' });
    });

    it('devrait retourner 400 si l\'email existe déjà', async () => {
      mockReq.params.id = '1';
      mockReq.body = { email: 'existant@example.com' };
      
      const errorMessage = 'Un utilisateur avec cet email existe déjà';
      UserService.updateUser.mockRejectedValue(new Error(errorMessage));

      await UserController.updateUser(mockReq, mockRes);

      expect(UserService.updateUser).toHaveBeenCalledWith('1', { email: 'existant@example.com' });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('devrait gérer les erreurs serveur', async () => {
      mockReq.params.id = '1';
      mockReq.body = { name: 'Test' };
      
      const errorMessage = 'Erreur de base de données';
      UserService.updateUser.mockRejectedValue(new Error(errorMessage));

      await UserController.updateUser(mockReq, mockRes);

      expect(UserService.updateUser).toHaveBeenCalledWith('1', { name: 'Test' });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('deleteUser', () => {
    it('devrait supprimer un utilisateur avec succès', async () => {
      const deletedUser = { id: '1', email: 'deleted@example.com', name: 'Deleted User' };
      mockReq.params.id = '1';
      
      UserService.deleteUser.mockResolvedValue(deletedUser);

      await UserController.deleteUser(mockReq, mockRes);

      expect(UserService.deleteUser).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(deletedUser);
    });

    it('devrait retourner 404 si l\'utilisateur n\'existe pas', async () => {
      mockReq.params.id = '999';
      UserService.deleteUser.mockRejectedValue(new Error('Utilisateur non trouvé'));

      await UserController.deleteUser(mockReq, mockRes);

      expect(UserService.deleteUser).toHaveBeenCalledWith('999');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Utilisateur non trouvé' });
    });

    it('devrait gérer les erreurs serveur', async () => {
      mockReq.params.id = '1';
      const errorMessage = 'Erreur de base de données';
      UserService.deleteUser.mockRejectedValue(new Error(errorMessage));

      await UserController.deleteUser(mockReq, mockRes);

      expect(UserService.deleteUser).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
}); 