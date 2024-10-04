import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './infrastructure/presentation/product.controller';
import { Product } from './domain/entity/product.entity';
import { ProductRepository } from './infrastructure/persistance/product.repository';
import { CreateProductUseCase } from './application/use-case/create-product.service';
import { DeleteProductUseCase } from './application/use-case/delete-product.service';
import { ModifyProductUseCase } from './application/use-case/modify-product.service';
import { ListProductsUseCase } from './application/use-case/list-product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepository,
    },
    CreateProductUseCase,
    DeleteProductUseCase,
    ModifyProductUseCase,
    ListProductsUseCase,
  ],
})
export class ProductModule {}
