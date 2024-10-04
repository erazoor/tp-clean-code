import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepositoryInterface } from '../port/persistance/product.repository.interface';
import { EmailServiceInterface } from 'src/product/infrastructure/email/email.service.interface';

@Injectable()
export class DecrementStockUseCase {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
    @Inject('EmailServiceInterface')
    private readonly emailService: EmailServiceInterface,
  ) {}

  async execute(productId: string, quantity: number): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock for this product');
    }

    product.stock -= quantity;

    if (product.stock === 0) {
      await this.emailService.notifyStockDepleted('adming@test.fr', product);
    }

    await this.productRepository.save(product);
  }
}
