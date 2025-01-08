import { Entity, PrimaryColumn, Column, OneToMany, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Role } from './role';
import { Guild } from './guild';
import { BaseEntity } from './base-entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User extends BaseEntity<User> {
  @PrimaryColumn({ type: 'varchar', unique: true })
  id!: string;

  @Column({ type: 'varchar' })
  username!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  passwordHash!: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // For checking if the user is active

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean; // For checking if the user has admin rights

  @OneToMany(() => Guild, (guild) => guild.createdBy, { onDelete: 'SET NULL' })
  createdGuilds!: Guild[];

  @OneToMany(() => Role, (role) => role.user, { onDelete: 'CASCADE' })
  roles!: Role[];

  @UpdateDateColumn()
  updateTime!: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  // Constructor to automatically generate the ID if not provided
  constructor(data: Partial<User> = {}) {
    super(data); // Call the constructor of BaseEntity to handle common fields
    if (!this.id) {
      this.id = uuidv4(); // Generate a UUID if not provided
    }
    Object.assign(this, data); // Populate the entity with the rest of the fields
  }
}
