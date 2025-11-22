import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import { ICMSFData } from '../types';

export class ICMSFManager {
  private readonly ALGORITHM = 'aes-256-gcm';
  private readonly SALT_LENGTH = 32;
  private readonly IV_LENGTH = 16;
  private readonly TAG_LENGTH = 16;
  private readonly KEY_LENGTH = 32;

  private deriveKey(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(password, salt, 100000, this.KEY_LENGTH, 'sha256');
  }

  async export(data: ICMSFData, password: string, filePath: string): Promise<void> {
    // Generate salt and IV
    const salt = crypto.randomBytes(this.SALT_LENGTH);
    const iv = crypto.randomBytes(this.IV_LENGTH);

    // Derive key from password
    const key = this.deriveKey(password, salt);

    // Encrypt data
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
    const jsonData = JSON.stringify(data);
    let encrypted = cipher.update(jsonData, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Get auth tag
    const tag = cipher.getAuthTag();

    // Combine: salt + iv + tag + encrypted data
    const result = Buffer.concat([salt, iv, tag, encrypted]);

    // Write to file
    await fs.writeFile(filePath, result);
  }

  async import(filePath: string, password: string): Promise<ICMSFData> {
    // Read file
    const data = await fs.readFile(filePath);

    // Extract components
    const salt = data.subarray(0, this.SALT_LENGTH);
    const iv = data.subarray(this.SALT_LENGTH, this.SALT_LENGTH + this.IV_LENGTH);
    const tag = data.subarray(
      this.SALT_LENGTH + this.IV_LENGTH,
      this.SALT_LENGTH + this.IV_LENGTH + this.TAG_LENGTH
    );
    const encrypted = data.subarray(this.SALT_LENGTH + this.IV_LENGTH + this.TAG_LENGTH);

    // Derive key from password
    const key = this.deriveKey(password, salt);

    // Decrypt
    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    // Parse JSON
    return JSON.parse(decrypted.toString('utf8'));
  }
}
