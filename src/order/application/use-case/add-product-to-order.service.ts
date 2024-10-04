import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product.repository.interface';
import { DecrementStockService } from 'src/product/domain/service/decrement-stock.service';

@Injectable()
export class AddProductToOrderUseCase {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
    @Inject('DecrementStockService')
    private readonly DecrementStockService: DecrementStockService,
  ) {}

  async execute(
    orderId: string,
    productId: string,
    quantity: number,
  ): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.DecrementStockService.execute(productId, quantity);

    order.addProduct(product, quantity);

    await this.orderRepository.save(order);
    return order;
  }
}
