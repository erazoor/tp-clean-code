import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Promotion } from 'src/promotion/domain/entity/promotion.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem)
  items: CartItem[];

  @Column({ type: 'float', default: 0 })
  totalAmount: number;
  promotionCode: string;

  constructor() {
    this.items = [];
    this.totalAmount = 0;
  }

  addProduct(product: CartItem): void {
    const existingItem = this.items.find(
      (item) => item.product.id === product.product.id,
    );

    if (existingItem) {
      existingItem.updateQuantity(existingItem.quantity + product.quantity);
    } else {
      this.items.push(product);
    }

    this.recalculateTotal();
  }

  recalculateTotal(): void {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  removeProduct(productId: string): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.recalculateTotal();
  }

  clearCart(): void {
    this.items = [];
    this.totalAmount = 0;
  }

  applyPromotion(promotion: Promotion): void {
    this.promotionCode = promotion.code;
    this.totalAmount -= promotion.amount;

    if (this.totalAmount < 0) {
      this.totalAmount = 0;
    }
  }
}
