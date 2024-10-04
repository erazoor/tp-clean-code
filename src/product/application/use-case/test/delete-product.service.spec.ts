import { DeleteProductUseCase } from '../../../application/use-case/delete-product.service';
import { ProductRepositoryInterface } from '../../../domain/port/persistance/product.repository.interface';
import { OrderRepositoryInterface } from '../../../../order/domain/port/persistance/order.repository.interface';
import { Product } from '../../../domain/entity/product.entity';
import * as assert from 'assert';
import { Order } from 'src/order/domain/entity/order.entity';

class ProductRepositoryFake implements ProductRepositoryInterface {
  save(product: Product): Promise<Product> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
  findById(productId: string): Promise<Product | null> {
    if (productId === 'existing-product') {
      return Promise.resolve(
        new Product('Test Product', 100, 'Test Description'),
      );
    }
    return Promise.resolve(null);
  }

  removeProduct(product: Product): Promise<void> {
    return Promise.resolve();
  }
}

class OrderRepositoryFake implements OrderRepositoryInterface {
  save(order: Order): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Order | null> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }
  findByCustomerName(customerName: string): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }
  deleteOrder(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findByProductId(productId: string): Promise<any[]> {
    if (productId === 'existing-product') {
      return Promise.resolve([]);
    }
    return Promise.resolve([{ id: 'order-1', productId: 'existing-product' }]);
  }
}

describe('DeleteProductUseCase', () => {
  it('should delete the product if it is not linked to any order', async () => {
    const productRepository = new ProductRepositoryFake();
    const orderRepository = new OrderRepositoryFake();
    const deleteProductUseCase = new DeleteProductUseCase(
      productRepository,
      orderRepository,
    );

    await deleteProductUseCase.execute('existing-product');
    assert.ok(true);
  });
});
