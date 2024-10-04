import { ListProductsUseCase } from '../../../application/use-case/list-product.service';
import { ProductRepositoryInterface } from '../../../domain/port/persistance/product.repository.interface';
import { Product } from '../../../domain/entity/product.entity';
import * as assert from 'assert';

class ProductRepositoryFake implements ProductRepositoryInterface {
  save(product: Product): Promise<Product> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Product | null> {
    throw new Error('Method not implemented.');
  }
  removeProduct(product: Product): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<Product[]> {
    return Promise.resolve([
      new Product('Product 1', 100, 'Description 1', 10),
      new Product('Product 2', 200, 'Description 2', 0),
    ]);
  }
}

describe('ListProductsUseCase', () => {
  it('should return all products when isActive is undefined', async () => {
    const productRepository = new ProductRepositoryFake();
    const listProductsUseCase = new ListProductsUseCase(productRepository);

    const products = await listProductsUseCase.execute();
    assert.strictEqual(products.length, 2);
  });
});
