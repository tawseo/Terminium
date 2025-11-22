const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

/**
 * GET /api/users/me
 * Get current user info
 */
router.get('/me', verifyToken, (req, res) => {
    res.json({
        username: req.user.username
    });
});

module.exports = router;
