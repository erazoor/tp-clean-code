import { Inject, Injectable } from '@nestjs/common';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product.repository.interface';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
  ) {}

  async execute(productId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const ordersWithProduct = await this.orderRepository.findByProductId(
      productId,
    );

    if (Array.isArray(ordersWithProduct) && ordersWithProduct.length > 0) {
      throw new ConflictException(
        'Cannot delete product linked to an existing order',
      );
    }

    await this.productRepository.removeProduct(product);
  }
}
