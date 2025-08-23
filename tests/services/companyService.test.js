// tests/company.service.test.js
const service = require('../../src/services/companyService');

// On mocke le model pour contrôler les retours DB
jest.mock('../../src/models/companyModel', () => ({
  getInfCompanyByID: jest.fn(),
  getById: jest.fn(),
  getJobsByUserId: jest.fn(),
  getApplicationsByUserId: jest.fn(),
  createJob: jest.fn(),
  updateApplication: jest.fn(),
}));
const model = require('../../src/models/companyModel');

const expectToThrowWithStatus = async (fn, status, messageIncludes) => {
  try {
    await fn();
    throw new Error('Should have thrown');
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    if (status !== undefined) expect(err.status).toBe(status);
    if (messageIncludes) expect(err.message).toContain(messageIncludes);
  }
};

describe('companyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------- getINFCompanyById -------------------
describe('getINFCompanyById', () => {
  it('jette 400 si companyId manquant', async () => {
    await expectToThrowWithStatus(() => service.getINFCompanyById(''), 400, '"companyId" est requis');
    expect(model.getInfCompanyByID).not.toHaveBeenCalled();
  });

  it('jette 404 si company introuvable', async () => {
    model.getInfCompanyByID.mockResolvedValueOnce(null);
    await expectToThrowWithStatus(() => service.getINFCompanyById('c-1'), 404, 'Entreprise introuvable');
    expect(model.getInfCompanyByID).toHaveBeenCalledWith('c-1');
  });

  it('retourne la company si trouvée', async () => {
    const fake = { id: 'c-1', name: 'Acme' };
    model.getInfCompanyByID.mockResolvedValueOnce(fake);
    const res = await service.getINFCompanyById('c-1');
    expect(res).toEqual(fake);
    expect(model.getInfCompanyByID).toHaveBeenCalledWith('c-1');
  });
});


  // ------------------- getCompanyById -------------------
  describe('getCompanyById', () => {
    it('jette 400 si userId manquant (message conforme au code)', async () => {
      await expectToThrowWithStatus(() => service.getCompanyById(''), 400, '"userId" est requis');
      expect(model.getById).not.toHaveBeenCalled();
    });

    it('jette 404 si company introuvable', async () => {
      model.getById.mockResolvedValueOnce(null);
      await expectToThrowWithStatus(() => service.getCompanyById('123'), 404, 'Entreprise introuvable');
      expect(model.getById).toHaveBeenCalledWith('123');
    });

    it('retourne la company si trouvée', async () => {
      const fake = { id: 'c1', name: 'Acme' };
      model.getById.mockResolvedValueOnce(fake);
      const res = await service.getCompanyById('123');
      expect(res).toEqual(fake);
      expect(model.getById).toHaveBeenCalledWith('123');
    });
  });

  // ------------------- getJobsByUserId -------------------
  describe('getJobsByUserId', () => {
    it('jette 400 si user_id manquant', async () => {
      await expectToThrowWithStatus(() => service.getJobsByUserId(''), 400, '"user_id" est requis');
      expect(model.getJobsByUserId).not.toHaveBeenCalled();
    });

    it('retourne [] si le model renvoie null/undefined', async () => {
      model.getJobsByUserId.mockResolvedValueOnce(null);
      const res = await service.getJobsByUserId('42');
      expect(res).toEqual([]);
      expect(model.getJobsByUserId).toHaveBeenCalledWith('42');
    });

    it('retourne la liste telle quelle si présente', async () => {
      const rows = [{ id: 1, title: 'A' }, { id: 2, title: 'B' }];
      model.getJobsByUserId.mockResolvedValueOnce(rows);
      const res = await service.getJobsByUserId('42');
      expect(res).toBe(rows);
    });
  });

  // ------------------- getApplicationsByUserId -------------------
  describe('getApplicationsByUserId', () => {
    it('jette 400 si user_id manquant', async () => {
      await expectToThrowWithStatus(() => service.getApplicationsByUserId(''), 400, '"user_id" est requis');
      expect(model.getApplicationsByUserId).not.toHaveBeenCalled();
    });

    it('retourne [] si le model renvoie null/undefined', async () => {
      model.getApplicationsByUserId.mockResolvedValueOnce(undefined);
      const res = await service.getApplicationsByUserId('7');
      expect(res).toEqual([]);
      expect(model.getApplicationsByUserId).toHaveBeenCalledWith('7');
    });

    it('retourne la liste telle quelle si présente', async () => {
      const rows = [{ id: 10, status: 'pending' }];
      model.getApplicationsByUserId.mockResolvedValueOnce(rows);
      const res = await service.getApplicationsByUserId('7');
      expect(res).toBe(rows);
    });
  });

  // ------------------- createJob -------------------
  describe('createJob', () => {
    it('jette 400 si body invalide', async () => {
      await expectToThrowWithStatus(() => service.createJob(null), 400, 'Requête invalide');
      expect(model.createJob).not.toHaveBeenCalled();
    });

    it('jette 400 si "title" manquant', async () => {
      await expectToThrowWithStatus(() => service.createJob({ description: 'x', company_id: 'u' }), 400, '"title" est requis');
    });

    it('jette 400 si "description" manquant', async () => {
      await expectToThrowWithStatus(() => service.createJob({ title: 'x', company_id: 'u' }), 400, '"description" est requis');
    });

    it('jette 400 si "company_id" manquant', async () => {
      await expectToThrowWithStatus(() => service.createJob({ title: 'x', description: 'y' }), 400, '"company_id" est requis');
    });

    it('retourne 500 si le model renvoie null', async () => {
      model.createJob.mockResolvedValueOnce(null);
      await expectToThrowWithStatus(
        () => service.createJob({ title: 'x', description: 'y', company_id: 'uuid' }),
        500,
        'Erreur lors de la création'
      );
      expect(model.createJob).toHaveBeenCalledWith({ title: 'x', description: 'y', company_id: 'uuid' });
    });

    it('OK: crée et renvoie le job', async () => {
      const payload = { title: 'x', description: 'y', company_id: 'uuid', salary: 1000, job_type: 'part_time' };
      const created = { id: 1, ...payload };
      model.createJob.mockResolvedValueOnce(created);

      const res = await service.createJob(payload);

      expect(model.createJob).toHaveBeenCalledWith(payload);
      expect(res).toEqual(created);
    });
  });

  // ------------------- updateApplication -------------------
  describe('updateApplication', () => {
    it('jette 400 si id manquant', async () => {
      await expectToThrowWithStatus(() => service.updateApplication('', {}), 400, '"id" de la candidature est requis');
      expect(model.updateApplication).not.toHaveBeenCalled();
    });

    it('jette 400 si updatedData invalide', async () => {
      await expectToThrowWithStatus(() => service.updateApplication('55', null), 400, 'Données de mise à jour invalides');
      expect(model.updateApplication).not.toHaveBeenCalled();
    });

    it('jette 400 si status invalide', async () => {
      await expectToThrowWithStatus(
        () => service.updateApplication('55', { status: 'weird' }),
        400,
        'Statut invalide'
      );
      expect(model.updateApplication).not.toHaveBeenCalled();
    });

    it('jette 404 si le model ne trouve pas la candidature', async () => {
      model.updateApplication.mockResolvedValueOnce(null);
      await expectToThrowWithStatus(
        () => service.updateApplication('55', { status: 'accepted' }),
        404,
        'Candidature introuvable'
      );
      expect(model.updateApplication).toHaveBeenCalledWith('55', { status: 'accepted' });
    });

    it('OK: met à jour et renvoie la candidature', async () => {
      const updated = { id: 55, status: 'accepted' };
      model.updateApplication.mockResolvedValueOnce(updated);

      const res = await service.updateApplication('55', { status: 'accepted' });

      expect(model.updateApplication).toHaveBeenCalledWith('55', { status: 'accepted' });
      expect(res).toEqual(updated);
    });
  });
});
