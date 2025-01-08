import { Entity, Column, PrimaryColumn, Index } from 'typeorm';
import { BaseEntity } from './base-entity';
import crypto from 'crypto';

/**
 * Used to store Discord access tokens when assigning roles to a user.
 * Access token has a longer lifetime, while grant code has just 1 minute.
 * For safety, store the access token (encrypted), in case the user purchase flow takes more than 1 minute.
 */
@Entity()
export class AccessToken extends BaseEntity<AccessToken> {
  /**
   * Discord OAuth grant code.
   */
  @PrimaryColumn({ type: 'varchar', unique: true })
  code: string;

  /**
   * Discord user ID.
   */
  @Column({ type: 'varchar' })
  @Index()  // Index to speed up lookups for user
  discordUserId: string;

  /**
   * Encrypted access token.
   */
  @Column({ type: 'varchar' })
  token: string;

  /**
   * Date and time when the token expires.
   */
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  /**
   * Encrypts the access token before storing it.
   */
  encryptToken(token: string): string {
    try {
      const iv = crypto.randomBytes(16); // Initialization Vector for added security
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.TOKEN_SECRET_KEY, 'hex'), iv);
      let encrypted = cipher.update(token, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const ivHex = iv.toString('hex'); // Store IV along with the encrypted token
      return ivHex + ':' + encrypted; // Use colon as separator
    } catch (error) {
      console.error('Error encrypting token:', error);
      throw new Error('Failed to encrypt token');
    }
  }

  /**
   * Decrypts the access token when retrieving it.
   */
  decryptToken(): string {
    try {
      const [ivHex, encryptedToken] = this.token.split(':'); // Retrieve IV and encrypted token
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.TOKEN_SECRET_KEY, 'hex'), iv);
      let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error('Error decrypting token:', error);
      throw new Error('Failed to decrypt token');
    }
  }

  /**
   * Checks if the token is expired.
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Validates the token status (if expired).
   */
  validateToken(): void {
    if (this.isExpired()) {
      throw new Error('Token has expired');
    }
  }

  /**
   * Optionally refresh or regenerate token logic if required.
   */
  refreshToken(): string {
    // If token refresh logic is required, you can implement it here
    // for example, re-encrypt the token and reset the expiration date
    const newToken = 'new-token'; // Example placeholder logic
    this.token = this.encryptToken(newToken);
    this.expiresAt = new Date(Date.now() + 3600 * 1000); // Set new expiry (e.g., 1 hour)
    return newToken;
  }
}
