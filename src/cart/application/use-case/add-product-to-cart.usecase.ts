import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CartRepositoryInterface } from 'src/cart/domain/port/persistance/cart.repository.interface';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product.repository.interface';
import { DecrementStockUseCase } from 'src/product/domain/service/decrement-stock.service';
import { Cart } from 'src/cart/domain/entity/cart.entity';
import { CartItem } from 'src/cart/domain/entity/cart-item.entity';
import { ApplyPromotionToOrderUseCase } from 'src/promotion/domain/service/apply-promotion-to-order.service';

@Injectable()
export class AddProductToCartUseCase {
  constructor(
    @Inject('CartRepositoryInterface')
    private readonly cartRepository: CartRepositoryInterface,
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
    @Inject('DecrementStockUseCase')
    private readonly decrementStockUseCase: DecrementStockUseCase,
    @Inject('ApplyPromotionToOrderUseCase')
    private readonly applyPromotionToOrderUseCase: ApplyPromotionToOrderUseCase,
  ) {}

  async execute(
    cartId: string,
    productId: string,
    quantity: number,
    promotionCode?: string,
  ): Promise<Cart> {
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Not enough stock for this product');
    }

    await this.decrementStockUseCase.execute(productId, quantity);

    const cartItem = new CartItem(product, quantity);
    cart.addProduct(cartItem);

    if (promotionCode) {
      await this.applyPromotionToOrderUseCase.execute(cart.id, promotionCode);
    }

    await this.cartRepository.save(cart);
    return cart;
  }
}
