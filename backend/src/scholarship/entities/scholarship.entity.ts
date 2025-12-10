import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Scholarship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  amount: string;

  @Column()
  description: string;

  @Column()
  deadline: string;

  @CreateDateColumn()
  createdAt: Date;
}