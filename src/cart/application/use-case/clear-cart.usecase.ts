import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartRepositoryInterface } from 'src/cart/domain/port/persistance/cart.repository.interface';

@Injectable()
export class ClearCartUseCase {
  constructor(
    @Inject('CartRepositoryInterface')
    private readonly cartRepository: CartRepositoryInterface,
  ) {}

  async execute(cartId: string): Promise<void> {
    const cart = await this.cartRepository.findById(cartId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.clearCart();

    await this.cartRepository.save(cart);
  }
}
