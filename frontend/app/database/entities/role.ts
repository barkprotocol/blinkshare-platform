import { Entity, Column, ManyToOne, PrimaryColumn, UpdateDateColumn, Unique, DeleteDateColumn, Index } from 'typeorm';
import { Guild } from './guild';
import { BaseEntity } from './base-entity';

@Entity()
@Unique(["guild", "name"])
@Index('guild_roles_idx', ['guild'])  // Optional: Add an index on guild for performance
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
  deletedAt: Date | null; // Optional: For soft delete functionality

  /**
   * Validates if the amount for the role is correct.
   */
  validateAmount(): boolean {
    if (this.amount <= 0) {
      throw new Error('Amount must be greater than 0.');
    }
    return true;
  }
}
