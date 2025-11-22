const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

/**
 * GET /api/connections
 * List user's saved connections
 */
router.get('/', verifyToken, (req, res) => {
    // In production, fetch from database
    res.json({ connections: [] });
});

/**
 * POST /api/connections
 * Save a new connection
 */
router.post('/', verifyToken, (req, res) => {
    // In production, save to database
    res.json({ message: 'Connection saved' });
});

module.exports = router;
