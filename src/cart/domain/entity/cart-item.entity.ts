import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from 'src/product/domain/entity/product.entity';
import { BadRequestException } from '@nestjs/common';

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
    if (!product) {
      throw new BadRequestException('Product is required');
    }

    if (quantity > product.stock) {
      throw new BadRequestException(
        `Not enough stock for the product: ${product.name}`,
      );
    }

    this.product = product;
    this.quantity = quantity;
    this.subtotal = this.calculateSubtotal();
  }

  calculateSubtotal(): number {
    return this.product.price * this.quantity;
  }

  updateQuantity(newQuantity: number): void {
    if (newQuantity > this.product.stock) {
      throw new BadRequestException(
        `Not enough stock for the product: ${this.product.name}`,
      );
    }

    this.quantity = newQuantity;
    this.subtotal = this.calculateSubtotal();
  }
}
