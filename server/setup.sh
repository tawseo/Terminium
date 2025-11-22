#!/bin/bash

#######################################
# Terminium Server Setup Script
# For Debian/Ubuntu systems
#######################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
TERMINIUM_USER="terminium"
TERMINIUM_HOME="/opt/terminium"
SSH_PORT=22
API_PORT=3000

echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Terminium Server Setup          ║${NC}"
echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/8] Updating system packages...${NC}"
apt-get update
apt-get upgrade -y

echo -e "${YELLOW}[2/8] Installing dependencies...${NC}"
apt-get install -y \
    openssh-server \
    openssl \
    curl \
    git \
    build-essential \
    ufw \
    fail2ban \
    certbot \
    nodejs \
    npm

echo -e "${YELLOW}[3/8] Configuring OpenSSH server...${NC}"

# Backup original SSH config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Configure SSH for security
cat > /etc/ssh/sshd_config.d/terminium.conf << 'EOF'
# Terminium SSH Configuration

# Disable password authentication (certificate only)
PasswordAuthentication no
ChallengeResponseAuthentication no
UsePAM yes

# Enable public key authentication
PubkeyAuthentication yes

# Disable root login
PermitRootLogin no

# Protocol and security settings
Protocol 2
HostKey /etc/ssh/ssh_host_ed25519_key
HostKey /etc/ssh/ssh_host_rsa_key

# Limit authentication attempts
MaxAuthTries 3
MaxSessions 10

# Logging
SyslogFacility AUTH
LogLevel VERBOSE

# Timeout settings
ClientAliveInterval 300
ClientAliveCountMax 2

# Disable empty passwords
PermitEmptyPasswords no

# Disable X11 forwarding (enable if needed)
X11Forwarding no

# Allow TCP forwarding for tunneling
AllowTcpForwarding yes
AllowStreamLocalForwarding yes
GatewayPorts no

# SFTP subsystem
Subsystem sftp /usr/lib/openssh/sftp-server
EOF

echo -e "${YELLOW}[4/8] Setting up firewall...${NC}"
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow $SSH_PORT/tcp comment 'SSH'
ufw allow $API_PORT/tcp comment 'Terminium API'
ufw status

echo -e "${YELLOW}[5/8] Configuring fail2ban...${NC}"
cat > /etc/fail2ban/jail.d/terminium.conf << EOF
[sshd]
enabled = true
port = $SSH_PORT
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
findtime = 600
EOF

systemctl enable fail2ban
systemctl restart fail2ban

echo -e "${YELLOW}[6/8] Creating Terminium system user...${NC}"
if ! id "$TERMINIUM_USER" &>/dev/null; then
    useradd -r -m -d $TERMINIUM_HOME -s /bin/bash $TERMINIUM_USER
    echo -e "${GREEN}Created user: $TERMINIUM_USER${NC}"
else
    echo -e "${YELLOW}User $TERMINIUM_USER already exists${NC}"
fi

echo -e "${YELLOW}[7/8] Setting up Terminium directories...${NC}"
mkdir -p $TERMINIUM_HOME/{certs,keys,logs,config,api}
chown -R $TERMINIUM_USER:$TERMINIUM_USER $TERMINIUM_HOME
chmod 700 $TERMINIUM_HOME/keys
chmod 700 $TERMINIUM_HOME/certs

echo -e "${YELLOW}[8/8] Installing Terminium API server...${NC}"
cd $TERMINIUM_HOME/api

# Copy API files (will be populated by separate script)
if [ -d "$(dirname "$0")/api" ]; then
    cp -r "$(dirname "$0")/api/"* $TERMINIUM_HOME/api/
    chown -R $TERMINIUM_USER:$TERMINIUM_USER $TERMINIUM_HOME/api
fi

# Install Node.js dependencies
if [ -f "package.json" ]; then
    su - $TERMINIUM_USER -c "cd $TERMINIUM_HOME/api && npm install"
fi

# Create systemd service
cat > /etc/systemd/system/terminium.service << EOF
[Unit]
Description=Terminium API Server
After=network.target

[Service]
Type=simple
User=$TERMINIUM_USER
WorkingDirectory=$TERMINIUM_HOME/api
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

Environment=NODE_ENV=production
Environment=PORT=$API_PORT

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl daemon-reload
systemctl enable terminium.service

# Restart SSH with new configuration
systemctl restart sshd

echo ""
echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Setup Complete!                  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo -e "1. Set up Terminium API: cd $TERMINIUM_HOME/api && npm start"
echo -e "2. Generate server certificates: $TERMINIUM_HOME/scripts/generate-certs.sh"
echo -e "3. Create client users: $TERMINIUM_HOME/scripts/add-user.sh <username>"
echo ""
echo -e "${YELLOW}Important information:${NC}"
echo -e "  Server IP: $(hostname -I | awk '{print $1}')"
echo -e "  SSH Port: $SSH_PORT"
echo -e "  API Port: $API_PORT"
echo -e "  Install dir: $TERMINIUM_HOME"
echo ""
echo -e "${RED}Security reminder:${NC}"
echo -e "  - Password authentication is DISABLED"
echo -e "  - Only certificate-based auth is allowed"
echo -e "  - Make sure to add your public keys before disconnecting!"
echo ""
