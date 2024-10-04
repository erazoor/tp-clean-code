import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product.repository.interface';
import { DecrementStockUseCase } from 'src/product/domain/service/decrement-stock.service';

@Injectable()
export class AddProductToOrderUseCase {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
    @Inject('DecrementStockUseCase')
    private readonly decrementStockUseCase: DecrementStockUseCase,
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

    if (order.getStatus() !== 'PENDING') {
      throw new BadRequestException(
        'Cannot add products to a non-pending order',
      );
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.decrementStockUseCase.execute(productId, quantity);

    order.addProduct(
      { productName: product.name, price: product.price },
      quantity,
    );

    await this.orderRepository.save(order);
    return order;
  }
}
