import { CreateDateColumn } from 'typeorm';

export class BaseEntity<T> {
  constructor(data: Partial<T>) {
    // Assign the provided partial data to the current instance
    Object.assign(this, data);
  }

  /**
   * The timestamp when the entity was created.
   * Automatically set by TypeORM on insertion.
   */
  @CreateDateColumn()
  createTime: Date;
}
