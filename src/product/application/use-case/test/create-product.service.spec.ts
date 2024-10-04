import { CreateProductUseCase } from '../../../application/use-case/create-product.service';
import { ProductRepositoryInterface } from '../../../domain/port/persistance/product.repository.interface';
import { Product } from '../../../domain/entity/product.entity';
import * as assert from 'assert';

class ProductRepositoryFake implements ProductRepositoryInterface {
  private products: Product[] = [];

  findById(id: string): Promise<Product | null> {
    const product = this.products.find((product) => product.id === id);
    return Promise.resolve(product || null);
  }

  findAll(): Promise<Product[]> {
    return Promise.resolve(this.products);
  }

  removeProduct(product: Product): Promise<void> {
    this.products = this.products.filter((p) => p.id !== product.id);
    return Promise.resolve();
  }

  save(product: Product): Promise<Product> {
    this.products.push(product);
    return Promise.resolve(product);
  }
}

describe('CreateProductUseCase', () => {
  it('should create and save a product successfully', async () => {
    const productRepository = new ProductRepositoryFake();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const product = await createProductUseCase.execute(
      'Test Product',
      100,
      'Test description',
      10,
    );

    assert.strictEqual(product.name, 'Test Product');
    assert.strictEqual(product.price, 100);
    assert.strictEqual(product.description, 'Test description');
    assert.strictEqual(product.stock, 10);
  });
});
