const express = require('express');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');

// Routes principales
app.use('/api', userRoutes);
app.use('/api/companies', companyRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({ message: 'microservice utilisateurs' });
});

module.exports = app;