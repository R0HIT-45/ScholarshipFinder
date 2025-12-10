import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scholarshipId: number;

  @Column({ type: 'int', nullable: true })
  userId?: number | null;

  @Column()
  studentName: string;

  @Column()
  email: string;

  @Column()
  essay: string;

  // NEW COLUMN
  @Column({ default: 'Pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}