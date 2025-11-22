#!/bin/bash

#######################################
# Generate certificates for Terminium
#######################################

set -e

TERMINIUM_HOME="/opt/terminium"
CERTS_DIR="$TERMINIUM_HOME/certs"
KEYS_DIR="$TERMINIUM_HOME/keys"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ "$EUID" -ne 0 ]; then
    echo "Please run as root"
    exit 1
fi

echo -e "${GREEN}Generating Terminium certificates...${NC}"

# Create CA (Certificate Authority)
echo -e "${YELLOW}[1/3] Creating Certificate Authority...${NC}"
openssl genrsa -out $CERTS_DIR/ca.key 4096
openssl req -new -x509 -days 3650 -key $CERTS_DIR/ca.key \
    -out $CERTS_DIR/ca.crt \
    -subj "/C=US/ST=State/L=City/O=Terminium/CN=Terminium-CA"

# Create server certificate
echo -e "${YELLOW}[2/3] Creating server certificate...${NC}"
openssl genrsa -out $CERTS_DIR/server.key 4096
openssl req -new -key $CERTS_DIR/server.key \
    -out $CERTS_DIR/server.csr \
    -subj "/C=US/ST=State/L=City/O=Terminium/CN=$(hostname -f)"

openssl x509 -req -days 365 -in $CERTS_DIR/server.csr \
    -CA $CERTS_DIR/ca.crt -CAkey $CERTS_DIR/ca.key \
    -CAcreateserial -out $CERTS_DIR/server.crt

# Set permissions
echo -e "${YELLOW}[3/3] Setting permissions...${NC}"
chmod 600 $CERTS_DIR/*.key
chmod 644 $CERTS_DIR/*.crt
chown -R terminium:terminium $CERTS_DIR

echo -e "${GREEN}Certificates generated successfully!${NC}"
echo ""
echo "CA Certificate: $CERTS_DIR/ca.crt"
echo "Server Certificate: $CERTS_DIR/server.crt"
echo "Server Key: $CERTS_DIR/server.key"
echo ""
echo "Distribute ca.crt to clients for verification"
