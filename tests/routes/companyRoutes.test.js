// __tests__/company.routes.test.js
const request = require('supertest');
const express = require('express');

// On mocke le controller ET le middleware
jest.mock('../../src/controllers/companyController', () => ({
  getCompanyById: jest.fn((req, res) => res.status(200).json({ ok: true, route: 'getCompanyById', params: req.params })),
  getJobsByUserId: jest.fn((req, res) => res.status(200).json({ ok: true, route: 'getJobsByUserId', params: req.params })),
  getApplicationsByUserId: jest.fn((req, res) => res.status(200).json({ ok: true, route: 'getApplicationsByUserId', params: req.params })),
  createJob: jest.fn((req, res) => res.status(201).json({ ok: true, route: 'createJob', body: req.body })),
  updateApplication: jest.fn((req, res) => res.status(200).json({ ok: true, route: 'updateApplication', params: req.params, body: req.body })),
}));

// Pour vérifier l’ordre middleware → controller sur les routes protégées
const callOrder = [];
jest.mock('../../src/middleware/authMiddleware', () => ({
  authenticateToken: jest.fn((req, res, next) => { callOrder.push('auth'); next(); }),
}));

const router = require('../../src/routes/companyRoutes'); // <-- adapte le chemin si besoin
const companyController = require('../../src/controllers/companyController');
const { authenticateToken } = require('../../src/middleware/authMiddleware');

describe('Company routes', () => {
  let app;

  beforeEach(() => {
    // App Express minimal qui monte UNIQUEMENT le router à tester
    app = express();
    app.use(express.json());
    app.use('/', router); // on monte à la racine pour tester les chemins tels quels
    callOrder.length = 0;
    jest.clearAllMocks();
  });

  test('GET /:user_id appelle companyController.getCompanyById', async () => {
    const res = await request(app).get('/123');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, route: 'getCompanyById', params: { user_id: '123' } });
    expect(companyController.getCompanyById).toHaveBeenCalledTimes(1);
    // Vérifie que req.params.user_id est bien passé
    const [req] = companyController.getCompanyById.mock.calls[0];
    expect(req.params.user_id).toBe('123');
  });

  test('GET /:user_id/jobs appelle companyController.getJobsByUserId', async () => {
    const res = await request(app).get('/42/jobs');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, route: 'getJobsByUserId', params: { user_id: '42' } });
    expect(companyController.getJobsByUserId).toHaveBeenCalledTimes(1);
    const [req] = companyController.getJobsByUserId.mock.calls[0];
    expect(req.params.user_id).toBe('42');
  });

  test('GET /:user_id/applications appelle companyController.getApplicationsByUserId', async () => {
    const res = await request(app).get('/7/applications');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, route: 'getApplicationsByUserId', params: { user_id: '7' } });
    expect(companyController.getApplicationsByUserId).toHaveBeenCalledTimes(1);
    const [req] = companyController.getApplicationsByUserId.mock.calls[0];
    expect(req.params.user_id).toBe('7');
  });

  test('POST /job passe par authenticateToken puis appelle companyController.createJob', async () => {
    const payload = {
      title: 'Femme/Valet de chambre',
      description: 'Nettoyage...',
      salary: 1900,
      job_type: 'part_time',
      company_id: '8b235aa8-004e-467f-9cad-efa9ea3d9045',
    };

    const res = await request(app).post('/job').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.route).toBe('createJob');

    // middleware appelé
    expect(authenticateToken).toHaveBeenCalledTimes(1);
    // controller appelé
    expect(companyController.createJob).toHaveBeenCalledTimes(1);

    // ordre: auth → controller
    expect(callOrder).toEqual(['auth']);

    // body bien passé
    const [req] = companyController.createJob.mock.calls[0];
    expect(req.body).toMatchObject(payload);
  });

  test('PUT /application/:id passe par authenticateToken puis appelle companyController.updateApplication', async () => {
    const payload = { status: 'accepted' };
    const res = await request(app).put('/application/99').send(payload);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.route).toBe('updateApplication');

    // middleware appelé
    expect(authenticateToken).toHaveBeenCalledTimes(1);
    // controller appelé
    expect(companyController.updateApplication).toHaveBeenCalledTimes(1);

    // ordre: auth → controller
    expect(callOrder).toEqual(['auth']);

    // params et body bien passés
    const [req] = companyController.updateApplication.mock.calls[0];
    expect(req.params.id).toBe('99');
    expect(req.body).toEqual(payload);
  });
});
