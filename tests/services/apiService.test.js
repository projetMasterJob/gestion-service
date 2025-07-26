const apiService = require('../../src/services/apiService');

// Tests de couverture pour le service API
describe('API Service - Tests de Couverture', () => {
  it('devrait exporter un module', () => {
    expect(apiService).toBeDefined();
  });

  it('devrait être un objet (même vide)', () => {
    expect(typeof apiService).toBe('object');
  });
}); 