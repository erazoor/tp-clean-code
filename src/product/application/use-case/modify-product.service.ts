import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepositoryInterface } from '../../domain/port/persistance/product.repository.interface';
import { Product } from '../../domain/entity/product.entity';

@Injectable()
export class ModifyProductUseCase {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async execute(
    productId: string,
    name: string,
    price: number,
    description: string,
    stock?: number,
  ): Promise<Product> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.modify(name, price, description, stock);

    return this.productRepository.save(product);
  }
}
