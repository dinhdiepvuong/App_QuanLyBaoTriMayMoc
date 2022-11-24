import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @Column({ default: false })
  isDeteled: boolean;
  @Column({ default: false })
  isActive: boolean;
}
