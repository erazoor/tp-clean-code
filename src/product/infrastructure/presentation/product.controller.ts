import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateProductUseCase } from 'src/product/application/use-case/create-product.service';
import { DeleteProductUseCase } from 'src/product/application/use-case/delete-product.service';
import { ListProductsUseCase } from 'src/product/application/use-case/list-product.service';
import { ModifyProductUseCase } from 'src/product/application/use-case/modify-product.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly modifyProductUseCase: ModifyProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
  ) {}

  @Post()
  async createProduct(@Body() createProductDto: any) {
    const { name, price, description, stock } = createProductDto;
    return this.createProductUseCase.execute(name, price, description, stock);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') productId: string) {
    return this.deleteProductUseCase.execute(productId);
  }

  @Put(':id')
  async modifyProduct(
    @Param('id') productId: string,
    @Body() updateProductDto: any,
  ) {
    const { name, price, description, stock } = updateProductDto;
    return this.modifyProductUseCase.execute(
      productId,
      name,
      price,
      description,
      stock,
    );
  }

  @Get()
  async listProducts(@Query('isActive') isActive?: boolean) {
    return this.listProductsUseCase.execute(
      isActive !== undefined ? isActive === true : undefined,
    );
  }
}
