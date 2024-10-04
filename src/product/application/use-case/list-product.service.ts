import { Inject, Injectable } from '@nestjs/common';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product.repository.interface';
import { Product } from '../../domain/entity/product.entity';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async execute(isActive?: boolean): Promise<Product[]> {
    const products = await this.productRepository.findAll();
    if (isActive === undefined) {
      return products;
    }
    return products.filter((product) => product.isActive === isActive);
  }
}
