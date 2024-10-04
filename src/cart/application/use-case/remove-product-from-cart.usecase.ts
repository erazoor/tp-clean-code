import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartRepositoryInterface } from 'src/cart/domain/port/persistance/cart.repository.interface';
import { Cart } from 'src/cart/domain/entity/cart.entity';

@Injectable()
export class RemoveProductFromCartUseCase {
  constructor(
    @Inject('CartRepositoryInterface')
    private readonly cartRepository: CartRepositoryInterface,
  ) {}

  async execute(cartId: string, productId: string): Promise<Cart> {
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.removeProduct(productId);

    await this.cartRepository.save(cart);
    return cart;
  }
}
