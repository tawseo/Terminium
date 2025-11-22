#!/bin/bash

#######################################
# Terminium Encryption Key Backup
# Secure backup of LUKS headers & keys
#######################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

BACKUP_DIR="/root/luks-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${GREEN}Terminium Encryption Key Backup${NC}\n"

if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

# Find all LUKS encrypted devices
echo -e "${YELLOW}Scanning for LUKS encrypted devices...${NC}\n"

DEVICES=$(lsblk -o NAME,FSTYPE -nr | awk '$2=="crypto_LUKS" {print "/dev/"$1}')

if [ -z "$DEVICES" ]; then
    echo -e "${YELLOW}No LUKS encrypted devices found${NC}"
    exit 0
fi

echo "Found encrypted devices:"
echo "$DEVICES"
echo ""

for DEVICE in $DEVICES; do
    echo -e "${GREEN}Backing up: $DEVICE${NC}"

    # Get device name without /dev/
    DEV_NAME=$(basename $DEVICE)

    # Backup LUKS header
    HEADER_FILE="$BACKUP_DIR/luks-header-${DEV_NAME}-${TIMESTAMP}.img"
    cryptsetup luksHeaderBackup $DEVICE --header-backup-file "$HEADER_FILE"
    chmod 600 "$HEADER_FILE"

    echo "  ✓ Header backed up to: $HEADER_FILE"

    # Dump LUKS information
    INFO_FILE="$BACKUP_DIR/luks-info-${DEV_NAME}-${TIMESTAMP}.txt"
    {
        echo "Device: $DEVICE"
        echo "Backup Date: $(date)"
        echo "UUID: $(cryptsetup luksUUID $DEVICE)"
        echo ""
        echo "=== LUKS Header Information ==="
        cryptsetup luksDump $DEVICE
    } > "$INFO_FILE"
    chmod 600 "$INFO_FILE"

    echo "  ✓ Info saved to: $INFO_FILE"
    echo ""
done

# Create encrypted archive of all backups
ARCHIVE="$BACKUP_DIR/luks-backup-${TIMESTAMP}.tar.gz.gpg"

echo -e "${YELLOW}Creating encrypted archive...${NC}"
echo "Enter encryption password for backup archive:"

cd "$BACKUP_DIR"
tar czf - luks-*.img luks-*.txt 2>/dev/null | gpg --symmetric --cipher-algo AES256 -o "$ARCHIVE"

# Clean up individual files (keep only encrypted archive)
rm -f luks-*.img luks-*.txt

chmod 600 "$ARCHIVE"

echo -e "\n${GREEN}✓ Backup complete!${NC}"
echo -e "\nEncrypted backup: $ARCHIVE"
echo ""
echo -e "${YELLOW}IMPORTANT:${NC}"
echo "  1. Store this backup in a SECURE location (offline preferred)"
echo "  2. Store the decryption password separately"
echo "  3. Test restoration procedure periodically"
echo "  4. Keep multiple backup versions"
echo ""
echo -e "${RED}WARNING: Anyone with this backup can restore your encryption headers!${NC}"
echo ""

# To restore (show instructions)
cat > "$BACKUP_DIR/RESTORE_INSTRUCTIONS.txt" << 'EOF'
# LUKS Header Restoration Instructions

## To extract backups:
gpg -d luks-backup-TIMESTAMP.tar.gz.gpg | tar xzf -

## To restore a header:
cryptsetup luksHeaderRestore /dev/sdX --header-backup-file luks-header-sdX-TIMESTAMP.img

## To verify header integrity:
cryptsetup luksDump /dev/sdX

## Emergency Recovery:
If you've lost access to an encrypted partition:
1. Boot from live USB
2. Copy the backup file to the system
3. Extract with GPG
4. Restore the header with cryptsetup
5. Open the device with your passphrase
6. Mount and recover data

IMPORTANT: Test this procedure BEFORE you need it!
EOF

echo "Restoration instructions saved to: $BACKUP_DIR/RESTORE_INSTRUCTIONS.txt"
