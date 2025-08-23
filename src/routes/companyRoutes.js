const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const middleware = require('../middleware/authMiddleware');


// Route pour obtenir les informations de l'entreprise par ID utilisateur
router.get('/inf/:company_id', companyController.getINFCompanyById);

// Route pour obtenir les informations de l'entreprise par ID utilisateur
router.get('/:user_id', companyController.getCompanyById);

// Route pour obtenir les offres d'emploi de la compagnie par ID utilisateur
router.get('/:user_id/jobs', companyController.getJobsByUserId);

// Route pour obtenir les candidatures de la compagnie par ID utilisateur
router.get('/:user_id/applications', companyController.getApplicationsByUserId);

// Route pour créer une offre d'emploi
router.post('/job', middleware.authenticateToken, companyController.createJob);

// Route pour mettre à jour une candidature
router.put('/application/:id', middleware.authenticateToken, companyController.updateApplication);



module.exports = router;