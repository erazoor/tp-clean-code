import { Body, Controller, Post, Param } from '@nestjs/common';
import { ApplyPromotionToOrderUseCase } from 'src/promotion/domain/service/apply-promotion-to-order.service';
import { CreatePromotionUseCase } from 'src/promotion/domain/service/create-promotion.service';

@Controller('promotions')
export class PromotionController {
  constructor(
    private readonly createPromotionUseCase: CreatePromotionUseCase,
    private readonly applyPromotionToOrderUseCase: ApplyPromotionToOrderUseCase,
  ) {}

  @Post('create')
  async createPromotion(
    @Body() createPromotionDto: { name: string; code: string; amount?: number },
  ) {
    const { name, code, amount } = createPromotionDto;
    return this.createPromotionUseCase.execute(name, code, amount);
  }

  @Post(':orderId/apply')
  async applyPromotionToOrder(
    @Param('orderId') orderId: string,
    @Body('promotionCode') promotionCode: string,
  ) {
    return this.applyPromotionToOrderUseCase.execute(orderId, promotionCode);
  }
}
