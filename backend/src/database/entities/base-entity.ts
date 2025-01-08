import { PrimaryColumn, CreateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

/**
 * Base entity class that can be extended by other entities.
 */
export class BaseEntity<T extends { id?: string }> {
  /**
   * Primary ID field, automatically generated if not provided.
   * This is needed for TypeORM to know which column is the primary key.
   */
  @PrimaryColumn({ type: 'varchar', unique: true })
  id: string;

  /**
   * Automatically sets the creation timestamp when the record is created.
   */
  @CreateDateColumn()
  createTime: Date;

  // Constructor to allow easy creation of entities
  constructor(data: Partial<T> = {}) {
    // Handle `id` property in a type-safe manner and ensure UUID generation only when not provided
    this.id = data.id || uuidv4();  // Automatically generate UUID if not provided

    // TypeORM will auto-generate this field, but we can set it manually here for clarity
    this.createTime = this.createTime || new Date();

    // Use Object.assign to populate the rest of the fields
    Object.assign(this, data);
  }
}
