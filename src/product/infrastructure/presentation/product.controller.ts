import { Controller, Post } from '@nestjs/common';

@Controller('/products')
export default class ProductController {
  constructor() {}

  @Post()
  async createProduct(): Promise<void> {
    return;
  }
}
