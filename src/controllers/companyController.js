const companyService = require('../services/companyService');

// Get a company by user ID
exports.getCompanyById = async (req, res) => {
  const { user_id } = req.params;
  try {
    const company = await companyService.getCompanyById(user_id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getJobsByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const jobs = await companyService.getJobsByUserId(user_id);
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getApplicationsByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const applications = await companyService.getApplicationsByUserId(user_id);
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createJob = async (req, res) => {
  const { user_id } = req.params;
  const jobData = req.body;
  try {
    const newJob = await companyService.createJob(user_id, jobData);
    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};