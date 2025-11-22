const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;

const execAsync = promisify(exec);

/**
 * POST /api/keys/upload
 * Upload SSH public key
 */
router.post('/upload', verifyToken, async (req, res) => {
    try {
        const { publicKey } = req.body;
        const username = req.user.username;

        if (!publicKey) {
            return res.status(400).json({ error: 'Public key required' });
        }

        // Validate key format
        if (!publicKey.match(/^(ssh-rsa|ssh-ed25519|ecdsa-sha2-nistp256)/)) {
            return res.status(400).json({ error: 'Invalid key format' });
        }

        const authorizedKeysPath = `/home/${username}/.ssh/authorized_keys`;

        // Append key to authorized_keys
        await execAsync(`echo "${publicKey}" | sudo tee -a ${authorizedKeysPath} > /dev/null`);
        await execAsync(`sudo chown ${username}:${username} ${authorizedKeysPath}`);
        await execAsync(`sudo chmod 600 ${authorizedKeysPath}`);

        res.json({ message: 'Public key added successfully' });
    } catch (error) {
        console.error('Key upload error:', error);
        res.status(500).json({ error: 'Failed to upload key' });
    }
});

/**
 * GET /api/keys
 * List user's public keys
 */
router.get('/', verifyToken, async (req, res) => {
    try {
        const username = req.user.username;
        const authorizedKeysPath = `/home/${username}/.ssh/authorized_keys`;

        try {
            const content = await fs.readFile(authorizedKeysPath, 'utf8');
            const keys = content.split('\n').filter(line => line.trim());

            res.json({ keys });
        } catch (e) {
            res.json({ keys: [] });
        }
    } catch (error) {
        console.error('Key list error:', error);
        res.status(500).json({ error: 'Failed to list keys' });
    }
});

module.exports = router;
