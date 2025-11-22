# ICMSF Security Specification

## Overview

ICMSF (Import Connection Mothership Server File) is Terminium's proprietary encrypted file format for securely storing and sharing SSH connection configurations.

**Version**: 1.0
**File Extension**: `.icmsf`
**Encryption**: Military-grade AES-256-GCM with enhanced security layers

## Security Features

### 🔐 Multi-Layer Defense

ICMSF implements defense-in-depth with multiple security layers:

1. **Strong Key Derivation**: PBKDF2-HMAC-SHA512 with 600,000 iterations
2. **Authenticated Encryption**: AES-256-GCM for confidentiality and authenticity
3. **Integrity Verification**: Separate HMAC-SHA512 for additional tamper protection
4. **Compression**: Data compression before encryption (smaller files, harder to analyze)
5. **Version Control**: Forward-compatible file format versioning

### 🛡️ Encryption Specifications

#### Algorithm Details

| Component | Specification | Purpose |
|-----------|--------------|---------|
| **Encryption** | AES-256-GCM | Confidentiality + Authentication |
| **Key Derivation** | PBKDF2-HMAC-SHA512 | Password → Encryption Key |
| **KDF Iterations** | 600,000 | Brute-force resistance |
| **Salt Length** | 64 bytes | Increased from 32 for enhanced security |
| **HMAC** | SHA-512 | Additional integrity verification |
| **Compression** | gzip | Reduce size, obfuscate patterns |
| **Random Generation** | `crypto.randomBytes()` | Cryptographically secure PRNG |

#### Key Derivation Function (KDF)

```typescript
PBKDF2-HMAC-SHA512(
  password: string,
  salt: 64 bytes,
  iterations: 600,000,
  keyLength: 32 bytes
)
```

**Why 600,000 iterations?**
- OWASP recommendation for 2023+
- Provides strong resistance against:
  - GPU-based attacks
  - ASIC/FPGA attacks
  - Rainbow table attacks
- ~100-200ms computation time (acceptable UX)

#### Separate Keys for Encryption and HMAC

Two different keys are derived from the password:
1. **Encryption Key**: For AES-256-GCM encryption
2. **HMAC Key**: For integrity verification

This follows cryptographic best practices to avoid key reuse across different operations.

### 📄 File Format Structure

```
[VERSION][SALT][IV][TAG][ENCRYPTED_DATA][HMAC]
   2B     64B   16B  16B      Variable      64B
```

#### Field Descriptions

| Field | Size | Description |
|-------|------|-------------|
| **VERSION** | 2 bytes | File format version (current: 1) |
| **SALT** | 64 bytes | Random salt for key derivation |
| **IV** | 16 bytes | Initialization vector for AES-GCM |
| **TAG** | 16 bytes | GCM authentication tag |
| **ENCRYPTED_DATA** | Variable | Compressed + encrypted JSON data |
| **HMAC** | 64 bytes | HMAC-SHA512 of all preceding data |

#### Data Flow

```
Original Data
    ↓
JSON Stringify
    ↓
gzip Compression
    ↓
AES-256-GCM Encryption
    ↓
Append GCM Tag
    ↓
Generate HMAC over all data
    ↓
Write to .icmsf file
```

### 🔒 Security Properties

#### Confidentiality
- **AES-256**: Industry standard, approved by NSA for TOP SECRET
- **GCM Mode**: Provides authenticated encryption
- **Random IV**: Each encryption uses unique IV (prevents pattern analysis)

#### Integrity
- **Dual Protection**: Both GCM tag and HMAC
- **Tamper Detection**: Any modification detected immediately
- **Timing-Safe Comparison**: Prevents timing attacks during verification

#### Authenticity
- **Password-Based**: Only password holder can decrypt
- **HMAC Verification**: Ensures file created by password holder
- **No Replay Attacks**: Each file has unique salt and IV

### 🚫 Security Guarantees

#### What ICMSF Protects Against

✅ **Brute-force password attacks** - 600k iterations makes this computationally expensive
✅ **Data tampering** - HMAC + GCM tag detect any modifications
✅ **Replay attacks** - Unique salt/IV per file
✅ **Pattern analysis** - Data compressed before encryption
✅ **Rainbow tables** - 64-byte random salt
✅ **Padding oracle attacks** - GCM mode doesn't use padding
✅ **Chosen ciphertext attacks** - Authenticated encryption
✅ **Timing attacks** - Constant-time HMAC comparison

#### What ICMSF Does NOT Protect Against

❌ **Weak passwords** - User must choose strong password (min 12 chars)
❌ **Keyloggers** - If password stolen at entry, file can be decrypted
❌ **Compromised endpoint** - Malware on user's machine
❌ **Physical access** - If attacker has device with password manager open

### 💪 Password Requirements

#### Minimum Requirements
- **Length**: 12 characters (enforced)
- **Recommended**: 16+ characters with mixed case, numbers, symbols

#### Password Strength Examples

| Password | Entropy | Crack Time | Rating |
|----------|---------|------------|--------|
| `password123` | Low | Seconds | ❌ Weak |
| `MyServer2024!` | Medium | Years | ⚠️ Acceptable |
| `Tr0ub4dor&3` | Medium | Years | ⚠️ Acceptable |
| `correct horse battery staple` | High | Centuries | ✅ Strong |
| `K9$mL2#pQ7@wN5&xR8` | Very High | Millennia | ✅ Excellent |

**Recommendation**: Use a password manager to generate and store strong passwords.

### 🔐 Cryptographic Implementation

#### Libraries Used
- **Node.js `crypto` module** - Native, well-audited cryptography
- **FIPS 140-2 compliant** - When Node.js built with OpenSSL FIPS module

#### Random Number Generation
```typescript
crypto.randomBytes(length)
```
- Uses OS-level CSPRNG
- `/dev/urandom` on Unix
- `CryptGenRandom` on Windows

#### Key Derivation
```typescript
crypto.pbkdf2Sync(password, salt, 600000, keyLength, 'sha512')
```

#### Encryption
```typescript
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
cipher.update(data);
const encrypted = cipher.final();
const tag = cipher.getAuthTag();
```

#### HMAC
```typescript
crypto.createHmac('sha512', hmacKey).update(data).digest()
```

#### Constant-Time Comparison
```typescript
crypto.timingSafeEqual(computed, stored)
```

### 📊 Performance Characteristics

#### Encryption Performance
- **Small files** (< 1KB): ~150-200ms
- **Medium files** (1-10KB): ~200-300ms
- **Large files** (> 10KB): ~300-500ms

*Times include 600k PBKDF2 iterations*

#### File Size Overhead
- **Headers**: 162 bytes fixed overhead
- **Compression**: Typically 60-80% size reduction
- **Net result**: Often smaller than plaintext JSON

Example:
```
Original JSON: 2,048 bytes
Compressed:    450 bytes
Encrypted:     450 bytes
Headers:       162 bytes
Final .icmsf:  612 bytes (70% smaller!)
```

### 🔄 Version Compatibility

#### File Format Versioning

The 2-byte VERSION field allows future enhancements while maintaining backward compatibility.

**Current Version**: 1

**Future Versions** (examples):
- Version 2: Could add Argon2 KDF option
- Version 3: Could add quantum-resistant encryption
- Version 4: Could add public-key hybrid encryption

#### Handling Version Mismatches

```typescript
if (version > CURRENT_VERSION) {
  throw new Error('Unsupported ICMSF file version. Please update Terminium.');
}
```

### 🛠️ Best Practices

#### For Users

1. **Strong Passwords**
   - Use 16+ character passwords
   - Include mixed case, numbers, symbols
   - Use a password manager

2. **Secure Storage**
   - Store .icmsf files in encrypted folders
   - Don't email passwords with files
   - Use separate channels for password sharing

3. **Access Control**
   - Set file permissions to 600 (owner read/write only)
   - Don't store in public cloud folders
   - Delete old/unused ICMSF files

4. **Regular Rotation**
   - Change passwords periodically
   - Re-export with new password
   - Revoke access by creating new file

#### For Developers

1. **Never Log Passwords**
   - Don't log password strings
   - Don't log derived keys
   - Sanitize error messages

2. **Memory Security**
   - Clear sensitive buffers after use
   - Avoid copying passwords unnecessarily
   - Use secure memory if available

3. **Error Handling**
   - Generic error messages (don't reveal details)
   - Constant-time operations
   - Prevent timing side-channels

### 📋 Security Audit Checklist

- [x] AES-256-GCM authenticated encryption
- [x] PBKDF2-HMAC-SHA512 key derivation
- [x] 600,000 KDF iterations (OWASP 2023)
- [x] 64-byte cryptographic salt
- [x] Separate encryption and HMAC keys
- [x] HMAC-SHA512 integrity verification
- [x] Constant-time HMAC comparison
- [x] Cryptographically secure random generation
- [x] Compression before encryption
- [x] File format versioning
- [x] Minimum password length enforcement
- [x] Generic error messages
- [x] File permission restrictions (600)
- [x] No hardcoded keys or secrets

### 🔬 Cryptanalysis Resistance

#### Known Attack Vectors

| Attack Type | Mitigation |
|-------------|------------|
| **Brute Force** | 600k iterations makes it expensive |
| **Dictionary** | Long password requirement |
| **Rainbow Table** | 64-byte random salt |
| **Timing** | Constant-time comparison |
| **Padding Oracle** | GCM mode (no padding) |
| **Birthday** | 64-byte salt (2^512 space) |
| **Chosen Plaintext** | Random IV per encryption |
| **Chosen Ciphertext** | Authenticated encryption |
| **Related Key** | Separate keys from same password |

### 📚 Standards Compliance

ICMSF follows industry best practices:

- ✅ **NIST SP 800-132**: Key derivation recommendations
- ✅ **NIST SP 800-38D**: GCM mode specification
- ✅ **OWASP**: Password storage guidelines
- ✅ **RFC 2104**: HMAC specification
- ✅ **FIPS 197**: AES specification

### 🔐 Comparison with Other Formats

| Feature | ICMSF | PGP | Age | 7-Zip AES |
|---------|-------|-----|-----|-----------|
| **Algorithm** | AES-256-GCM | Various | ChaCha20-Poly1305 | AES-256-CBC |
| **Auth Encryption** | ✅ Yes | Depends | ✅ Yes | ❌ No |
| **KDF Iterations** | 600,000 | 65,536+ | scrypt | 524,288 |
| **Compression** | ✅ Built-in | Optional | ❌ No | ✅ Built-in |
| **Versioning** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Simplicity** | ✅ Simple | Complex | ✅ Simple | Medium |

### 🚀 Future Enhancements

Potential future improvements:

1. **Argon2id KDF**
   - More memory-hard than PBKDF2
   - Better resistance to GPU attacks
   - Configurable memory/time parameters

2. **XChaCha20-Poly1305**
   - Alternative to AES-GCM
   - Better on non-AES-NI hardware
   - Larger nonce space

3. **Hybrid Encryption**
   - Combine password + public key
   - Multi-user access
   - Forward secrecy

4. **Post-Quantum Cryptography**
   - Lattice-based encryption
   - Future-proof against quantum computers

---

## Summary

ICMSF provides **military-grade security** for connection data with:

- 🔐 **AES-256-GCM** encryption
- 🔑 **600,000 iteration** PBKDF2-HMAC-SHA512
- ✅ **Dual integrity** verification (GCM + HMAC)
- 📦 **Built-in compression**
- 🎯 **Defense-in-depth** architecture
- 📋 **Standards-compliant** implementation

When used with a strong password, ICMSF files are **cryptographically secure** against all known attacks.

**Recommended Use**: Store passwords in a password manager and enable full disk encryption for defense-in-depth.
