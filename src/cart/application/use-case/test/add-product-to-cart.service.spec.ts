import { AddProductToCartUseCase } from '../../../application/use-case/add-product-to-cart.service';
import { CartRepositoryInterface } from '../../../domain/port/persistance/cart.repository.interface';
import { ProductRepositoryInterface } from '../../../../product/domain/port/persistance/product.repository.interface';
import { DecrementStockService } from '../../../../product/domain/service/decrement-stock.service';
import { Cart } from '../../../domain/entity/cart.entity';
import { Product } from '../../../../product/domain/entity/product.entity';
import * as assert from 'assert';

class CartRepositoryFake implements CartRepositoryInterface {
  clear(cartId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  private carts: Cart[] = [Object.assign(new Cart(), { id: '1', items: [] })];

  async findById(id: string): Promise<Cart | null> {
    const cart = this.carts.find((cart) => cart.id === id);
    return Promise.resolve(cart || null);
  }

  async save(cart: Cart): Promise<Cart> {
    return Promise.resolve(cart);
  }
}

class ProductRepositoryFake implements ProductRepositoryInterface {
  findAll(): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
  removeProduct(product: Product): Promise<void> {
    throw new Error('Method not implemented.');
  }
  private products: Product[] = [
    Object.assign(new Product('Product 1', 100, 'A product description', 10), {
      id: 'p1',
    }),
  ];

  async findById(id: string): Promise<Product | null> {
    const product = this.products.find((product) => product.id === id);
    return Promise.resolve(product || null);
  }

  async save(product: Product): Promise<Product> {
    return Promise.resolve(product);
  }
}

class DecrementStockServiceFake extends DecrementStockService {
  constructor() {
    super({} as ProductRepositoryInterface, {} as any);
  }
  async execute(productId: string, quantity: number): Promise<void> {
    return Promise.resolve();
  }
}

class ApplyPromotionToOrderUseCaseFake {
  async execute(cartId: string, promotionCode: string): Promise<void> {
    return Promise.resolve();
  }
}

describe('AddProductToCartUseCase', () => {
  it('should add a product to the cart and save it', async () => {
    const cartRepository = new CartRepositoryFake();
    const productRepository = new ProductRepositoryFake();
    const decrementStockService = new DecrementStockServiceFake();
    const applyPromotionToOrderUseCase = new ApplyPromotionToOrderUseCaseFake();

    const addProductToCartUseCase = new AddProductToCartUseCase(
      cartRepository,
      productRepository,
      decrementStockService,
      ApplyPromotionToOrderUseCaseFake as any,
    );

    const cartId = '1';
    const productId = 'p1';
    const quantity = 2;

    const cart = await addProductToCartUseCase.execute(
      cartId,
      productId,
      quantity,
    );

    assert.strictEqual(cart.items.length, 1);
    assert.strictEqual(cart.items[0].product, 'Product 1');
    assert.strictEqual(cart.items[0].quantity, 2);
  });
});
