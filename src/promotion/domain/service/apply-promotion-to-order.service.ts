import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { PromotionRepositoryInterface } from '../port/persistance/promotion.repository.interface';
import { Order } from 'src/order/domain/entity/order.entity';

@Injectable()
export class ApplyPromotionToOrderUseCase {
  constructor(
    @Inject('PromotionRepositoryInterface')
    private readonly promotionRepository: PromotionRepositoryInterface,
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
  ) {}

  async execute(orderId: string, promotionCode: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.promotionCode) {
      throw new BadRequestException(
        'A promotion has already been applied to this order.',
      );
    }

    const promotion = await this.promotionRepository.findByCode(promotionCode);
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
    order.applyPromotion(promotion);

    return this.orderRepository.save(order);
  }
}
