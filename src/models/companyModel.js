const pool = require('../config/dbConfig');


//Get Company by company ID
exports.getInfCompanyByID = async (id) => {
  const query = `SELECT * FROM companies WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

// Get company by user ID
exports.getById = async (id) => {
  const query = `SELECT c.id, c.name, c.description, c.website, c.created_at, u.address, u.phone, u.email
  FROM users u INNER JOIN companies c ON c.user_id = u.id WHERE u.id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Get jobs by user ID
exports.getJobsByUserId = async (userId) => {
  const query = `
    SELECT
    j.id,
    j.title,
    j.description,
    j.salary,
    j.job_type,
    j.posted_at,
    COALESCE(COUNT(a.id), 0) AS applications_count
    FROM jobs j
    JOIN companies c ON j.company_id = c.id
    JOIN users u ON u.id = c.user_id
    LEFT JOIN applications a ON a.job_id = j.id
    WHERE u.id = $1
    GROUP BY j.id, j.title, j.description, j.salary, j.job_type, j.posted_at`;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

// Get applications by user ID
exports.getApplicationsByUserId = async (userId) => {
  const query = `
  SELECT 
  a.id,
  a.job_id, 
  a.user_id, 
  a.status, 
  a.applied_at,
  candidate.first_name, 
  candidate.last_name, 
  candidate.email, 
  candidate.address, 
  candidate.phone,
  candidate.description,
  j.title AS job_title
  FROM applications a INNER JOIN jobs j ON a.job_id = j.id
  INNER JOIN companies c ON j.company_id = c.id
  INNER JOIN users u ON c.user_id = u.id
  INNER JOIN users candidate ON a.user_id = candidate.id
  WHERE u.id = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

// Create a new job
exports.createJob = async (jobData) => {
  const query = `INSERT INTO jobs (title, description, salary, job_type, posted_at, company_id)
  VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING *`;
  const values = [
    jobData.title,
    jobData.description,
    jobData.salary,
    jobData.job_type,
    jobData.company_id
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get company ID by user ID
exports.getIdCompany = async (userId) => {
  const query = `SELECT c.id FROM companies c
  INNER JOIN users u ON c.user_id = u.id WHERE u.id = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

exports.updateApplication = async (applicationId, updatedData) => {
  const query = `UPDATE applications SET status = $1 WHERE id = $2 RETURNING *`;
  const values = [updatedData.status, applicationId];
  const result = await pool.query(query, values);
  return result.rows[0];
};