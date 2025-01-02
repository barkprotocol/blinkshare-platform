import { Entity, Column, PrimaryColumn, Index } from 'typeorm';
import { BaseEntity } from './base-entity';
import crypto from 'crypto';

/**
 * Used to store discord access tokens when assigning roles to a user
 * Access token has a longer lifetime, while grant code has just 1 minute
 * For safety, store the access token (encrypted), in case the user purchase flow takes more than 1 minute
 */
@Entity()
export class AccessToken extends BaseEntity<AccessToken> {
  /**
   * Discord OAuth grant code
   */
  @PrimaryColumn({ type: 'varchar', unique: true })
  code: string;

  /**
   * Discord user ID
   */
  @Column({ type: 'varchar' })
  @Index()  // Index to speed up lookups for user
  discordUserId: string;

  /**
   * Encrypted access token
   */
  @Column({ type: 'varchar' })
  token: string;

  /**
   * Date and time when the token expires
   */
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  /**
   * Encrypts the access token before storing it
   */
  encryptToken(token: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.TOKEN_SECRET_KEY); // Use environment variable for the secret key
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Decrypts the access token when retrieving it
   */
  decryptToken(): string {
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.TOKEN_SECRET_KEY); // Use environment variable for the secret key
    let decrypted = decipher.update(this.token, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Checks if the token is expired
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
