import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base-entity';

/**
 * Used to store Discord access tokens when assigning roles to a user.
 * Access token has a longer lifetime, while the grant code is short-lived (about 1 minute).
 * For security, store the access token encrypted to prevent misuse in case of prolonged purchase flow.
 */
@Entity()
export class AccessToken extends BaseEntity<AccessToken> {
  /**
   * Discord OAuth grant code
   * This code is used to exchange for an access token, but it expires quickly (within 1 minute).
   */
  @PrimaryColumn({ type: 'varchar', unique: true })
  code: string;

  /**
   * Discord user ID to associate the token with a specific user.
   */
  @Column({ type: 'varchar' })
  discordUserId: string;

  /**
   * Encrypted access token
   * This is securely stored to authenticate API calls on behalf of the user.
   */
  @Column({ type: 'varchar' })
  token: string;

  /**
   * Date and time when the access token expires.
   * Used to determine if the token is still valid.
   */
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  /**
   * Optional refresh token, if available.
   * The refresh token allows the application to get a new access token without requiring the user to reauthenticate.
   */
  @Column({ type: 'varchar', nullable: true })
  refreshToken: string;
}
