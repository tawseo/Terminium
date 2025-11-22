#!/bin/bash

#######################################
# Add a new Terminium user
#######################################

set -e

TERMINIUM_HOME="/opt/terminium"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

if [ -z "$1" ]; then
    echo "Usage: $0 <username>"
    exit 1
fi

USERNAME=$1

echo -e "${GREEN}Creating Terminium user: $USERNAME${NC}"

# Create system user
if ! id "$USERNAME" &>/dev/null; then
    useradd -m -s /bin/bash "$USERNAME"
    echo -e "${GREEN}User $USERNAME created${NC}"
else
    echo -e "${YELLOW}User $USERNAME already exists${NC}"
fi

# Set up SSH directory
USER_HOME=$(eval echo ~$USERNAME)
mkdir -p "$USER_HOME/.ssh"
chmod 700 "$USER_HOME/.ssh"
touch "$USER_HOME/.ssh/authorized_keys"
chmod 600 "$USER_HOME/.ssh/authorized_keys"
chown -R "$USERNAME:$USERNAME" "$USER_HOME/.ssh"

echo -e "${GREEN}User setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Add user's public key to: $USER_HOME/.ssh/authorized_keys"
echo "2. Or generate a key pair for the user:"
echo "   sudo -u $USERNAME ssh-keygen -t ed25519 -C '$USERNAME@terminium'"
echo ""
