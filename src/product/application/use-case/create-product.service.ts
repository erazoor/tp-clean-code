import { Inject, Injectable } from '@nestjs/common';
import { ProductRepositoryInterface } from '../../domain/port/persistance/product.repository.interface';
import { Product } from '../../domain/entity/product.entity';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async execute(
    name: string,
    price: number,
    description: string,
    stock?: number,
  ): Promise<Product> {
    if (!name || !price || !description) {
      throw new Error(
        'Name, price, and description are required to create a product.',
      );
    }

    const product = new Product(name, price, description, stock ?? 0);

    return this.productRepository.save(product);
  }
}
