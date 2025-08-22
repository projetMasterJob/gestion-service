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
exports.createJob = async (jobData) => {
  return await companyModel.createJob(jobData);
};

exports.updateApplication = async (applicationId, updatedData) => {
  return await companyModel.updateApplication(applicationId, updatedData);
};