import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

enum WalletType {
  GENERATED = 1,
  IMPORTED = 2,
  EMBEDDED = 3,
}

enum WalletStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

enum AccessLevel {
  BASIC = 'basic',
  PAID = 'paid',
}

@Entity()
export class Wallet {
  constructor(address: string, discordUserId: string) {
    this.address = address;
    this.discordUserId = discordUserId;
    this.type = WalletType.EMBEDDED;
    this.status = WalletStatus.PENDING; // Default status to pending until verified
    this.accessLevel = AccessLevel.BASIC; // Default access level is basic
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
   * Encrypted private key for this wallet (Optional for security reasons)
   */
  @Column({ type: 'varchar', nullable: true })
  privateKey: string;

  /**
   * Type of the wallet based on how it was created
   */
  @Column({ type: 'enum', enum: WalletType })
  type: WalletType;

  /**
   * Current status of the wallet (active, suspended, etc.)
   */
  @Column({ type: 'enum', enum: WalletStatus })
  status: WalletStatus;

  /**
   * Access level of the user, such as basic or paid access to features
   */
  @Column({ type: 'enum', enum: AccessLevel })
  accessLevel: AccessLevel;

  /**
   * Last transaction timestamp, tracking recent wallet activity
   */
  @Column({ type: 'timestamp', nullable: true })
  lastTransaction: Date;

  /**
   * Solana balance for the wallet (optional field to track balance for access verification)
   */
  @Column({ type: 'float', nullable: true })
  solanaBalance: number;

  /**
   * Date when the wallet was created
   */
  @CreateDateColumn()
  createTime: Date;

  /**
   * Date when the wallet was last updated
   */
  @UpdateDateColumn()
  updateTime: Date;
}
