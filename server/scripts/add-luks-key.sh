#!/bin/bash

#######################################
# Add additional LUKS key slot
# Allows multiple passwords/keyfiles
#######################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}LUKS Key Management${NC}\n"

if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# List encrypted devices
echo -e "${YELLOW}Encrypted devices:${NC}"
lsblk -o NAME,FSTYPE,SIZE | grep crypto_LUKS
echo ""

read -p "Enter device (e.g., /dev/sda3): " DEVICE

if [ ! -b "$DEVICE" ]; then
    echo -e "${RED}Invalid device: $DEVICE${NC}"
    exit 1
fi

# Show current key slots
echo -e "\n${YELLOW}Current key slots:${NC}"
cryptsetup luksDump $DEVICE | grep "Key Slot"
echo ""

# Options
echo "Options:"
echo "1) Add new passphrase"
echo "2) Add key file"
echo "3) Remove key slot"
echo "4) Change passphrase"
echo ""
read -p "Select option [1-4]: " OPTION

case $OPTION in
    1)
        echo -e "\n${GREEN}Adding new passphrase...${NC}"
        echo "Enter existing passphrase:"
        cryptsetup luksAddKey $DEVICE
        echo -e "${GREEN}✓ New passphrase added!${NC}"
        ;;

    2)
        echo -e "\n${GREEN}Adding key file...${NC}"
        read -p "Enter path for key file: " KEYFILE

        # Generate random key
        dd if=/dev/urandom of=$KEYFILE bs=1 count=4096
        chmod 600 $KEYFILE

        echo "Enter existing passphrase:"
        cryptsetup luksAddKey $DEVICE $KEYFILE

        echo -e "${GREEN}✓ Key file added: $KEYFILE${NC}"
        echo -e "${YELLOW}IMPORTANT: Store this file securely!${NC}"
        ;;

    3)
        echo -e "\n${YELLOW}Removing key slot...${NC}"
        cryptsetup luksDump $DEVICE | grep "Key Slot"
        echo ""

        read -p "Enter slot number to remove [0-7]: " SLOT

        echo "Enter remaining passphrase:"
        cryptsetup luksKillSlot $DEVICE $SLOT

        echo -e "${GREEN}✓ Key slot $SLOT removed${NC}"
        ;;

    4)
        echo -e "\n${GREEN}Changing passphrase...${NC}"
        echo "Enter current passphrase:"
        cryptsetup luksChangeKey $DEVICE

        echo -e "${GREEN}✓ Passphrase changed!${NC}"
        ;;

    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

# Show updated slots
echo -e "\n${YELLOW}Updated key slots:${NC}"
cryptsetup luksDump $DEVICE | grep "Key Slot"
