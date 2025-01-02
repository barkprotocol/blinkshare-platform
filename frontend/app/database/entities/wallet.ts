import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

enum WalletType {
  GENERATED = 1,
  IMPORTED = 2,
  EMBEDDED = 3,
}

@Entity()
export class Wallet {
  constructor(address: string, discordUserId: string, privateKey?: string) {
    this.address = address;
    this.discordUserId = discordUserId;
    this.type = WalletType.EMBEDDED; // Default to EMBEDDED if not specified
    if (privateKey) {
      this.privateKey = privateKey; // Optionally add private key
    }
  }

  /**
   * Public address of the wallet
   */
  @PrimaryColumn({ type: 'varchar', unique: true })
  address: string;

  /**
   * Discord ID of user who owns the wallet
   */
  @Column({ type: 'varchar' })
  discordUserId: string;

  /**
   * Encrypted private key for this wallet
   * Consider storing encrypted private keys securely
   */
  @Column({ type: 'varchar', nullable: true })
  privateKey: string;

  /**
   * Type of the wallet based on how it was created
   */
  @Column({ type: 'enum', enum: WalletType })
  type: WalletType;

  /**
   * Date and time when the wallet was created
   */
  @CreateDateColumn()
  createTime: Date;
}
