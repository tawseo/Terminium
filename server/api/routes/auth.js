const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Check if user exists
        try {
            await execAsync(`id ${username}`);
            return res.status(409).json({ error: 'User already exists' });
        } catch (e) {
            // User doesn't exist, continue
        }

        // Create system user
        await execAsync(`sudo useradd -m -s /bin/bash ${username}`);

        // Set password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store password hash (in production, use proper database)
        await execAsync(`sudo mkdir -p /opt/terminium/users`);
        await execAsync(`echo "${hashedPassword}" | sudo tee /opt/terminium/users/${username}.hash > /dev/null`);

        // Setup SSH directory
        await execAsync(`sudo -u ${username} mkdir -p /home/${username}/.ssh`);
        await execAsync(`sudo -u ${username} chmod 700 /home/${username}/.ssh`);
        await execAsync(`sudo -u ${username} touch /home/${username}/.ssh/authorized_keys`);
        await execAsync(`sudo -u ${username} chmod 600 /home/${username}/.ssh/authorized_keys`);

        res.json({ message: 'User created successfully', username });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

/**
 * POST /api/auth/login
 * Authenticate user
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Read stored password hash
        try {
            const { stdout } = await execAsync(`sudo cat /opt/terminium/users/${username}.hash`);
            const storedHash = stdout.trim();

            const valid = await bcrypt.compare(password, storedHash);
            if (!valid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { username },
                process.env.JWT_SECRET || 'default-secret',
                { expiresIn: '7d' }
            );

            res.json({ token, username });
        } catch (e) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

module.exports = router;
