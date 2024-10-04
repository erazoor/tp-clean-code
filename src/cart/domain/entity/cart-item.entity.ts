import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from 'src/product/domain/entity/product.entity';

@Entity('cart_item')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column((type) => Product)
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'float' })
  subtotal: number;

  constructor(product: Product, quantity: number) {
    this.product = product;
    this.quantity = quantity;
    this.subtotal = this.calculateSubtotal();
  }

  calculateSubtotal(): number {
    return this.product.price * this.quantity;
  }

  updateQuantity(newQuantity: number): void {
    this.quantity = newQuantity;
    this.subtotal = this.calculateSubtotal();
  }
}
