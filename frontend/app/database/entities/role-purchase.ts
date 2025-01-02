import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Guild } from './guild';
import { Role } from './role';
import { BaseEntity } from './base-entity';

@Entity()
export class RolePurchase extends BaseEntity<RolePurchase> {
  @PrimaryGeneratedColumn()
  id: number;

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
  expiresAt: Date;

  /**
   * Signature of the payment transaction
   */
  @Column({ type: 'varchar', nullable: true })
  signature: string;

  /**
   * Sets the expiration time based on the guild's limited time role settings
   */
  setExpiresAt() {
    const { limitedTimeUnit, limitedTimeQuantity, limitedTimeRoles } = this.guild;
    if (!limitedTimeRoles) return this;  // No expiration if the role is not limited time

    if (!limitedTimeUnit || !limitedTimeQuantity) {
      throw new Error('Limited time unit or quantity not specified in guild settings.');
    }

    const now = new Date();

    switch (limitedTimeUnit) {
      case 'Hours':
        now.setHours(now.getHours() + +limitedTimeQuantity);
        break;
      case 'Days':
        now.setDate(now.getDate() + +limitedTimeQuantity);
        break;
      case 'Weeks':
        now.setDate(now.getDate() + +limitedTimeQuantity * 7);
        break;
      case 'Months':
        now.setMonth(now.getMonth() + +limitedTimeQuantity);
        break;
      default:
        throw new Error(`Unsupported time unit: ${limitedTimeUnit}`);
    }

    this.expiresAt = now;

    // Optionally log a warning when setting expiration time
    console.warn(`Role expires at ${this.expiresAt}`);

    return this;
  }
}
