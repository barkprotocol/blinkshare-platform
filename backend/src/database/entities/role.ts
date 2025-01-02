import { Entity, Column, ManyToOne, PrimaryColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Guild } from './guild';
import { BaseEntity } from './base-entity';

@Entity()
export class Role extends BaseEntity<Role> {
  /**
   * Discord role ID
   */
  @PrimaryColumn({ type: 'varchar', unique: true })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  /**
   * Description of the role (Optional, for better context)
   */
  @Column({ type: 'varchar', nullable: true })
  description: string;

  /**
   * Amount of Solana this role costs
   * Adding a check to ensure the amount is always positive
   */
  @Column('decimal', { precision: 9, scale: 5, default: 0 })
  amount: number;

  /**
   * The color associated with the role in Discord (Optional)
   */
  @Column({ type: 'varchar', nullable: true })
  color: string;

  /**
   * The Guild this role belongs to
   */
  @ManyToOne(() => Guild, (guild) => guild.roles, { nullable: false, onDelete: 'CASCADE' })
  guild: Guild;

  /**
   * Date when this role was created
   */
  @CreateDateColumn()
  createTime: Date;

  /**
   * Date when this role was last updated
   */
  @UpdateDateColumn()
  updateTime: Date;
}
