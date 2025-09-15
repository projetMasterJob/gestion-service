const express = require('express');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const locationRoutes = require('./routes/locationRoutes');

// Routes principales
app.use('/api', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/locations', locationRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({ message: 'microservice utilisateurs' });
});

module.exports = app;