// Vercel Serverless Function - Express App Entry Point
// This file wraps the compiled Express app for Vercel's serverless environment

// Import compiled backend
let app;
try {
  app = require('../backend/dist/index.js').default || require('../backend/dist/index.js');
} catch (e) {
  // Fallback: create a minimal handler if build not found
  // Uses express from backend's node_modules since root has no package.json
  try {
    const express = require('../backend/node_modules/express');
    app = express();
    app.all('*', (req, res) => {
      res.status(500).json({ error: 'Backend build not found. Run: cd backend && npm run build', detail: e.message });
    });
  } catch (e2) {
    // Absolute minimal fallback - no express at all
    app = (req, res) => {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Backend not initialized', detail: e.message }));
    };
  }
}

module.exports = app;
