const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const middleware = require('../middleware/authMiddleware');

router.get('/:user_id', companyController.getCompanyById);

router.get('/:user_id/jobs', companyController.getJobsByUserId);

router.get('/:user_id/applications', companyController.getApplicationsByUserId);

router.post('/job', middleware.authenticateToken, companyController.createJob);

router.put('/application/:id', middleware.authenticateToken, companyController.updateApplication);

module.exports = router;