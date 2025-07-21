const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//const apiRoutes = require('./routes/apiRoutes');

// Routes principales
// app.use('/api', apiRoutes);

module.exports = app;