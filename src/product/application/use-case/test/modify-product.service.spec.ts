import { ModifyProductUseCase } from '../../../application/use-case/modify-product.service';
import { ProductRepositoryInterface } from '../../../domain/port/persistance/product.repository.interface';
import { Product } from '../../../domain/entity/product.entity';
import * as assert from 'assert';

class ProductRepositoryFake implements ProductRepositoryInterface {
  private products: Product[] = [
    Object.assign(
      new Product('Existing Product', 100, 'Existing Description', 10),
      { id: '1' },
    ),
  ];

  findAll(): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
  removeProduct(product: Product): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findById(id: string): Promise<Product | null> {
    const product = this.products.find((product) => product.id === id);
    return Promise.resolve(product || null);
  }

  save(product: Product): Promise<Product> {
    return Promise.resolve(product);
  }
}

describe('ModifyProductUseCase', () => {
  it('should modify the product details and save it', async () => {
    const productRepository = new ProductRepositoryFake();
    const modifyProductUseCase = new ModifyProductUseCase(productRepository);

    const productId = '1';
    const modifiedProduct = await modifyProductUseCase.execute(
      productId,
      'Modified Product',
      150,
      'Modified Description',
      20,
    );

    assert.strictEqual(modifiedProduct.name, 'Modified Product');
    assert.strictEqual(modifiedProduct.price, 150);
    assert.strictEqual(modifiedProduct.description, 'Modified Description');
    assert.strictEqual(modifiedProduct.stock, 20);
  });
});
