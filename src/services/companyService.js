const companyModel = require('../models/companyModel');

// Récupère les informations de l'entreprise par ID company
exports.getINFCompanyById = async (companyId) => {
  if (!companyId) {
    const err = new Error('"companyId" est requis');
    err.status = 400; throw err;
  }

  const company = await companyModel.getInfCompanyByID(companyId);
  if (!company) {
    const err = new Error('Entreprise introuvable');
    err.status = 404; throw err;
  }

  return company;
};



// Récupère les informations de l'entreprise par ID utilisateur
exports.getCompanyById = async (userId) => {
  if (!userId) {
    const err = new Error('"userId" est requis');
    err.status = 400; throw err;
  }

  const company = await companyModel.getById(userId);
  if (!company) {
    const err = new Error('Entreprise introuvable');
    err.status = 404; throw err;
  }

  return company;
};

// Récupère les offres d'emploi de la compagnie par ID utilisateur
exports.getJobsByUserId = async (userId) => {
  if (!userId) {
    const err = new Error('"user_id" est requis');
    err.status = 400; throw err;
  }

  // Récupération des offres
  // On peut ne rien récupérer
  const jobs = await companyModel.getJobsByUserId(userId);

  return jobs || [];
};

// Récupère les candidatures de la compagnie par ID utilisateur
exports.getApplicationsByUserId = async (userId) => {
  if (!userId) {
    const err = new Error('"user_id" est requis');
    err.status = 400; throw err;
  }

  // Récupération des candidatures
  // On peut ne rien récupérer
  const apps = await companyModel.getApplicationsByUserId(userId);

  return apps || [];
};

// Création d'une offre d'emploi
exports.createJob = async (jobData) => {
  if (!jobData || typeof jobData !== 'object') {
    const err = new Error('Requête invalide');
    err.status = 400; throw err;
  }
  if (!jobData.title) {
    const err = new Error('"title" est requis');
    err.status = 400; throw err;
  }
  if (!jobData.description) {
    const err = new Error('"description" est requis');
    err.status = 400; throw err;
  }
  if (!jobData.company_id) {
    const err = new Error('"company_id" est requis');
    err.status = 400; throw err;
  }

  console.log('Creating job with data:', jobData);

  const newJob = await companyModel.createJob(jobData);
  if (!newJob) {
    const err = new Error("Erreur lors de la création de l'offre");
    err.status = 500; throw err;
  }

  return newJob;
};

// Mise à jour du status d'une candidature
exports.updateApplication = async (applicationId, updatedData) => {
  // Vérifications des paramètres
  if (!applicationId) {
    const err = new Error('"id" de la candidature est requis');
    err.status = 400; throw err;
  }
  if (!updatedData || typeof updatedData !== 'object') {
    const err = new Error('Données de mise à jour invalides');
    err.status = 400; throw err;
  }

  // Valider une éventuelle transition de statut
  if (updatedData.status !== undefined) {
    const allowed = new Set(['pending', 'accepted', 'rejected']);
    if (!allowed.has(updatedData.status)) {
      const err = new Error('Statut invalide. Valeurs: pending, accepted, rejected');
      err.status = 400; throw err;
    }
  }

  const updated = await companyModel.updateApplication(applicationId, updatedData);
  if (!updated) {
    const err = new Error('Candidature introuvable');
    err.status = 404; throw err;
  }

  return updated;
};

// Récupération d'une offre d'emploi par ID
exports.getJobById = async (jobId) => {
  if (!jobId) {
    const err = new Error('"jobId" est requis');
    err.status = 400; throw err;
  }

  const job = await companyModel.getJobById(jobId);
  if (!job) {
    const err = new Error('Offre d\'emploi introuvable');
    err.status = 404; throw err;
  }

  return job;
};

// Mise à jour d'une offre d'emploi
exports.updateJob = async (jobId, jobData) => {
  if (!jobId) {
    const err = new Error('"jobId" est requis');
    err.status = 400; throw err;
  }
  if (!jobData || typeof jobData !== 'object') {
    const err = new Error('Données d\'offre invalides');
    err.status = 400; throw err;
  }

  const updated = await companyModel.updateJob(jobId, jobData);
  if (!updated) {
    const err = new Error('Offre d\'emploi introuvable');
    err.status = 404; throw err;
  }

  return updated;
};

// Suppression d'une offre d'emploi
exports.deleteJob = async (jobId) => {
  if (!jobId) {
    const err = new Error('"jobId" est requis');
    err.status = 400; throw err;
  }

  const deleted = await companyModel.deleteJob(jobId);
  if (!deleted) {
    const err = new Error('Offre d\'emploi introuvable');
    err.status = 404; throw err;
  }

  return deleted;
};