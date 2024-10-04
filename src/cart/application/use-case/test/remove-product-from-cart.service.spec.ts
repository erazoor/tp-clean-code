import { RemoveProductFromCartUseCase } from '../../../../cart/application/use-case/remove-product-from-cart.service';
import { CartRepositoryInterface } from '../../../../cart/domain/port/persistance/cart.repository.interface';
import { Cart } from '../../../../cart/domain/entity/cart.entity';
import * as assert from 'assert';
import { NotFoundException } from '@nestjs/common';

class CartRepositoryFake implements CartRepositoryInterface {
  clear(cartId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  private carts: Cart[] = [
    Object.assign(new Cart(), {
      id: '1',
      items: [{ productId: 'p1', productName: 'Item 1', quantity: 2 }],
    }),
  ];

  async findById(id: string): Promise<Cart | null> {
    const cart = this.carts.find((cart) => cart.id === id);
    return Promise.resolve(cart || null);
  }

  async save(cart: Cart): Promise<Cart> {
    return Promise.resolve(cart);
  }
}

describe('RemoveProductFromCartUseCase', () => {
  it('should throw NotFoundException if the cart does not exist', async () => {
    const cartRepository = new CartRepositoryFake();
    const removeProductFromCartUseCase = new RemoveProductFromCartUseCase(
      cartRepository,
    );

    const nonExistentCartId = '999';
    const productId = 'p1';

    try {
      await removeProductFromCartUseCase.execute(nonExistentCartId, productId);
    } catch (error) {
      assert.strictEqual(error instanceof NotFoundException, true);
      assert.strictEqual(error.message, 'Cart not found');
    }
  });
});
