import { Entity, Column, OneToMany, UpdateDateColumn, DeleteDateColumn, ManyToOne, PrimaryColumn, Index } from 'typeorm';
import { Role } from './role'; 
import { BaseEntity } from './base-entity';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';

enum TimeUnit {
  Hours = 'Hours',
  Days = 'Days',
  Weeks = 'Weeks',
  Months = 'Months',
}

@Entity()
@Index('guild_address_idx', ['address'])
export class Guild extends BaseEntity<Guild> {
  @PrimaryColumn({ type: 'varchar', unique: true })
  id!: string;

  @Column({ type: 'varchar' })
  address!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  iconUrl!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @Column({ type: 'text', nullable: true })
  website?: string;

  @Column({ type: 'varchar', nullable: true })
  notificationChannelId?: string;

  @Column({ type: 'boolean', default: false })
  useUsdc: boolean;

  @Column({ type: 'boolean', default: false })
  hidden: boolean;

  @OneToMany(() => Role, (role) => role.guild, { onDelete: 'CASCADE' })
  roles!: Role[];

  @Column({ type: 'boolean', default: false })
  limitedTimeRoles: boolean;

  @Column({ type: 'int', nullable: true })
  limitedTimeQuantity?: number;

  @Column({ type: 'enum', enum: TimeUnit, nullable: true })
  limitedTimeUnit?: TimeUnit;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;  // New field for active status

  @UpdateDateColumn()
  updateTime!: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  @ManyToOne(() => User, { nullable: true })
  createdBy?: User | null;

  /**
   * Validates if the limited time role settings are correct.
   */
  validateLimitedTimeRoles(): { valid: boolean; message: string } {
    if (this.limitedTimeRoles) {
      if (!this.limitedTimeQuantity || this.limitedTimeQuantity <= 0) {
        return { valid: false, message: 'Limited time roles must have a valid quantity greater than zero.' };
      }
      if (!this.limitedTimeUnit) {
        return { valid: false, message: 'Limited time roles must have a valid time unit.' };
      }
    }
    return { valid: true, message: 'Limited time roles are correctly set.' };
  }

  // Constructor to automatically generate the ID if not provided
  constructor(data: Partial<Guild> = {}) {
    super(data); // Call the constructor of BaseEntity to handle common fields
    if (!this.id) {
      this.id = uuidv4();  // Generate a UUID if not provided
    }
    Object.assign(this, data);  // Populate the entity with the rest of the fields
  }
}
