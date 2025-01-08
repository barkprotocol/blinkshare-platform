import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';
import crypto from 'crypto';
import { IsEmail } from 'class-validator';

enum WalletType {
  GENERATED = 1,
  IMPORTED = 2,
  EMBEDDED = 3,
  HARDWARE = 4,
}

@Entity()
export class Wallet {
  constructor(address: string, discordUserId: string, privateKey?: string, type: WalletType = WalletType.EMBEDDED) {
    this.address = address;
    this.discordUserId = discordUserId;
    this.type = type; // Use provided wallet type, default to EMBEDDED
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
    if (!process.env.TOKEN_SECRET_KEY) {
      throw new Error('TOKEN_SECRET_KEY is not defined in environment variables.');
    }

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
    if (!process.env.TOKEN_SECRET_KEY) {
      throw new Error('TOKEN_SECRET_KEY is not defined in environment variables.');
    }

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
    // Ensure that the caller is authorized before accessing the private key
    return this.decryptPrivateKey();
  }

  /**
   * Optionally add a method to reset or update the private key securely
   */
  public resetPrivateKey(newPrivateKey: string): void {
    this.privateKey = this.encryptPrivateKey(newPrivateKey); // Encrypt new private key
  }

  /**
   * Validates the address and discordUserId format
   */
  public validate() {
    // Add validation for Discord ID (e.g., must be a valid Discord User ID format)
    const discordIdPattern = /^\d{17,19}$/;  // Assuming Discord IDs are numeric with 18-19 digits
    if (!discordIdPattern.test(this.discordUserId)) {
      throw new Error('Invalid Discord User ID format');
    }

    // Add validation for address if needed
    if (!this.address || this.address.length === 0) {
      throw new Error('Wallet address is required and must not be empty.');
    }
  }
}
