import { ClearCartUseCase } from '../../../application/use-case/clear-cart.service';
import { CartRepositoryInterface } from '../../../../cart/domain/port/persistance/cart.repository.interface';
import { Cart } from '../../../../cart/domain/entity/cart.entity';
import * as assert from 'assert';
import { NotFoundException } from '@nestjs/common';

class CartRepositoryFake implements CartRepositoryInterface {
  private carts: Cart[] = [
    Object.assign(new Cart(), {
      id: '1',
      items: [{ productName: 'Item 1', quantity: 2 }],
    }),
  ];

  async findById(id: string): Promise<Cart | null> {
    const cart = this.carts.find((cart) => cart.id === id);
    return Promise.resolve(cart || null);
  }

  async save(cart: Cart): Promise<Cart> {
    return Promise.resolve(cart);
  }

  async clear(cartId: string): Promise<void> {
    const cart = await this.findById(cartId);
    if (cart) {
      cart.items = [];
      await this.save(cart);
    }
  }
}

describe('ClearCartUseCase', () => {
  it('should clear the cart and save it', async () => {
    const cartRepository = new CartRepositoryFake();
    const clearCartUseCase = new ClearCartUseCase(cartRepository);

    const cartId = '1';
    await clearCartUseCase.execute(cartId);

    const cart = await cartRepository.findById(cartId);
    assert.strictEqual(cart?.items.length, 0);
  });

  it('should throw NotFoundException if the cart does not exist', async () => {
    const cartRepository = new CartRepositoryFake();
    const clearCartUseCase = new ClearCartUseCase(cartRepository);

    const nonExistentCartId = '999';

    try {
      await clearCartUseCase.execute(nonExistentCartId);
    } catch (error) {
      assert.strictEqual(error instanceof NotFoundException, true);
      assert.strictEqual(error.message, 'Cart not found');
    }
  });
});
