// Configuration globale pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'rJ6PjfD6vZQZchKZDk6vTLDkOJMuGTY6';

// Mock de la base de données pour les tests
jest.mock('../src/config/dbConfig', () => ({
  query: jest.fn()
})); 