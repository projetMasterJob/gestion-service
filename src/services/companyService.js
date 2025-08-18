const companyModel = require('../models/companyModel');

// Get a company by user ID
exports.getCompanyById = async (userId, token) => {
  return await companyModel.getById(userId);
};

// Get jobs by user ID
exports.getJobsByUserId = async (userId) => {
  return await companyModel.getJobsByUserId(userId);
};

// Get applications by user ID
exports.getApplicationsByUserId = async (userId) => {
  return await companyModel.getApplicationsByUserId(userId);
};

// Create a new job
exports.createJob = async (userId, jobData) => {
  const company = await companyModel.getIdCompany(userId);
  jobData.company_id = company.id;
  return await companyModel.createJob(jobData);
};