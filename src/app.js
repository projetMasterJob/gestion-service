const express = require('express');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/userRoutes');

// Routes principales
app.use('/api', userRoutes);

module.exports = app;