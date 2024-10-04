import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: 'float' })
  price: number;

  @Column({ nullable: false })
  description: string;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  constructor(
    name: string,
    price: number,
    description: string,
    stock?: number,
  ) {
    if (!name || !price || !description) {
      throw new Error('Product must have a name, price, and description.');
    }

    this.name = name;
    this.price = price;
    this.description = description;
    this.stock = stock || 0;
    this.isActive = true;
  }
}
