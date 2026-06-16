// Vercel Serverless Function - Express App Entry Point
// This file wraps the compiled Express app for Vercel's serverless environment

// Import compiled backend
let app;
try {
  app = require('../backend/dist/index.js').default || require('../backend/dist/index.js');
} catch (e) {
  // Fallback: create a minimal express app if build not found
  const express = require('express');
  app = express();
  app.get('*', (req, res) => {
    res.status(500).json({ error: 'Backend build not found. Run: cd backend && npm run build' });
  });
}

module.exports = app;
