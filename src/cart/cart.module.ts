import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './domain/entity/cart.entity';
import { CartItem } from './domain/entity/cart-item.entity';
import { CartController } from './infrastructure/presentation/cart.controller';
import { AddProductToCartUseCase } from './application/use-case/add-product-to-cart.service';
import { RemoveProductFromCartUseCase } from './application/use-case/remove-product-from-cart.service';
import { ViewCartUseCase } from './application/use-case/view-cart.service';
import { ClearCartUseCase } from './application/use-case/clear-cart.service';
import { DecrementStockService } from 'src/product/domain/service/decrement-stock.service';
import { ProductRepository } from 'src/product/infrastructure/persistance/product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem])],
  controllers: [CartController],
  providers: [
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepository,
    },
    AddProductToCartUseCase,
    RemoveProductFromCartUseCase,
    ClearCartUseCase,
    ViewCartUseCase,
    DecrementStockService,
  ],
})
export class CartModule {}
