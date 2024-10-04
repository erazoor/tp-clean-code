import { InjectDataSource } from '@nestjs/typeorm';
import { Promotion } from 'src/promotion/domain/entity/promotion.entity';
import { PromotionRepositoryInterface } from 'src/promotion/domain/port/persistance/promotion.repository.interface';
import { DataSource, Repository } from 'typeorm';

export class PromotionRepository
  extends Repository<Promotion>
  implements PromotionRepositoryInterface
{
  constructor(@InjectDataSource() private readonly datasource: DataSource) {
    super(Promotion, datasource.createEntityManager());
  }

  async findByCode(code: string): Promise<Promotion | null> {
    return this.findOne({ where: { code } });
  }

  async removePromotion(promotion: Promotion): Promise<void> {
    await this.manager.remove(promotion);
  }
}
