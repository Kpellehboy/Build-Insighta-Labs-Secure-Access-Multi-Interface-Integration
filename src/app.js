const express = require('express');
const cors = require('cors');
const app = express();

const profileRoutes = require('./routes/profileRoutes');

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - allow all origins
app.use(cors({
  origin: '*',              // Allow any origin
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add validation for known query params (optional but good)
app.use('/api/profiles', (req, res, next) => {
  const allowedParams = ['gender', 'age_group', 'country_id', 'min_age', 'max_age', 'min_gender_probability', 'min_country_probability', 'sort_by', 'order', 'page', 'limit', 'q'];
  const queryKeys = Object.keys(req.query);
  for (let key of queryKeys) {
    if (!allowedParams.includes(key)) {
      return res.status(400).json({ status: 'error', message: 'Invalid query parameters' });
    }
  }
  next();
});

// Routes
app.use('/api/profiles', profileRoutes);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({ status: 'error', message });
});

module.exports = app;