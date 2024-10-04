import { Product } from '../../../domain/entity/product.entity';

export interface ProductRepositoryInterface {
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  removeProduct(product: Product): Promise<void>;
}
