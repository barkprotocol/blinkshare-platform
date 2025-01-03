import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';
import crypto from 'crypto';

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
      this.privateKey = this.encryptPrivateKey(privateKey); // Encrypt private key before storing
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

  /**
   * Encrypts the private key before storing it
   */
  private encryptPrivateKey(privateKey: string): string {
    try {
      const iv = crypto.randomBytes(16); // Initialization Vector for added security
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.TOKEN_SECRET_KEY, 'hex'), iv);
      let encrypted = cipher.update(privateKey, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const ivHex = iv.toString('hex'); // Store IV along with the encrypted key
      return ivHex + ':' + encrypted; // Use colon as separator
    } catch (error) {
      console.error('Error encrypting private key:', error);
      throw new Error('Failed to encrypt private key');
    }
  }

  /**
   * Decrypts the private key when needed
   */
  private decryptPrivateKey(): string {
    try {
      if (!this.privateKey) {
        throw new Error('No private key available');
      }

      const [ivHex, encryptedKey] = this.privateKey.split(':'); // Retrieve IV and encrypted key
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.TOKEN_SECRET_KEY, 'hex'), iv);
      let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error('Error decrypting private key:', error);
      throw new Error('Failed to decrypt private key');
    }
  }

  /**
   * Retrieves the decrypted private key (use with caution)
   */
  public getPrivateKey(): string {
    return this.decryptPrivateKey();
  }
}
