import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn, BeforeInsert } from 'typeorm';
import { Guild } from './guild';
import { Role } from './role';
import { BaseEntity } from './base-entity';

@Entity()
export class RolePurchase extends BaseEntity<RolePurchase> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Discord ID of the user purchaser
   */
  @Column({ type: 'varchar' })
  discordUserId: string;

  @ManyToOne(() => Guild, { nullable: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'guildId' })
  guild: Guild;

  @ManyToOne(() => Role, { nullable: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  /**
   * If role is limited time only, this is when it expires
   */
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  /**
   * Signature of the payment transaction
   */
  @Column({ type: 'varchar', nullable: true })
  signature: string | null;

  /**
   * Date and time when the role was purchased
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  purchaseTime: Date;

  /**
   * Sets the expiration time based on the guild's limited time role settings
   */
  setExpiresAt(): this {
    if (!this.guild) {
      throw new Error('Guild is not defined.');
    }

    const { limitedTimeUnit, limitedTimeQuantity, limitedTimeRoles } = this.guild;

    // If the guild does not have limited time roles, we do not need to set an expiration
    if (!limitedTimeRoles) {
      this.expiresAt = null; // Ensure expiresAt is null if not limited time
      return this;
    }

    if (!limitedTimeUnit || !limitedTimeQuantity) {
      throw new Error('Limited time unit or quantity not specified in guild settings.');
    }

    const now = new Date();
    const expiryDate = new Date(now);

    // Add time based on the guild's role expiration unit and quantity
    switch (limitedTimeUnit) {
      case 'Hours':
        expiryDate.setHours(expiryDate.getHours() + +limitedTimeQuantity);
        break;
      case 'Days':
        expiryDate.setDate(expiryDate.getDate() + +limitedTimeQuantity);
        break;
      case 'Weeks':
        expiryDate.setDate(expiryDate.getDate() + +limitedTimeQuantity * 7);
        break;
      case 'Months':
        expiryDate.setMonth(expiryDate.getMonth() + +limitedTimeQuantity);
        break;
      default:
        throw new Error(`Unsupported time unit: ${limitedTimeUnit}`);
    }

    this.expiresAt = expiryDate;

    // Optional: Log expiry time using a logging library for production environments
    console.warn(`Role for user ${this.discordUserId} will expire at ${this.expiresAt}`);

    return this;
  }

  @DeleteDateColumn()
  deletedAt: Date | null = null;

  /**
   * Validate discordUserId format
   */
  @BeforeInsert()  // Ensures that discordUserId is valid before insertion
  validateDiscordUserId(): void {
    if (!this.discordUserId || this.discordUserId.trim() === '') {
      throw new Error('Discord User ID must not be empty.');
    }
    // You can also add regex validation here to ensure a valid Discord ID format.
    const discordIdPattern = /^\d{17,19}$/;  // Assuming Discord IDs are numeric with 18-19 digits
    if (!discordIdPattern.test(this.discordUserId)) {
      throw new Error('Discord User ID is not valid.');
    }
  }
}
