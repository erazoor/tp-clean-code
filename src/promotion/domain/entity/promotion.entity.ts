import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('promotion')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  code: string;

  @Column({ default: 1500 })
  amount: number;

  constructor(name: string, code: string, amount?: number) {
    if (!name || !code) {
      throw new Error('Promotion must have a name and code.');
    }

    this.name = name;
    this.code = code;
    this.amount = amount ?? 1500;
  }
}
