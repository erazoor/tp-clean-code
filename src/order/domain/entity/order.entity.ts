import { ItemDetailCommand, OrderItem } from '../entity/order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

import { BadRequestException } from '@nestjs/common';
import { Product } from 'src/product/domain/entity/product.entity';
import { Promotion } from 'src/promotion/domain/entity/promotion.entity';

export interface CreateOrderCommand {
  items: ItemDetailCommand[];
  customerName: string;
  shippingAddress: string;
  invoiceAddress: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPING_ADDRESS_SET = 'SHIPPING_ADDRESS_SET',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

@Entity()
export class Order {
  static MAX_ITEMS = 5;

  static AMOUNT_MINIMUM = 5;

  static AMOUNT_MAXIMUM = 500;

  static SHIPPING_COST = 5;

  @CreateDateColumn()
  @Expose({ groups: ['group_orders'] })
  createdAt: Date;

  @PrimaryGeneratedColumn()
  @Expose({ groups: ['group_orders'] })
  id: string;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  price: number;

  @Column()
  @Expose({ groups: ['group_orders'] })
  customerName: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  @Expose({ groups: ['group_orders'] })
  orderItems: OrderItem[];

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  shippingAddress: string | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  invoiceAddress: string | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  shippingAddressSetAt: Date | null;

  @Column()
  @Expose({ groups: ['group_orders'] })
  private status: string;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private paidAt: Date | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private cancelAt: Date | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private cancelReason: string | null;

  @Column()
  totalAmount: number;

  @Column({ nullable: true })
  promotionCode: string;

  getStatus(): string {
    return this.status;
  }

  public constructor(createOrderCommand?: CreateOrderCommand) {
    if (!createOrderCommand) {
      return;
    }

    this.verifyOrderCommandIsValid(createOrderCommand);
    this.verifyMaxItemIsValid(createOrderCommand);

    this.orderItems = createOrderCommand.items.map(
      (item) => new OrderItem(item),
    );

    this.customerName = createOrderCommand.customerName;
    this.shippingAddress = createOrderCommand.shippingAddress;
    this.invoiceAddress = createOrderCommand.invoiceAddress;
    this.status = OrderStatus.PENDING;
    this.price = this.calculateOrderAmount(createOrderCommand.items);
  }

  private verifyMaxItemIsValid(createOrderCommand: CreateOrderCommand) {
    if (createOrderCommand.items.length > Order.MAX_ITEMS) {
      throw new BadRequestException(
        'Cannot create order with more than 5 items',
      );
    }
  }

  private verifyOrderCommandIsValid(createOrderCommand: CreateOrderCommand) {
    if (
      !createOrderCommand.customerName ||
      !createOrderCommand.items ||
      createOrderCommand.items.length === 0 ||
      !createOrderCommand.shippingAddress ||
      !createOrderCommand.invoiceAddress
    ) {
      throw new BadRequestException('Missing required fields');
    }
  }

  private calculateOrderAmount(items: ItemDetailCommand[]): number {
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    if (totalAmount < Order.AMOUNT_MINIMUM) {
      throw new BadRequestException(
        `Cannot create order with total amount less than ${Order.AMOUNT_MINIMUM}€`,
      );
    }

    return totalAmount;
  }

  pay(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Commande déjà payée');
    }

    if (this.price > Order.AMOUNT_MAXIMUM) {
      throw new Error('Montant maximum dépassé');
    }

    this.status = OrderStatus.PAID;
    this.paidAt = new Date();
  }

  setShippingAddress(customerAddress: string): void {
    if (
      this.status !== OrderStatus.PENDING &&
      this.status !== OrderStatus.SHIPPING_ADDRESS_SET
    ) {
      throw new Error('Commande non payée');
    }

    if (this.orderItems.length < Order.MAX_ITEMS) {
      throw new Error('Trop d’articles');
    }

    this.status = OrderStatus.SHIPPING_ADDRESS_SET;
    this.shippingAddressSetAt = new Date();
    this.shippingAddress = customerAddress;
    this.price += Order.SHIPPING_COST;
  }

  setInvoiceAddress(invoiceAddress?: string): void {
    if (this.status !== OrderStatus.SHIPPING_ADDRESS_SET) {
      throw new Error('Adresse de livraison non définie');
    }

    if (!invoiceAddress) {
      this.invoiceAddress = this.shippingAddress;
      return;
    }

    this.invoiceAddress = invoiceAddress;
  }

  cancel(cancelReason: string): void {
    if (
      this.status === OrderStatus.SHIPPED ||
      this.status === OrderStatus.DELIVERED ||
      this.status === OrderStatus.CANCELED
    ) {
      throw new Error('Vous ne pouvez pas annuler cette commande');
    }

    this.status = OrderStatus.CANCELED;
    this.cancelAt = new Date('NOW');
    this.cancelReason = cancelReason;
  }

  getInvoiceInfos(): string {
    if (
      this.status !== OrderStatus.PAID &&
      this.status !== OrderStatus.SHIPPED &&
      this.status !== OrderStatus.DELIVERED
    ) {
      throw new Error('Order is not paid');
    }

    const itemsNames = this.orderItems
      .map((item) => item.productName)
      .join(', ');
    return `invoice number ${this.id}, with items: ${itemsNames}`;
  }

  addProduct(
    product: { productName: string; price: number },
    quantity: number,
  ): void {
    const existingItem = this.orderItems.find(
      (item) => item.productName === product.productName,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const orderItem = new OrderItem({
        productName: product.productName,
        price: product.price,
        quantity,
      });
      this.orderItems.push(orderItem);
    }

    this.recalculateTotal();
  }

  recalculateTotal(): void {
    this.totalAmount = this.orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  applyPromotion(promotion: Promotion): void {
    this.promotionCode = promotion.code;
    this.totalAmount -= promotion.amount;

    if (this.totalAmount < 0) {
      this.totalAmount = 0;
    }
  }

  changeStatus(newStatus: string): void {
    const allowedTransitions = {
      PENDING: ['PAID', 'CANCELLED'],
      PAID: ['SHIPPED'],
    };

    const currentStatusTransitions = allowedTransitions[this.status];

    if (
      !currentStatusTransitions ||
      !currentStatusTransitions.includes(newStatus)
    ) {
      throw new Error(
        `Cannot change order status from ${this.status} to ${newStatus}`,
      );
    }

    this.status = newStatus;
  }

  cancelOrder(reason: string): void {
    if (this.status === 'SHIPPED') {
      throw new Error('Cannot cancel a shipped order');
    }

    this.status = 'CANCELLED';
    this.cancelReason = reason;
    this.cancelAt = new Date();
  }
}
