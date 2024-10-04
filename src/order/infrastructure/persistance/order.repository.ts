import { InjectDataSource } from '@nestjs/typeorm';
import { Order } from 'src/order/domain/entity/order.entity';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { DataSource, Repository } from 'typeorm';

export default class OrderRepositoryTypeOrm
  extends Repository<Order>
  implements OrderRepositoryInterface
{
  constructor(@InjectDataSource() private readonly datasource: DataSource) {
    super(Order, datasource.createEntityManager());
  }

  async findById(id: string): Promise<Order | null> {
    return this.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.product'],
    });
  }

  async findAll(): Promise<Order[]> {
    const queryBuilder = this.createQueryBuilder('order');

    return queryBuilder.getMany();
  }

  async findByCustomerName(customerName: string): Promise<Order[]> {
    const queryBuilder = this.createQueryBuilder('order');

    queryBuilder.where('order.customerName = :customerName', { customerName });

    return queryBuilder.getMany();
  }

  async findByProductId(productId: string): Promise<Order[]> {
    return this.createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .where('orderItem.productId = :productId', { productId })
      .getMany();
  }

  async deleteOrder(id: string): Promise<void> {
    const queryBuilder = this.createQueryBuilder('order');

    queryBuilder.where('order.id = :id', { id });

    await queryBuilder.delete().execute();
  }
}
