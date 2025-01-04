import { PrimaryColumn, CreateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

/**
 * Base entity class that can be extended by other entities.
 */
export class BaseEntity<T> {
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
    // Explicitly initialize the id and createTime properties if not provided
    if (!data.id) {
      this.id = uuidv4();  // Automatically generate UUID if not provided
    } else {
      this.id = data.id as string;  // Use provided id
    }

    // Initialize createTime automatically if not provided (TypeORM will auto-generate this field)
    this.createTime = new Date();

    // Use Object.assign to populate the rest of the fields
    Object.assign(this, data);
  }
}
