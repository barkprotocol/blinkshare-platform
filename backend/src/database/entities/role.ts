import { Entity, Column, ManyToOne, PrimaryColumn, UpdateDateColumn, Unique, DeleteDateColumn, Index } from 'typeorm';
import { Guild } from './guild';
import { BaseEntity } from './base-entity';

@Entity()
@Unique(["guild", "name"])
@Index('guild_roles_idx', ['guild', 'name'])  // Composite index for faster lookups by both guild and name
export class Role extends BaseEntity<Role> {
  /**
   * Discord role ID
   */
  @PrimaryColumn({ type: 'varchar', unique: true })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  /**
   * Amount of Solana this role costs
   */
  @Column('decimal', { precision: 9, scale: 5 })
  amount: number;

  @ManyToOne(() => Guild, (guild) => guild.roles, { nullable: false, onDelete: 'CASCADE' })
  guild: Guild;

  @UpdateDateColumn()
  updateTime: Date;

  @DeleteDateColumn()
  deletedAt: Date | null; // Soft delete functionality

  /**
   * Validates if the amount for the role is correct.
   */
  validateAmount(): boolean {
    if (this.amount <= 0) {
      throw new Error('Amount must be greater than 0.');
    }
    return true;
  }

  /**
   * Optionally add a lifecycle hook to validate the amount before insert or update.
   */
  @BeforeInsert()  // Ensure valid amount before insertion
  @BeforeUpdate()  // Ensure valid amount before update
  validateAmountBeforeSave(): void {
    this.validateAmount();
  }
}
