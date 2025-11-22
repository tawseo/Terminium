import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as zlib from 'zlib';
import { promisify } from 'util';
import { ICMSFData } from '../types';

const gzipAsync = promisify(zlib.gzip);
const gunzipAsync = promisify(zlib.gunzip);

/**
 * ICMSF (Import Connection Mothership Server File) Manager
 *
 * Enhanced security features:
 * - AES-256-GCM encryption
 * - PBKDF2-HMAC-SHA512 key derivation (600,000 iterations)
 * - HMAC-SHA512 for additional integrity verification
 * - Compression before encryption
 * - File format versioning
 * - Cryptographically secure random generation
 */
export class ICMSFManager {
  // Encryption algorithm
  private readonly ALGORITHM = 'aes-256-gcm';

  // Length constants (in bytes)
  private readonly VERSION_LENGTH = 2;      // File format version
  private readonly SALT_LENGTH = 64;        // Increased from 32 for enhanced security
  private readonly IV_LENGTH = 16;          // Standard for AES-GCM
  private readonly TAG_LENGTH = 16;         // GCM authentication tag
  private readonly HMAC_LENGTH = 64;        // HMAC-SHA512 output
  private readonly KEY_LENGTH = 32;         // 256-bit encryption key

  // Key derivation parameters
  private readonly PBKDF2_ITERATIONS = 600000;  // OWASP 2023 recommendation
  private readonly PBKDF2_HASH = 'sha512';      // Stronger than sha256

  // Current file format version
  private readonly CURRENT_VERSION = 1;

  /**
   * Derive encryption key from password using PBKDF2-HMAC-SHA512
   * High iteration count protects against brute-force attacks
   */
  private deriveKey(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(
      password,
      salt,
      this.PBKDF2_ITERATIONS,
      this.KEY_LENGTH,
      this.PBKDF2_HASH
    );
  }

  /**
   * Derive HMAC key from password (separate from encryption key)
   */
  private deriveHmacKey(password: string, salt: Buffer): Buffer {
    // Use different salt derivation to ensure key separation
    const hmacSalt = crypto.createHash('sha512').update(salt).update('hmac').digest();
    return crypto.pbkdf2Sync(
      password,
      hmacSalt,
      this.PBKDF2_ITERATIONS,
      64,
      this.PBKDF2_HASH
    );
  }

  /**
   * Generate HMAC for integrity verification
   */
  private generateHmac(data: Buffer, key: Buffer): Buffer {
    return crypto.createHmac('sha512', key).update(data).digest();
  }

  /**
   * Verify HMAC to ensure data hasn't been tampered with
   */
  private verifyHmac(data: Buffer, hmac: Buffer, key: Buffer): boolean {
    const computed = this.generateHmac(data, key);
    return crypto.timingSafeEqual(computed, hmac);
  }

  /**
   * Export connection data to encrypted ICMSF file
   *
   * File format:
   * [VERSION:2][SALT:64][IV:16][TAG:16][HMAC:64][ENCRYPTED_DATA:*]
   *
   * Security layers:
   * 1. Data is compressed (gzip) to reduce size
   * 2. Compressed data is encrypted with AES-256-GCM
   * 3. HMAC-SHA512 is computed over all data for integrity
   */
  async export(data: ICMSFData, password: string, filePath: string): Promise<void> {
    // Validate password strength
    if (password.length < 12) {
      throw new Error('Password must be at least 12 characters for security');
    }

    // Generate cryptographically secure random values
    const salt = crypto.randomBytes(this.SALT_LENGTH);
    const iv = crypto.randomBytes(this.IV_LENGTH);

    // Derive encryption and HMAC keys
    const encryptionKey = this.deriveKey(password, salt);
    const hmacKey = this.deriveHmacKey(password, salt);

    // Prepare data for encryption
    const jsonData = JSON.stringify(data);
    const compressed = await gzipAsync(Buffer.from(jsonData, 'utf8'));

    // Encrypt compressed data
    const cipher = crypto.createCipheriv(this.ALGORITHM, encryptionKey, iv);
    let encrypted = cipher.update(compressed);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Get GCM authentication tag
    const tag = cipher.getAuthTag();

    // Create version header (2 bytes, big-endian)
    const version = Buffer.allocUnsafe(this.VERSION_LENGTH);
    version.writeUInt16BE(this.CURRENT_VERSION, 0);

    // Combine all components (except HMAC)
    const dataToHmac = Buffer.concat([version, salt, iv, tag, encrypted]);

    // Generate HMAC over all data for additional integrity verification
    const hmac = this.generateHmac(dataToHmac, hmacKey);

    // Final file structure: VERSION + SALT + IV + TAG + HMAC + ENCRYPTED_DATA
    const result = Buffer.concat([dataToHmac, hmac]);

    // Write to file with restricted permissions
    await fs.writeFile(filePath, result, { mode: 0o600 });
  }

  /**
   * Import connection data from encrypted ICMSF file
   *
   * Performs multiple security verifications:
   * 1. Version check for compatibility
   * 2. HMAC verification for integrity
   * 3. GCM tag verification during decryption
   * 4. Decompression of encrypted data
   */
  async import(filePath: string, password: string): Promise<ICMSFData> {
    // Read file
    const fileData = await fs.readFile(filePath);

    // Minimum file size check
    const minSize = this.VERSION_LENGTH + this.SALT_LENGTH + this.IV_LENGTH +
                    this.TAG_LENGTH + this.HMAC_LENGTH;
    if (fileData.length < minSize) {
      throw new Error('Invalid ICMSF file: file too small');
    }

    // Calculate positions
    let offset = 0;

    // Extract version
    const version = fileData.readUInt16BE(offset);
    offset += this.VERSION_LENGTH;

    // Check version compatibility
    if (version > this.CURRENT_VERSION) {
      throw new Error(
        `Unsupported ICMSF file version ${version}. Please update Terminium.`
      );
    }

    // Extract components
    const salt = fileData.subarray(offset, offset + this.SALT_LENGTH);
    offset += this.SALT_LENGTH;

    const iv = fileData.subarray(offset, offset + this.IV_LENGTH);
    offset += this.IV_LENGTH;

    const tag = fileData.subarray(offset, offset + this.TAG_LENGTH);
    offset += this.TAG_LENGTH;

    const encrypted = fileData.subarray(offset, fileData.length - this.HMAC_LENGTH);
    const storedHmac = fileData.subarray(fileData.length - this.HMAC_LENGTH);

    // Derive keys
    const encryptionKey = this.deriveKey(password, salt);
    const hmacKey = this.deriveHmacKey(password, salt);

    // Verify HMAC first (protect against tampering)
    const dataToVerify = fileData.subarray(0, fileData.length - this.HMAC_LENGTH);
    if (!this.verifyHmac(dataToVerify, storedHmac, hmacKey)) {
      throw new Error('ICMSF file integrity check failed. File may be corrupted or tampered with.');
    }

    // Decrypt data
    const decipher = crypto.createDecipheriv(this.ALGORITHM, encryptionKey, iv);
    decipher.setAuthTag(tag);

    let decrypted: Buffer;
    try {
      let decryptedData = decipher.update(encrypted);
      decryptedData = Buffer.concat([decryptedData, decipher.final()]);
      decrypted = decryptedData;
    } catch (error) {
      throw new Error('Decryption failed. Incorrect password or corrupted file.');
    }

    // Decompress data
    let decompressed: Buffer;
    try {
      decompressed = await gunzipAsync(decrypted);
    } catch (error) {
      throw new Error('Decompression failed. File may be corrupted.');
    }

    // Parse JSON
    try {
      return JSON.parse(decompressed.toString('utf8'));
    } catch (error) {
      throw new Error('Invalid JSON data in ICMSF file.');
    }
  }
}
