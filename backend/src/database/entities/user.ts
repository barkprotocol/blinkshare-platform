import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import bcrypt from 'bcryptjs';
import { Guild } from './guild';
import { BaseEntity } from './base-entity';

@Entity()
export class User extends BaseEntity<User> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  discordId: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @OneToMany(() => Guild, (guild) => guild.createdBy)
  createdGuilds: Guild[];

  @OneToMany(() => Guild, (guild) => guild.members)
  guilds: Guild[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @DeleteDateColumn()
  deletedAt: Date | null; // Soft delete support

  // Hash password only if it's being updated or inserted
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10); // Generate salt
      this.password = await bcrypt.hash(this.password, salt);  // Hash the password
    }
  }

  // Additional method to validate password when comparing with stored hash
  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password); // Compare plain password with hash
  }

  // Optionally, exclude sensitive fields (like password) from JSON response
  toJSON() {
    const { password, ...user } = this;  // Remove password field from the response
    return user;  // Return the rest of the user data
  }
}
