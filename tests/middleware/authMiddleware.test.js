const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeUser } = require('../../src/middleware/authMiddleware');

// Tests de couverture pour le middleware d'authentification
describe('Middleware d\'Authentification - Tests de Couverture', () => {
  let mockReq, mockRes, mockNext;
  const JWT_SECRET = 'rJ6PjfD6vZQZchKZDk6vTLDkOJMuGTY6';

  beforeEach(() => {
    mockReq = {
      headers: {},
      params: {},
      user: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('authenticateToken', () => {
    it('devrait passer avec un token valide', () => {
      const token = jwt.sign({ id: '1', email: 'test@example.com' }, JWT_SECRET);
      mockReq.headers.authorization = `Bearer ${token}`;

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.id).toBe('1');
      expect(mockReq.user.email).toBe('test@example.com');
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('devrait retourner 401 sans token', () => {
      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token d\'accès requis' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('devrait retourner 401 avec un header d\'autorisation vide', () => {
      mockReq.headers.authorization = '';

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token d\'accès requis' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('devrait retourner 403 avec un format de token incorrect', () => {
      mockReq.headers.authorization = 'InvalidFormat token123';

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token invalide ou expiré' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('devrait retourner 403 avec un token invalide', () => {
      mockReq.headers.authorization = 'Bearer invalid-token';

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token invalide ou expiré' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('devrait retourner 403 avec un token expiré', () => {
      const expiredToken = jwt.sign(
        { id: '1', email: 'test@example.com' }, 
        JWT_SECRET, 
        { expiresIn: '0s' }
      );
      mockReq.headers.authorization = `Bearer ${expiredToken}`;

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token invalide ou expiré' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('authorizeUser', () => {
    it('devrait autoriser l\'accès si l\'utilisateur modifie son propre profil', () => {
      mockReq.user = { id: '1' };
      mockReq.params.id = '1';

      authorizeUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('devrait refuser l\'accès si l\'utilisateur tente de modifier un autre profil', () => {
      mockReq.user = { id: '1' };
      mockReq.params.id = '2';

      authorizeUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'Accès non autorisé - vous ne pouvez modifier que votre propre profil.' 
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('devrait refuser l\'accès si l\'utilisateur n\'est pas défini', () => {
      mockReq.params.id = '1';

      expect(() => {
        authorizeUser(mockReq, mockRes, mockNext);
      }).toThrow('Cannot read properties of null (reading \'id\')');
    });
  });
}); 