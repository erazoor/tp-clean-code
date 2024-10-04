import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProductController from './infrastructure/presentation/product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [ProductController],
  providers: [],
})
export class ProductModule {}
