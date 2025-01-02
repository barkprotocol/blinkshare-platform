import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity<T> {
  // Constructor to allow easy creation of entities
  constructor(data: Partial<T>) {
    Object.assign(this, data);
  }

  /**
   * Primary ID, typically needed for most entities
   * This is only useful if you want to include an id for all entities
   * Remove if not required or override in child entities
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Automatically sets the creation timestamp when the record is created
   */
  @CreateDateColumn()
  createTime: Date;
}
