import { Controller, Get, Param, Delete } from '@nestjs/common';
import { ViewCartUseCase } from 'src/cart/application/use-case/view-cart.use-case';
import { ClearCartUseCase } from 'src/cart/application/use-case/clear-cart.usecase';

@Controller('cart')
export class CartController {
  constructor(
    private readonly viewCartUseCase: ViewCartUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
  ) {}

  @Get(':id')
  async viewCart(@Param('id') cartId: string) {
    return this.viewCartUseCase.execute(cartId);
  }

  @Delete(':id/clear')
  async clearCart(@Param('id') cartId: string) {
    await this.clearCartUseCase.execute(cartId);
    return { message: 'Cart cleared successfully' };
  }
}
