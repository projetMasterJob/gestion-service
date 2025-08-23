// tests/company.controller.test.js
const companyController = require('../../src/controllers/companyController');
const companyService = require('../../src/services/companyService');

// Mock de TOUT le service
jest.mock('../../src/services/companyService');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

describe('CompanyController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========== getCompanyById ==========
  describe('getCompanyById', () => {
    it('200: retourne la company et appelle le service avec user_id', async () => {
      const req = { params: { user_id: '123' } };
      const res = mockRes();
      const fake = { id: 'c1', name: 'Acme' };

      companyService.getCompanyById.mockResolvedValueOnce(fake);

      await companyController.getCompanyById(req, res);

      expect(companyService.getCompanyById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fake);
    });

    it('404: mappe error.status quand fourni par le service', async () => {
      const req = { params: { user_id: '404' } };
      const res = mockRes();
      const err = new Error('Entreprise introuvable');
      err.status = 404;
      companyService.getCompanyById.mockRejectedValueOnce(err);

      await companyController.getCompanyById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Entreprise introuvable' });
    });

    it('400: si erreur sans status mais avec message', async () => {
      const req = { params: { user_id: '' } };
      const res = mockRes();
      const err = new Error('"user_id" est requis');
      companyService.getCompanyById.mockRejectedValueOnce(err);

      await companyController.getCompanyById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: '"user_id" est requis' });
    });

    it('500: si erreur sans status et sans message', async () => {
      const req = { params: { user_id: 'x' } };
      const res = mockRes();
      const err = new Error();
      err.message = ''; // force le cas "pas de message"
      companyService.getCompanyById.mockRejectedValueOnce(err);

      await companyController.getCompanyById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  // ========== getJobsByUserId ==========
  describe('getJobsByUserId', () => {
    it('200: retourne la liste des jobs', async () => {
      const req = { params: { user_id: '42' } };
      const res = mockRes();
      const fake = [{ id: 1, title: 'A' }, { id: 2, title: 'B' }];
      companyService.getJobsByUserId.mockResolvedValueOnce(fake);

      await companyController.getJobsByUserId(req, res);

      expect(companyService.getJobsByUserId).toHaveBeenCalledWith('42');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fake);
    });

    it('400: mappe erreur sans status → 400', async () => {
      const req = { params: { user_id: '' } };
      const res = mockRes();
      const err = new Error('"user_id" est requis');
      companyService.getJobsByUserId.mockRejectedValueOnce(err);

      await companyController.getJobsByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: '"user_id" est requis' });
    });
  });

  // ========== getApplicationsByUserId ==========
  describe('getApplicationsByUserId', () => {
    it('200: retourne la liste des candidatures', async () => {
      const req = { params: { user_id: '7' } };
      const res = mockRes();
      const fake = [{ id: 10, status: 'pending' }];
      companyService.getApplicationsByUserId.mockResolvedValueOnce(fake);

      await companyController.getApplicationsByUserId(req, res);

      expect(companyService.getApplicationsByUserId).toHaveBeenCalledWith('7');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fake);
    });

    it('404: mappe error.status', async () => {
      const req = { params: { user_id: '7' } };
      const res = mockRes();
      const err = new Error('Candidatures introuvables');
      err.status = 404;
      companyService.getApplicationsByUserId.mockRejectedValueOnce(err);

      await companyController.getApplicationsByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Candidatures introuvables' });
    });
  });

  // ========== createJob ==========
  describe('createJob', () => {
    it('201: crée un job et renvoie le payload attendu', async () => {
      const jobData = {
        title: 'Femme/Valet de chambre',
        description: 'Nettoyage...',
        salary: 1900,
        job_type: 'part_time',
        company_id: '8b235aa8-004e-467f-9cad-efa9ea3d9045',
      };
      const req = { body: jobData };
      const res = mockRes();
      const created = { id: 999, ...jobData };
      companyService.createJob.mockResolvedValueOnce(created);

      await companyController.createJob(req, res);

      expect(companyService.createJob).toHaveBeenCalledWith(jobData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Job created successfully', job: created });
    });

    it('400: mappe erreur de validation (ex: "company_id" manquant)', async () => {
      const req = { body: {} };
      const res = mockRes();
      const err = new Error('"company_id" est requis');
      companyService.createJob.mockRejectedValueOnce(err);

      await companyController.createJob(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: '"company_id" est requis' });
    });

    it('500: erreur sans message → 500', async () => {
      const req = { body: { title: 'x', description: 'y', job_type: 'z', company_id: 'uuid' } };
      const res = mockRes();
      const err = new Error(); err.message = '';
      companyService.createJob.mockRejectedValueOnce(err);

      await companyController.createJob(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  // ========== updateApplication ==========
  describe('updateApplication', () => {
    it('200: met à jour et renvoie l\'application', async () => {
      const req = { params: { id: '55' }, body: { status: 'accepted' } };
      const res = mockRes();
      const updated = { id: 55, status: 'accepted' };
      companyService.updateApplication.mockResolvedValueOnce(updated);

      await companyController.updateApplication(req, res);

      expect(companyService.updateApplication).toHaveBeenCalledWith('55', { status: 'accepted' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Application updated successfully', application: updated });
    });

    it('400: mappe erreur de validation sans status', async () => {
      const req = { params: { id: '' }, body: {} };
      const res = mockRes();
      const err = new Error('"id" de la candidature est requis');
      companyService.updateApplication.mockRejectedValueOnce(err);

      await companyController.updateApplication(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: '"id" de la candidature est requis' });
    });

    it('404: mappe error.status fourni par le service', async () => {
      const req = { params: { id: '999' }, body: { status: 'pending' } };
      const res = mockRes();
      const err = new Error('Candidature introuvable');
      err.status = 404;
      companyService.updateApplication.mockRejectedValueOnce(err);

      await companyController.updateApplication(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Candidature introuvable' });
    });
  });

  describe('CompanyController (branches manquantes)', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		// ---- getJobsByUserId ----
		it('getJobsByUserId → 404 quand le service rejette avec error.status', async () => {
			const req = { params: { user_id: '42' } };
			const res = mockRes();
			const err = new Error('Offres introuvables');
			err.status = 404;
			companyService.getJobsByUserId.mockRejectedValueOnce(err);

			await companyController.getJobsByUserId(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: 'Offres introuvables' });
		});

		it('getJobsByUserId → 500 quand le service rejette sans message ni status', async () => {
			const req = { params: { user_id: '42' } };
			const res = mockRes();
			const err = new Error();
			err.message = ''; // force le chemin 500
			companyService.getJobsByUserId.mockRejectedValueOnce(err);

			await companyController.getJobsByUserId(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
		});

		// ---- getApplicationsByUserId ----
		it('getApplicationsByUserId → 400 quand le service rejette sans status mais avec message', async () => {
			const req = { params: { user_id: '' } };
			const res = mockRes();
			const err = new Error('"user_id" est requis');
			companyService.getApplicationsByUserId.mockRejectedValueOnce(err);

			await companyController.getApplicationsByUserId(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ message: '"user_id" est requis' });
		});

		it('getApplicationsByUserId → 500 quand le service rejette sans message ni status', async () => {
			const req = { params: { user_id: '7' } };
			const res = mockRes();
			const err = new Error();
			err.message = '';
			companyService.getApplicationsByUserId.mockRejectedValueOnce(err);

			await companyController.getApplicationsByUserId(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
		});
	});
});
