const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

jest.mock('../../src/services/userService');
const UserService = require('../../src/services/userService');

const userRoutes = require('../../src/routes/userRoutes');

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

// Tests de couverture pour les routes utilisateur
describe('Routes Utilisateur - Tests de Couverture', () => {
  let validToken;
  const JWT_SECRET = 'rJ6PjfD6vZQZchKZDk6vTLDkOJMuGTY6';

  beforeEach(() => {
    validToken = jwt.sign({ id: '1', email: 'test@example.com' }, JWT_SECRET);
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('devrait retourner tous les utilisateurs avec succès', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', name: 'User 1' },
        { id: '2', email: 'user2@example.com', name: 'User 2' }
      ];
      
      UserService.getAllUsers.mockResolvedValue(mockUsers);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(UserService.getAllUsers).toHaveBeenCalledTimes(1);
    });

    it('devrait gérer les erreurs du service', async () => {
      UserService.getAllUsers.mockRejectedValue(new Error('Erreur de base de données'));

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erreur de base de données' });
    });

    it('devrait retourner 401 sans token d\'authentification', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Token d\'accès requis' });
    });
  });

  describe('GET /api/users/:id', () => {
    it('devrait retourner un utilisateur par ID avec succès', async () => {
      const mockUser = { id: '1', email: 'user1@example.com', name: 'User 1' };
      UserService.getUserById.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/users/1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(UserService.getUserById).toHaveBeenCalledWith('1');
    });

    it('devrait retourner 404 si l\'utilisateur n\'existe pas', async () => {
      UserService.getUserById.mockRejectedValue(new Error('Utilisateur non trouvé'));

      const response = await request(app)
        .get('/api/users/1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Utilisateur non trouvé' });
    });

    it('devrait gérer les erreurs serveur', async () => {
      UserService.getUserById.mockRejectedValue(new Error('Erreur de base de données'));

      const response = await request(app)
        .get('/api/users/1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erreur de base de données' });
    });

    it('devrait retourner 403 si l\'utilisateur n\'est pas autorisé', async () => {
      const response = await request(app)
        .get('/api/users/2')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Accès non autorisé - vous ne pouvez modifier que votre propre profil.' });
    });
  });

  describe('PUT /api/users/:id', () => {
    it('devrait mettre à jour un utilisateur avec succès', async () => {
      const updateData = { name: 'Nouveau nom', email: 'nouveau@example.com' };
      const updatedUser = { id: '1', ...updateData };
      
      UserService.updateUser.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put('/api/users/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
      expect(UserService.updateUser).toHaveBeenCalledWith('1', updateData);
    });

    it('devrait retourner 404 si l\'utilisateur n\'existe pas', async () => {
      UserService.updateUser.mockRejectedValue(new Error('Utilisateur non trouvé'));

      const response = await request(app)
        .put('/api/users/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Utilisateur non trouvé' });
    });

    it('devrait retourner 400 si l\'email existe déjà', async () => {
      UserService.updateUser.mockRejectedValue(new Error('Un utilisateur avec cet email existe déjà'));

      const response = await request(app)
        .put('/api/users/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ email: 'existant@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Un utilisateur avec cet email existe déjà' });
    });

    it('devrait gérer les erreurs serveur', async () => {
      UserService.updateUser.mockRejectedValue(new Error('Erreur de base de données'));

      const response = await request(app)
        .put('/api/users/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Test' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erreur de base de données' });
    });

    it('devrait retourner 403 si l\'utilisateur n\'est pas autorisé', async () => {
      const response = await request(app)
        .put('/api/users/2')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Test' });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Accès non autorisé - vous ne pouvez modifier que votre propre profil.' });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('devrait supprimer un utilisateur avec succès', async () => {
      const deletedUser = { id: '1', email: 'deleted@example.com', name: 'Deleted User' };
      UserService.deleteUser.mockResolvedValue(deletedUser);

      const response = await request(app)
        .delete('/api/users/1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(deletedUser);
      expect(UserService.deleteUser).toHaveBeenCalledWith('1');
    });

    it('devrait retourner 404 si l\'utilisateur n\'existe pas', async () => {
      UserService.deleteUser.mockRejectedValue(new Error('Utilisateur non trouvé'));

      const response = await request(app)
        .delete('/api/users/1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Utilisateur non trouvé' });
    });

    it('devrait gérer les erreurs serveur', async () => {
      UserService.deleteUser.mockRejectedValue(new Error('Erreur de base de données'));

      const response = await request(app)
        .delete('/api/users/1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erreur de base de données' });
    });

    it('devrait retourner 403 si l\'utilisateur n\'est pas autorisé', async () => {
      const response = await request(app)
        .delete('/api/users/2')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Accès non autorisé - vous ne pouvez modifier que votre propre profil.' });
    });
  });
}); 