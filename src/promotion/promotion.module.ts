import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './domain/entity/promotion.entity';
import { PromotionRepository } from './infrastructure/persistance/promotion.repository';
import { CreatePromotionUseCase } from './domain/service/create-promotion.service';
import { ApplyPromotionToOrderUseCase } from './domain/service/apply-promotion-to-order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion])],
  providers: [
    {
      provide: 'PromotionRepositoryInterface',
      useClass: PromotionRepository,
    },
    CreatePromotionUseCase,
    ApplyPromotionToOrderUseCase,
  ],
})
export class PromotionModule {}
