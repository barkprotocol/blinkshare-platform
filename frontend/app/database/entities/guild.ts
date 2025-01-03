import { Entity, Column, OneToMany, PrimaryColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, Index } from 'typeorm';
import { Role } from './role';
import { BaseEntity } from './base-entity';
import { User } from './user';

enum TimeUnit {
  Hours = 'Hours',
  Days = 'Days',
  Weeks = 'Weeks',
  Months = 'Months',
}

@Entity()
@Index('guild_address_idx', ['address']) // Optional: Add index to address for faster lookup
export class Guild extends BaseEntity<Guild> {
  @PrimaryColumn({ type: 'varchar', unique: true })
  id: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  iconUrl: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ type: 'text', nullable: true })
  website: string;

  @Column({ type: 'varchar', nullable: true })
  notificationChannelId: string;

  @Column({ type: 'boolean', default: false })
  useUsdc: boolean;

  @Column({ type: 'boolean', default: false })
  hidden: boolean;

  @OneToMany(() => Role, (role) => role.guild, { onDelete: 'CASCADE' })
  roles: Role[];

  @Column({ type: 'boolean', default: false })
  limitedTimeRoles: boolean;

  @Column({ type: 'int', nullable: true })
  limitedTimeQuantity: number;

  @Column({ type: 'enum', enum: TimeUnit, nullable: true })
  limitedTimeUnit: TimeUnit;

  @UpdateDateColumn()
  updateTime: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, { nullable: true })
  createdBy: User | null;

  /**
   * Validates if the limited time role settings are correct.
   */
  validateLimitedTimeRoles(): boolean | { valid: boolean, message: string } {
    if (this.limitedTimeRoles) {
      if (!this.limitedTimeQuantity) {
        return { valid: false, message: 'Limited time roles must have a valid quantity.' };
      }
      if (!this.limitedTimeUnit) {
        return { valid: false, message: 'Limited time roles must have a valid time unit.' };
      }
    }
    return { valid: true, message: 'Valid' };
  }
}
