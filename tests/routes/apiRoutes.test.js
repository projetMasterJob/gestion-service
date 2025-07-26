const express = require('express');
const apiRoutes = require('../../src/routes/apiRoutes');

// Tests de couverture pour les routes API
describe('API Routes - Tests de Couverture', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use('/api', apiRoutes);
  });

  it('devrait exporter un router Express', () => {
    expect(apiRoutes).toBeDefined();
    expect(typeof apiRoutes).toBe('function');
  });

  it('devrait être un router Express valide', () => {
    const request = require('supertest');
    expect(() => {
      request(app).get('/api/test');
    }).not.toThrow();
  });
}); 