# Terminium Server

Self-hosted SSH server component for Terminium.

## Quick Start

```bash
sudo ./setup.sh
```

## What Gets Installed

- OpenSSH Server (configured for certificate-only auth)
- Node.js and npm
- Express API server
- UFW firewall
- Fail2ban
- SSL/TLS certificates

## Directory Structure

```
/opt/terminium/
├── api/              # API server
├── certs/            # SSL certificates
├── keys/             # SSH keys
├── logs/             # Application logs
├── config/           # Configuration files
└── scripts/          # Management scripts
```

## Post-Installation

### 1. Setup Disk Encryption (Recommended)
```bash
sudo /opt/terminium/scripts/setup-disk-encryption.sh
```

This sets up military-grade encryption:
- LUKS2 full disk encryption (AES-XTS-512)
- Encrypted swap space
- eCryptfs encrypted home directories
- TPM2 integration (if available)

See [Server Encryption Guide](../docs/SERVER_ENCRYPTION.md) for details.

### 2. Generate Certificates
```bash
sudo /opt/terminium/scripts/generate-certs.sh
```

### 3. Create Users
```bash
sudo /opt/terminium/scripts/add-user.sh username
```

### 4. Configure API
```bash
cd /opt/terminium/api
sudo cp .env.example .env
sudo nano .env  # Edit configuration
```

### 5. Start Services
```bash
sudo systemctl start terminium
sudo systemctl enable terminium
```

## Configuration

### SSH Configuration
Located in `/etc/ssh/sshd_config.d/terminium.conf`

Key settings:
- Password authentication: Disabled
- Public key authentication: Enabled
- Root login: Disabled
- Max auth tries: 3

### API Configuration
Edit `/opt/terminium/api/.env`:

```env
PORT=3000
JWT_SECRET=your-secret-key
ALLOWED_ORIGINS=*
```

### Firewall Rules
```bash
# View current rules
sudo ufw status

# Add custom rules
sudo ufw allow from 192.168.1.0/24 to any port 22
```

## Management

### View Logs
```bash
# API server logs
sudo journalctl -u terminium -f

# SSH logs
sudo tail -f /var/log/auth.log

# Fail2ban logs
sudo fail2ban-client status sshd
```

### Restart Services
```bash
# Restart API
sudo systemctl restart terminium

# Restart SSH
sudo systemctl restart sshd
```

### Update
```bash
cd /opt/terminium/api
sudo git pull
sudo npm install
sudo systemctl restart terminium
```

## Security

### Disk Encryption

Terminium supports military-grade disk encryption:

```bash
# Interactive encryption setup
sudo /opt/terminium/scripts/setup-disk-encryption.sh

# Backup encryption keys (CRITICAL!)
sudo /opt/terminium/scripts/backup-encryption-keys.sh

# Manage LUKS keys
sudo /opt/terminium/scripts/add-luks-key.sh
```

**Encryption Options**:
- **LUKS2**: Full disk encryption (AES-XTS-512, Argon2id)
- **eCryptfs**: Encrypted home directories
- **dm-crypt**: Encrypted swap space
- **TPM2**: Automatic unlock (if available)

See **[Server Encryption Guide](../docs/SERVER_ENCRYPTION.md)** for complete documentation.

### Best Practices
1. Enable disk encryption (LUKS2 or eCryptfs)
2. Change default SSH port
3. Use strong passwords (20+ characters for encryption)
4. Regularly update system packages
5. Monitor logs for suspicious activity
6. Keep fail2ban enabled and configured
7. Backup LUKS headers regularly
8. Store encryption passwords offline

### Fail2ban Configuration
Located in `/etc/fail2ban/jail.d/terminium.conf`

Default: Ban for 1 hour after 3 failed attempts within 10 minutes

### Certificate Management
Certificates are stored in `/opt/terminium/certs/`

Regenerate:
```bash
sudo /opt/terminium/scripts/generate-certs.sh
```

## Troubleshooting

### SSH Not Working
```bash
# Check SSH status
sudo systemctl status sshd

# Test configuration
sudo sshd -t

# Check logs
sudo tail -f /var/log/auth.log
```

### API Not Starting
```bash
# Check status
sudo systemctl status terminium

# View errors
sudo journalctl -u terminium -n 50

# Test manually
cd /opt/terminium/api
node server.js
```

### Port Already in Use
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Users
- `GET /api/users/me` - Get current user

### SSH Keys
- `POST /api/keys/upload` - Upload public key
- `GET /api/keys` - List user's keys

### Health Check
- `GET /health` - API health status

## Backup

### What to Backup
- `/opt/terminium/certs/` - Certificates
- `/opt/terminium/api/.env` - Configuration
- `/home/*/` - User home directories

### Backup Script
```bash
#!/bin/bash
tar -czf terminium-backup-$(date +%Y%m%d).tar.gz \
  /opt/terminium/certs \
  /opt/terminium/api/.env
```

## Requirements

- Debian 11+ or Ubuntu 20.04+
- 1GB RAM minimum
- 10GB disk space
- Root access

## Support

For issues and questions:
- GitHub Issues
- Documentation in `/docs`
- Community Discord
