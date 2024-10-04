import { CreateProductUseCase } from '../create-product.service';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product.repository.interface';
import { Product } from '../../../domain/entity/product.entity';

class ProductRepositoryFake {
  save = jest.fn();
}

describe('CreateProductUseCase', () => {
  let createProductUseCase: CreateProductUseCase;
  let productRepository: ProductRepositoryInterface;

  beforeEach(() => {
    productRepository =
      new ProductRepositoryFake() as unknown as ProductRepositoryInterface;
    createProductUseCase = new CreateProductUseCase(productRepository);
  });

  it('should create a product and save it', async () => {
    const product = new Product('Test Product', 100, 'Test description', 10);
    (productRepository.save as jest.Mock).mockResolvedValue(product);

    const result = await createProductUseCase.execute(
      'Test Product',
      100,
      'Test description',
      10,
    );

    expect(productRepository.save).toHaveBeenCalledWith(product);
    expect(result).toEqual(product);
  });

  it('should create a product with default stock when stock is not provided', async () => {
    const product = new Product('Test Product', 100, 'Test description');
    (productRepository.save as jest.Mock).mockResolvedValue(product);

    const result = await createProductUseCase.execute(
      'Test Product',
      100,
      'Test description',
    );

    expect(productRepository.save).toHaveBeenCalledWith(product);
    expect(result.stock).toBe(0);
  });

  it('should throw an error if name is missing', async () => {
    await expect(
      createProductUseCase.execute('', 100, 'Test description'),
    ).rejects.toThrow('Product must have a name, price, and description.');
  });

  it('should throw an error if price is missing', async () => {
    await expect(
      createProductUseCase.execute('Test Product', NaN, 'Test description'),
    ).rejects.toThrow('Product must have a name, price, and description.');
  });

  it('should throw an error if description is missing', async () => {
    await expect(
      createProductUseCase.execute('Test Product', 100, ''),
    ).rejects.toThrow('Product must have a name, price, and description.');
  });
});
