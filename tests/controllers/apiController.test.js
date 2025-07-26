const apiController = require('../../src/controllers/apiController');

describe('API Controller - Tests de Couverture', () => {
  it('devrait exporter un module', () => {
    expect(apiController).toBeDefined();
  });

  it('devrait être un objet', () => {
    expect(typeof apiController).toBe('object');
  });
}); 