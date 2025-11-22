## Server Disk Encryption Guide

Comprehensive guide for encrypting Terminium server storage with military-grade security.

## Overview

Terminium supports multiple layers of disk encryption:

| Layer | Technology | Protection Level | Use Case |
|-------|-----------|------------------|----------|
| **Full Disk** | LUKS2 | ★★★★★ | OS + Data |
| **Home Directories** | eCryptfs | ★★★★☆ | User files |
| **Swap Space** | dm-crypt | ★★★★★ | Memory protection |
| **Data Partitions** | LUKS2 | ★★★★★ | Terminium data |

## Quick Start

```bash
# Run the encryption setup script
cd /opt/terminium/server/scripts
sudo ./setup-disk-encryption.sh
```

## Encryption Technologies

### LUKS2 (Linux Unified Key Setup v2)

**Best for**: Full disk, data partitions

**Specifications**:
- **Algorithm**: AES-XTS-PLAIN64
- **Key Size**: 512-bit
- **Hash**: SHA-512
- **PBKDF**: Argon2id (memory-hard, GPU-resistant)
- **Iteration Time**: 5000ms minimum

**Advantages**:
- ✅ Industry standard
- ✅ Multiple key slots (up to 32)
- ✅ Header backup/restore
- ✅ TPM2 integration
- ✅ Detached headers support
- ✅ Sector-level encryption

**Security Level**: Military-grade (NSA approved for SECRET data)

### eCryptfs (Enterprise Cryptographic Filesystem)

**Best for**: User home directories

**Specifications**:
- **Algorithm**: AES-256
- **Mode**: CBC
- **Key Management**: Kernel keyring
- **Per-file encryption**: Individual file encryption keys

**Advantages**:
- ✅ File-level granularity
- ✅ Transparent to applications
- ✅ PAM integration (auto-mount on login)
- ✅ No full-disk requirement
- ✅ Works with existing filesystems

**Security Level**: Enterprise-grade

### dm-crypt (Device Mapper Crypto)

**Best for**: Swap encryption

**Specifications**:
- **Algorithm**: AES-XTS-PLAIN64
- **Key**: Random (regenerated each boot)
- **Key Size**: 512-bit

**Advantages**:
- ✅ No persistent key storage
- ✅ Automatic setup
- ✅ Zero performance impact
- ✅ Protects hibernation data

## Encryption Setup Options

### Option 1: Encrypted Home Directories (Safest for Existing Systems)

```bash
sudo ./setup-disk-encryption.sh
# Select option 1
```

**What it does**:
- Encrypts user home directories with eCryptfs
- Sets up automatic mounting on login
- Creates encrypted private directory
- No reboot required

**Best for**:
- Existing installations
- Multi-user systems
- Protecting user data without full disk encryption

**Steps**:
1. Migrates existing home directory to encrypted mount
2. Configures PAM for automatic unlock
3. Sets up encrypted swap (optional)

### Option 2: Encrypted Swap

```bash
sudo ./setup-disk-encryption.sh
# Select option 2
```

**What it does**:
- Encrypts swap partition/file
- Uses random key on each boot
- Protects against cold-boot attacks
- Requires reboot

**Best for**:
- Systems with sensitive data in memory
- Compliance requirements (PCI-DSS, HIPAA)
- Protecting against hibernation attacks

### Option 3: Encrypted Data Partition

```bash
sudo ./setup-disk-encryption.sh
# Select option 3
```

**What it does**:
- Creates LUKS2 encrypted partition
- Sets up automatic unlock on boot
- Configures secure mount point
- **DESTROYS EXISTING DATA**

**Best for**:
- New installations
- Dedicated data storage
- Maximum security for Terminium data

**Configuration**:
```bash
# Example: Encrypt /dev/sdb1 for Terminium data
Partition: /dev/sdb1
Cipher: aes-xts-plain64
Key size: 512-bit
Hash: sha512
Mount: /mnt/terminium_data
```

### Option 4: Full Guided Setup

```bash
sudo ./setup-disk-encryption.sh
# Select option 4
```

**What it does**:
- Interactive wizard for all encryption options
- Encrypted home + swap + data partition
- TPM2 integration (if available)
- Complete security configuration

**Best for**:
- New Terminium installations
- Maximum security posture
- Compliance requirements

## Advanced Features

### TPM2 Automatic Unlock

**Requirements**:
- TPM 2.0 chip
- Secure Boot enabled (recommended)

**Benefits**:
- Automatic unlock on trusted boot
- No password entry at boot
- Still requires password for manual unlock
- Revocable (can disable TPM unlock)

**Setup**:
```bash
# Install TPM2 tools
apt-get install tpm2-tools clevis clevis-luks clevis-tpm2

# Bind LUKS to TPM2
clevis luks bind -d /dev/sda3 tpm2 '{}'

# Verify
clevis luks list -d /dev/sda3
```

**How it works**:
1. TPM2 stores unlock key
2. Key released only if boot integrity verified
3. Falls back to password if TPM unavailable
4. Protects against offline attacks

**Security considerations**:
- ⚠️ Physical access can compromise TPM
- ✅ Use with Secure Boot for best protection
- ✅ Keep LUKS password backup
- ✅ TPM can be remotely disabled

### Multiple Key Slots

LUKS2 supports up to 32 key slots for different unlock methods:

```bash
# Add additional passphrase
cryptsetup luksAddKey /dev/sda3

# Add key file
dd if=/dev/urandom of=/root/luks-key bs=1 count=4096
chmod 600 /root/luks-key
cryptsetup luksAddKey /dev/sda3 /root/luks-key

# Remove key slot
cryptsetup luksKillSlot /dev/sda3 1

# View key slots
cryptsetup luksDump /dev/sda3
```

**Use cases**:
- **Slot 0**: Primary admin password
- **Slot 1**: Recovery password (stored offline)
- **Slot 2**: TPM2 unlock
- **Slot 3**: Remote unlock key file
- **Slots 4-7**: Team member keys (if needed)

### Header Backup & Recovery

**Critical**: Always backup LUKS headers!

```bash
# Backup headers
sudo ./backup-encryption-keys.sh

# Manual backup
cryptsetup luksHeaderBackup /dev/sda3 \
  --header-backup-file luks-header-backup.img

# Restore header (emergency only)
cryptsetup luksHeaderRestore /dev/sda3 \
  --header-backup-file luks-header-backup.img
```

**Storage recommendations**:
- ✅ Offline storage (USB drive in safe)
- ✅ Encrypted cloud backup (separate password)
- ✅ Multiple copies in different locations
- ❌ Never store on same disk as encrypted data
- ❌ Never store password with backup

## Encryption Specifications

### AES-XTS-PLAIN64

**Why XTS mode?**
- Designed specifically for disk encryption
- No IV reuse issues
- Sector-level encryption
- Better than CBC for storage

**Key size: 512-bit**
- Actually uses 2x 256-bit keys
- One for encryption, one for tweak
- Stronger than single 256-bit key

**PLAIN64 IV**
- 64-bit sector addressing
- Supports >2TB volumes
- No IV wraparound issues

### Argon2id PBKDF

**Why Argon2id?**
- Winner of Password Hashing Competition
- Memory-hard (resists GPU attacks)
- Time-hard (resists ASIC attacks)
- Hybrid mode (id = combination of i+d)

**Parameters**:
```
Time cost: 5000ms minimum
Memory cost: Adaptive based on RAM
Parallelism: CPU threads
```

**Comparison**:
| PBKDF | GPU Resistance | Memory Usage | Speed |
|-------|----------------|--------------|-------|
| PBKDF2 | ★★☆☆☆ | Low | Fast |
| bcrypt | ★★★☆☆ | Medium | Medium |
| scrypt | ★★★★☆ | High | Slow |
| **Argon2id** | **★★★★★** | **Adaptive** | **Tunable** |

## Security Best Practices

### Password Requirements

| Strength | Length | Example | Crack Time |
|----------|--------|---------|------------|
| Minimum | 20 chars | `Tr0ub4dor&3-Server` | Years |
| Good | 30 chars | `correct-horse-battery-staple-2024` | Centuries |
| **Excellent** | 40+ chars | `MyTerminiumServer!Secure@2024#Production` | **Millennia** |

**Recommendations**:
- Use **diceware** passphrases (6-8 words)
- Include numbers and special characters
- Use unique passwords for each system
- Store in password manager or offline
- Never reuse server passwords

### Physical Security

Encryption alone doesn't protect against:
- ❌ Booted system access (use screen locks)
- ❌ Keyloggers (use secure boot + measured boot)
- ❌ Cold boot attacks (use encrypted swap)
- ❌ Evil maid attacks (use Secure Boot + TPM)

**Mitigations**:
1. **Secure Boot**: Prevents unauthorized boot loaders
2. **TPM + PCR validation**: Detects boot tampering
3. **Encrypted swap**: Prevents memory dump attacks
4. **Automatic screen lock**: 5-minute timeout
5. **Physical access control**: Lock server room
6. **Tamper-evident seals**: Detect physical intrusion

### Compliance & Regulations

Terminium encryption meets requirements for:

✅ **PCI-DSS v4.0**
- Requirement 3: Protect stored cardholder data
- AES-256 encryption
- Key management procedures

✅ **HIPAA**
- 164.312(a)(2)(iv): Encryption
- 164.312(e)(2)(ii): Transmission security
- Access controls + audit logs

✅ **GDPR**
- Article 32: Security of processing
- "State of the art" encryption
- Pseudonymization

✅ **NIST SP 800-53**
- SC-28: Protection of information at rest
- SC-13: Cryptographic protection
- AES-256 approved

✅ **FedRAMP**
- FIPS 140-2 compliant (with FIPS-mode kernel)
- High impact baseline compatible

## Performance Impact

### LUKS2 Performance

| Disk Type | No Encryption | With LUKS2 | Overhead |
|-----------|---------------|------------|----------|
| **SSD** | 500 MB/s | 480 MB/s | ~4% |
| **NVMe** | 3000 MB/s | 2850 MB/s | ~5% |
| **HDD** | 120 MB/s | 115 MB/s | ~4% |
| **RAID** | 800 MB/s | 760 MB/s | ~5% |

**Factors**:
- Modern CPUs with AES-NI: <5% impact
- Older CPUs without AES-NI: 15-30% impact
- More RAM = better performance (caching)

**Check AES-NI support**:
```bash
grep -m1 aes /proc/cpuinfo
```

### eCryptfs Performance

| Operation | Overhead | Impact |
|-----------|----------|--------|
| Sequential Read | 5-10% | Low |
| Sequential Write | 10-15% | Medium |
| Random I/O | 15-20% | Medium |
| Metadata ops | 20-30% | Medium |

**Best practices**:
- Use for home directories only
- Put temp files on unencrypted /tmp
- Use LUKS for better performance

## Backup Strategy

### What to Backup

1. **LUKS Headers** (CRITICAL)
   ```bash
   ./backup-encryption-keys.sh
   ```

2. **Encryption Keys**
   - Passphrase (written down, stored offline)
   - Key files (encrypted USB drive)
   - Recovery passwords

3. **Configuration**
   - `/etc/crypttab`
   - `/etc/fstab`
   - eCryptfs unwrap passwords

4. **Terminium Data**
   - `/opt/terminium` (encrypted backup)
   - Database exports
   - User SSH keys

### Backup Encryption

```bash
# Encrypted tar backup
tar czf - /opt/terminium | \
  gpg --symmetric --cipher-algo AES256 \
  -o terminium-backup-$(date +%Y%m%d).tar.gz.gpg

# Restore
gpg -d terminium-backup-20240101.tar.gz.gpg | tar xzf -
```

### Backup Schedule

| Backup Type | Frequency | Retention |
|-------------|-----------|-----------|
| LUKS headers | Weekly | Forever |
| Full system | Daily | 30 days |
| Incremental | Hourly | 7 days |
| Offsite copy | Weekly | 90 days |

## Monitoring & Auditing

### Check Encryption Status

```bash
# List encrypted devices
lsblk -o NAME,FSTYPE,SIZE,MOUNTPOINT

# LUKS status
cryptsetup status /dev/mapper/cryptroot

# eCryptfs status
mount | grep ecryptfs

# Verify encryption
cryptsetup luksDump /dev/sda3
```

### Security Auditing

```bash
# Check for unencrypted swap
swapon --show

# Verify file permissions
find /opt/terminium -type f -perm /o+r

# Check authentication logs
journalctl -u cryptsetup.target

# Monitor disk activity
iotop -oa
```

## Troubleshooting

### Can't Unlock Encrypted Partition

**Symptoms**: "No key available" or "Operation not permitted"

**Solutions**:
1. Check password carefully
2. Try different key slot
3. Verify device isn't corrupted: `cryptsetup luksDump /dev/sdX`
4. Restore header from backup
5. Use recovery password

### System Won't Boot (Encrypted Root)

**Recovery**:
1. Boot from live USB
2. Unlock encrypted partition manually
3. Mount and chroot into system
4. Fix configuration
5. Update initramfs

```bash
# From live USB
cryptsetup luksOpen /dev/sda3 cryptroot
mount /dev/mapper/cryptroot /mnt
mount /dev/sda1 /mnt/boot
chroot /mnt
update-initramfs -u
exit
reboot
```

### Forgot Encryption Password

**If you have backup**:
✅ Restore header, set new password

**If no backup**:
❌ Data is unrecoverable (by design!)

**Prevention**:
- Store recovery password offline
- Multiple key slots
- Regular backup tests

### Performance Issues

**Diagnosis**:
```bash
# Check CPU encryption acceleration
grep aes /proc/cpuinfo

# Monitor encryption overhead
iostat -x 1

# Check if modules loaded
lsmod | grep dm_crypt
```

**Solutions**:
- Enable AES-NI in BIOS
- Add more RAM (for caching)
- Use LUKS instead of eCryptfs
- Consider hardware encryption

## Migration Guide

### Encrypting Existing Installation

**Method 1: Encrypted Home Directories** (No downtime)
```bash
./setup-disk-encryption.sh  # Option 1
```

**Method 2: Full Disk** (Requires reinstall)
1. Backup all data
2. Reinstall with LUKS encryption
3. Restore data
4. Run Terminium setup

**Method 3: In-Place** (Advanced)
```bash
# Use cryptsetup-reencrypt (risky!)
cryptsetup-reencrypt /dev/sda3 --new
# NOT RECOMMENDED for production
```

### From LUKS1 to LUKS2

```bash
# Convert header
cryptsetup convert /dev/sda3 --type luks2

# Verify
cryptsetup luksDump /dev/sda3 | grep Version
```

## Emergency Recovery

### Lost LUKS Header

1. Restore from backup
2. If no backup: **Data is lost**

```bash
cryptsetup luksHeaderRestore /dev/sda3 \
  --header-backup-file backup.img
```

### Corrupted Filesystem

```bash
# Unlock partition
cryptsetup luksOpen /dev/sda3 cryptroot

# Check filesystem
e2fsck -f /dev/mapper/cryptroot

# Mount read-only
mount -o ro /dev/mapper/cryptroot /mnt

# Copy data out
rsync -av /mnt/ /backup/
```

### System Compromise

If system is compromised **while unlocked**:
1. Immediately power off (don't shutdown!)
2. Boot from clean media
3. Change all passwords
4. Re-encrypt with new keys
5. Audit access logs

## References

### Standards & Specifications

- **LUKS2**: [gitlab.com/cryptsetup/LUKS2-docs](https://gitlab.com/cryptsetup/LUKS2-docs)
- **AES**: FIPS PUB 197
- **XTS**: IEEE P1619
- **Argon2**: [RFC 9106](https://www.rfc-editor.org/rfc/rfc9106.html)

### Tools Documentation

- `man cryptsetup`
- `man ecryptfs`
- `man dm-crypt`
- [cryptsetup FAQ](https://gitlab.com/cryptsetup/cryptsetup/-/wikis/FrequentlyAskedQuestions)

---

**Remember**: Encryption is only as strong as your password and physical security practices!
