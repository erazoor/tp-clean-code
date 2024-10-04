import { InjectDataSource } from '@nestjs/typeorm';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product.repository.interface';
import { Product } from 'src/product/domain/entity/product.entity';
import { DataSource, Repository } from 'typeorm';

export class ProductRepository
  extends Repository<Product>
  implements ProductRepositoryInterface
{
  constructor(@InjectDataSource() private readonly datasource: DataSource) {
    super(Product, datasource.createEntityManager());
  }

  async findById(id: string): Promise<Product | null> {
    return this.findOne({ where: { id } });
  }

  async findAll(): Promise<Product[]> {
    return this.find();
  }

  async removeProduct(product: Product): Promise<void> {
    await this.remove(product);
  }
}
