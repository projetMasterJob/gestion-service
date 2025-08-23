const companyService = require('../services/companyService');

// Récupère les informations de l'entreprise par ID company
exports.getINFCompanyById = async (req, res) => {
  const { company_id } = req.params;
  try {
    const data = await companyService.getINFCompanyById(company_id);
    return res.status(200).json(data);
  } catch (error) {
    // Si le service a posé error.status, on l'utilise. Sinon 500 (comme ton style "register").
    const status = error.status || (error.message ? 400 : 500);
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

// Récupère les informations de l'entreprise par ID utilisateur
exports.getCompanyById = async (req, res) => {
  const { user_id } = req.params;
  try {
    const data = await companyService.getCompanyById(user_id);
    return res.status(200).json(data);
  } catch (error) {
    // Si le service a posé error.status, on l'utilise. Sinon 500 (comme ton style "register").
    const status = error.status || (error.message ? 400 : 500);
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

// Récupère les offres d'emploi de la compagnie par ID utilisateur
exports.getJobsByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const data = await companyService.getJobsByUserId(user_id);
    return res.status(200).json(data);
  } catch (error) {
    const status = error.status || (error.message ? 400 : 500);
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

// Récupère les candidatures de la compagnie par ID utilisateur
exports.getApplicationsByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const data = await companyService.getApplicationsByUserId(user_id);
    return res.status(200).json(data);
  } catch (error) {
    const status = error.status || (error.message ? 400 : 500);
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

// Création d'une offre d'emploi
exports.createJob = async (req, res) => {
  const jobData = req.body;
  try {
    const job = await companyService.createJob(jobData);
    return res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    const status = error.status || (error.message ? 400 : 500);
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

// Mise à jour du status d'une candidature
exports.updateApplication = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const app = await companyService.updateApplication(id, updatedData);
    return res.status(200).json({ message: 'Application updated successfully', application: app });
  } catch (error) {
    const status = error.status || (error.message ? 400 : 500);
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};