import { ViewCartUseCase } from '../../../../cart/application/use-case/view-cart.service';
import { CartRepositoryInterface } from '../../../../cart/domain/port/persistance/cart.repository.interface';
import { Cart } from '../../../../cart/domain/entity/cart.entity';
import * as assert from 'assert';
import { NotFoundException } from '@nestjs/common';

class CartRepositoryFake implements CartRepositoryInterface {
  private carts: Cart[] = [
    Object.assign(new Cart(), {
      id: '1',
      items: [{ productId: 'p1', product: 'Item 1', quantity: 2 }],
    }),
  ];

  async findById(id: string): Promise<Cart | null> {
    const cart = this.carts.find((cart) => cart.id === id);
    return Promise.resolve(cart || null);
  }

  async save(cart: Cart): Promise<Cart> {
    return Promise.resolve(cart);
  }

  async clear(cartId: string): Promise<void> {}
}

describe('ViewCartUseCase', () => {
  it('should return the cart when it exists', async () => {
    const cartRepository = new CartRepositoryFake();
    const viewCartUseCase = new ViewCartUseCase(cartRepository);

    const cartId = '1';

    const cart = await viewCartUseCase.execute(cartId);

    assert.strictEqual(cart.id, '1');
    assert.strictEqual(cart.items.length, 1);
    assert.strictEqual(cart.items[0].product, 'Item 1');
  });

  it('should throw NotFoundException if the cart does not exist', async () => {
    const cartRepository = new CartRepositoryFake();
    const viewCartUseCase = new ViewCartUseCase(cartRepository);

    const nonExistentCartId = '999';

    try {
      await viewCartUseCase.execute(nonExistentCartId);
    } catch (error) {
      assert.strictEqual(error instanceof NotFoundException, true);
      assert.strictEqual(error.message, 'Cart not found');
    }
  });
});
