import { Inject, Injectable } from '@nestjs/common';
import { Promotion } from '../entity/promotion.entity';
import { PromotionRepositoryInterface } from '../port/persistance/promotion.repository.interface';

@Injectable()
export class CreatePromotionUseCase {
  constructor(
    @Inject('PromotionRepositoryInterface')
    private readonly promotionRepository: PromotionRepositoryInterface,
  ) {}

  async execute(
    name: string,
    code: string,
    amount?: number,
  ): Promise<Promotion> {
    if (!name || !code) {
      throw new Error('Promotion name and code are required.');
    }
    const promotion = new Promotion(name, code, amount);

    return this.promotionRepository.save(promotion);
  }
}
