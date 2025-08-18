const pool = require('../config/dbConfig');

// Get company by user ID
exports.getById = async (id) => {
  const query = `SELECT c.name, c.description, c.website, c.created_at 
  FROM users INNER JOIN companies c ON c.user_id = users.id WHERE users.id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Get jobs by user ID
exports.getJobsByUserId = async (userId) => {
  const query = `SELECT j.title, j.description, j.salary, j.job_type, j.posted_at
  FROM jobs j INNER JOIN companies c ON j.company_id = c.id INNER JOIN users ON users.id = c.user_id
  WHERE users.id = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

// Get applications by user ID
exports.getApplicationsByUserId = async (userId) => {
  const query = `SELECT a.id, a.cover_letter, a.resume, a.applied_at
  FROM applications a INNER JOIN jobs j ON a.job_id = j.id
  INNER JOIN companies c ON j.company_id = c.id
  INNER JOIN users u ON c.user_id = u.id
  WHERE u.id = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

// Create a new job
exports.createJob = async (jobData) => {
  const query = `INSERT INTO jobs (title, description, salary, job_type, posted_at, company_id)
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [
    jobData.title,
    jobData.description,
    jobData.salary,
    jobData.job_type,
    jobData.posted_at,
    jobData.company_id
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

exports.getIdCompany = async (userId) => {
  const query = `SELECT c.id FROM companies c
  INNER JOIN users u ON c.user_id = u.id WHERE u.id = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};