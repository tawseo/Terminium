#!/bin/bash

#######################################
# Terminium Disk Encryption Setup
# Enhanced server-side encryption
#######################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Terminium Enhanced Disk Encryption Setup        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}This script sets up military-grade disk encryption:${NC}"
echo "  • LUKS2 full disk encryption"
echo "  • Encrypted swap space"
echo "  • eCryptfs encrypted home directories"
echo "  • TPM2 integration (if available)"
echo "  • Secure key management"
echo ""
echo -e "${RED}WARNING: This is for NEW installations or data partitions!${NC}"
echo -e "${RED}For existing systems, backup all data first!${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Installation mode selection
echo -e "${YELLOW}Select installation mode:${NC}"
echo "1) Setup encrypted home directories (safe for existing systems)"
echo "2) Setup encrypted swap (requires reboot)"
echo "3) Setup encrypted data partition (for new partition)"
echo "4) Full guided setup (interactive)"
echo ""
read -p "Enter choice [1-4]: " MODE

case $MODE in
    1)
        setup_encrypted_home
        ;;
    2)
        setup_encrypted_swap
        ;;
    3)
        setup_encrypted_partition
        ;;
    4)
        full_guided_setup
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

function setup_encrypted_home() {
    echo -e "\n${GREEN}[1/4] Installing eCryptfs...${NC}"
    apt-get update
    apt-get install -y ecryptfs-utils cryptsetup

    echo -e "\n${GREEN}[2/4] Setting up encrypted home directory...${NC}"
    read -p "Enter username to encrypt home directory: " USERNAME

    if ! id "$USERNAME" &>/dev/null; then
        echo -e "${RED}User $USERNAME does not exist${NC}"
        exit 1
    fi

    # Encrypt home directory
    ecryptfs-migrate-home -u "$USERNAME"

    echo -e "\n${GREEN}[3/4] Setting up encrypted private directory...${NC}"
    sudo -u "$USERNAME" ecryptfs-setup-private

    echo -e "\n${GREEN}[4/4] Configuring automatic mounting...${NC}"
    cat >> /etc/pam.d/common-auth << EOF

# eCryptfs automatic mounting
auth    optional        pam_ecryptfs.so unwrap
EOF

    cat >> /etc/pam.d/common-session << EOF

# eCryptfs session management
session optional        pam_ecryptfs.so unwrap
EOF

    echo -e "\n${GREEN}✓ Encrypted home directory setup complete!${NC}"
    echo -e "${YELLOW}IMPORTANT: User must login to finalize setup${NC}"
}

function setup_encrypted_swap() {
    echo -e "\n${GREEN}[1/5] Installing cryptsetup...${NC}"
    apt-get update
    apt-get install -y cryptsetup

    echo -e "\n${GREEN}[2/5] Detecting swap partition...${NC}"
    SWAP_PARTITION=$(swapon --show=NAME --noheadings | head -1)

    if [ -z "$SWAP_PARTITION" ]; then
        echo -e "${YELLOW}No swap partition found. Creating swap file...${NC}"

        read -p "Swap file size in GB [default: 4]: " SWAP_SIZE
        SWAP_SIZE=${SWAP_SIZE:-4}

        # Create encrypted swap file
        dd if=/dev/zero of=/swapfile bs=1G count=$SWAP_SIZE status=progress
        chmod 600 /swapfile

        # Setup LUKS encryption on swap file
        cryptsetup luksFormat /swapfile
        cryptsetup luksOpen /swapfile cryptswap
        mkswap /dev/mapper/cryptswap

        # Add to crypttab
        UUID=$(cryptsetup luksUUID /swapfile)
        echo "cryptswap UUID=$UUID none luks,swap" >> /etc/crypttab

        # Add to fstab
        echo "/dev/mapper/cryptswap none swap sw 0 0" >> /etc/fstab

        swapon /dev/mapper/cryptswap
    else
        echo -e "${YELLOW}Found swap: $SWAP_PARTITION${NC}"
        echo -e "${RED}WARNING: This will destroy existing swap data!${NC}"
        read -p "Continue? (yes/no): " CONFIRM

        if [ "$CONFIRM" != "yes" ]; then
            echo "Aborted"
            exit 1
        fi

        echo -e "\n${GREEN}[3/5] Disabling current swap...${NC}"
        swapoff -a

        echo -e "\n${GREEN}[4/5] Setting up encrypted swap...${NC}"

        # Setup cryptswap with random key on each boot
        echo "cryptswap $SWAP_PARTITION /dev/urandom swap,cipher=aes-xts-plain64,size=512" >> /etc/crypttab

        # Update fstab
        sed -i '/swap/d' /etc/fstab
        echo "/dev/mapper/cryptswap none swap sw 0 0" >> /etc/fstab

        echo -e "\n${GREEN}[5/5] Initializing encrypted swap...${NC}"
        cryptdisks_start cryptswap
        swapon /dev/mapper/cryptswap
    fi

    echo -e "\n${GREEN}✓ Encrypted swap setup complete!${NC}"
    echo -e "${YELLOW}Reboot recommended to verify configuration${NC}"
}

function setup_encrypted_partition() {
    echo -e "\n${GREEN}Setting up encrypted data partition...${NC}"

    echo -e "\n${YELLOW}Available disks:${NC}"
    lsblk -o NAME,SIZE,TYPE,MOUNTPOINT
    echo ""

    read -p "Enter partition to encrypt (e.g., /dev/sdb1): " PARTITION

    if [ ! -b "$PARTITION" ]; then
        echo -e "${RED}Invalid partition: $PARTITION${NC}"
        exit 1
    fi

    echo -e "\n${RED}WARNING: This will DESTROY all data on $PARTITION!${NC}"
    read -p "Type 'YES' to continue: " CONFIRM

    if [ "$CONFIRM" != "YES" ]; then
        echo "Aborted"
        exit 1
    fi

    echo -e "\n${GREEN}[1/6] Installing cryptsetup...${NC}"
    apt-get update
    apt-get install -y cryptsetup

    echo -e "\n${GREEN}[2/6] Wiping partition (this may take a while)...${NC}"
    dd if=/dev/zero of=$PARTITION bs=1M status=progress || true

    echo -e "\n${GREEN}[3/6] Creating LUKS2 encrypted container...${NC}"
    echo "Enter encryption passphrase (minimum 20 characters recommended)"

    # Create LUKS2 container with strong settings
    cryptsetup luksFormat \
        --type luks2 \
        --cipher aes-xts-plain64 \
        --key-size 512 \
        --hash sha512 \
        --iter-time 5000 \
        --use-random \
        $PARTITION

    echo -e "\n${GREEN}[4/6] Opening encrypted partition...${NC}"
    MAPPER_NAME="terminium_data"
    cryptsetup luksOpen $PARTITION $MAPPER_NAME

    echo -e "\n${GREEN}[5/6] Creating filesystem...${NC}"
    read -p "Filesystem type [ext4/xfs/btrfs, default: ext4]: " FS_TYPE
    FS_TYPE=${FS_TYPE:-ext4}

    mkfs.$FS_TYPE -L terminium_encrypted /dev/mapper/$MAPPER_NAME

    echo -e "\n${GREEN}[6/6] Configuring automatic mount...${NC}"
    MOUNT_POINT="/mnt/terminium_data"
    mkdir -p $MOUNT_POINT

    # Get UUID
    UUID=$(cryptsetup luksUUID $PARTITION)

    # Add to crypttab
    echo "$MAPPER_NAME UUID=$UUID none luks,timeout=180" >> /etc/crypttab

    # Add to fstab
    echo "/dev/mapper/$MAPPER_NAME $MOUNT_POINT $FS_TYPE defaults 0 2" >> /etc/fstab

    # Mount
    mount /dev/mapper/$MAPPER_NAME $MOUNT_POINT

    echo -e "\n${GREEN}✓ Encrypted partition setup complete!${NC}"
    echo "Mounted at: $MOUNT_POINT"
}

function full_guided_setup() {
    echo -e "\n${BLUE}=== Full Guided Disk Encryption Setup ===${NC}\n"

    # Step 1: Encrypted home directories
    echo -e "${YELLOW}Step 1: Setup encrypted home directories${NC}"
    read -p "Setup encrypted home directories? (y/n): " SETUP_HOME
    if [ "$SETUP_HOME" = "y" ]; then
        setup_encrypted_home
    fi

    # Step 2: Encrypted swap
    echo -e "\n${YELLOW}Step 2: Setup encrypted swap${NC}"
    read -p "Setup encrypted swap? (y/n): " SETUP_SWAP
    if [ "$SETUP_SWAP" = "y" ]; then
        setup_encrypted_swap
    fi

    # Step 3: Encrypted data partition
    echo -e "\n${YELLOW}Step 3: Setup encrypted data partition (optional)${NC}"
    read -p "Setup encrypted data partition? (y/n): " SETUP_DATA
    if [ "$SETUP_DATA" = "y" ]; then
        setup_encrypted_partition
    fi

    # Step 4: TPM2 integration
    echo -e "\n${YELLOW}Step 4: TPM2 integration (optional)${NC}"
    if [ -d "/sys/class/tpm/tpm0" ]; then
        echo -e "${GREEN}TPM2 device detected!${NC}"
        read -p "Setup TPM2 automatic unlock? (y/n): " SETUP_TPM
        if [ "$SETUP_TPM" = "y" ]; then
            setup_tpm2_unlock
        fi
    else
        echo -e "${YELLOW}No TPM2 device detected, skipping${NC}"
    fi

    echo -e "\n${GREEN}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   Full encryption setup complete!                 ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"

    display_security_summary
}

function setup_tpm2_unlock() {
    echo -e "\n${GREEN}Setting up TPM2 automatic unlock...${NC}"

    apt-get install -y tpm2-tools clevis clevis-luks clevis-tpm2

    # List encrypted devices
    echo -e "\n${YELLOW}Encrypted devices:${NC}"
    lsblk -o NAME,FSTYPE,SIZE | grep crypto_LUKS

    read -p "Enter device to bind to TPM2 (e.g., /dev/sda3): " TPM_DEVICE

    if [ ! -b "$TPM_DEVICE" ]; then
        echo -e "${RED}Invalid device${NC}"
        return
    fi

    # Bind to TPM2
    echo "Enter existing LUKS passphrase:"
    clevis luks bind -d $TPM_DEVICE tpm2 '{}'

    echo -e "${GREEN}TPM2 unlock configured!${NC}"
    echo "Device will auto-unlock on boot if TPM2 is available"
}

function display_security_summary() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   Security Configuration Summary                  ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}\n"

    echo -e "${GREEN}Encryption Status:${NC}"

    # Check encrypted home
    if dpkg -l | grep -q ecryptfs-utils; then
        echo "  ✓ eCryptfs installed (encrypted home directories)"
    fi

    # Check encrypted swap
    if grep -q cryptswap /etc/crypttab 2>/dev/null; then
        echo "  ✓ Encrypted swap configured"
    fi

    # Check LUKS devices
    LUKS_COUNT=$(lsblk -o FSTYPE | grep -c crypto_LUKS || echo 0)
    if [ "$LUKS_COUNT" -gt 0 ]; then
        echo "  ✓ $LUKS_COUNT LUKS encrypted partition(s)"
    fi

    # Check TPM2
    if command -v clevis &>/dev/null; then
        echo "  ✓ TPM2 tools installed"
    fi

    echo ""
    echo -e "${YELLOW}Encryption Specifications:${NC}"
    echo "  • Algorithm: AES-XTS-PLAIN64"
    echo "  • Key Size: 512-bit"
    echo "  • Hash: SHA-512"
    echo "  • PBKDF: Argon2id (LUKS2)"
    echo ""

    echo -e "${YELLOW}Best Practices:${NC}"
    echo "  1. Use strong passphrases (20+ characters)"
    echo "  2. Store backup keys in secure location"
    echo "  3. Test recovery procedures"
    echo "  4. Keep system updated"
    echo "  5. Enable secure boot if available"
    echo ""
}

# Main execution
case $MODE in
    1|2|3|4)
        : # Already handled above
        ;;
esac

echo -e "\n${GREEN}Done!${NC}\n"
