import { Cart } from '../../entity/cart.entity';

export interface CartRepositoryInterface {
  save(cart: Cart): Promise<Cart>;

  findById(cartId: string): Promise<Cart | null>;

  clear(cartId: string): Promise<void>;
}
