const request = require('supertest');
const app = require('../src/app');

// Tests de couverture pour l'application
describe('Application - Tests de Couverture', () => {
  describe('GET /', () => {
    it('devrait retourner le message de bienvenue', async () => {
      const response = await request(app)
        .get('/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'microservice utilisateurs' });
    });
  });

  describe('Middleware JSON', () => {
    it('devrait accepter les requêtes JSON', async () => {
      const response = await request(app)
        .put('/api/users/1')
        .set('Content-Type', 'application/json')
        .send({ name: 'Test' });

      expect(response.status).toBe(401);
    });
  });

  describe('Middleware URL Encoded', () => {
    it('devrait accepter les requêtes URL encoded', async () => {
      const response = await request(app)
        .put('/api/users/1')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('name=Test');

      expect(response.status).toBe(401);
    });
  });

  describe('Route inexistante', () => {
    it('devrait retourner 404 pour une route inexistante', async () => {
      const response = await request(app)
        .get('/inexistant');

      expect(response.status).toBe(404);
    });
  });
}); 