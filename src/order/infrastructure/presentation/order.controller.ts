import { Body, Controller, Param, Post } from '@nestjs/common';
import {
  CreateOrderCommand,
  Order,
} from 'src/order/domain/entity/order.entity';
import { CreateOrderService } from 'src/order/application/use-case/create-order.service';
import { CancelOrderService } from 'src/order/application/use-case/cancel-order.service';
import { PayOrderService } from 'src/order/application/use-case/pay-order.service';

@Controller('/orders')
export default class OrderController {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly payOrderService: PayOrderService,
    private readonly cancelOrderService: CancelOrderService,
  ) {}

  @Post()
  async createOrder(
    @Body() createOrderCommand: CreateOrderCommand,
  ): Promise<Order> {
    return this.createOrderService.execute(createOrderCommand);
  }

  @Post()
  async payOrder(@Param('id') id: string): Promise<Order> {
    return await this.payOrderService.execute(id);
  }

  @Post(':orderId/cancel')
  async cancelOrder(
    @Param('orderId') orderId: string,
    @Body('cancelReason') cancelReason: string,
  ): Promise<Order> {
    return this.cancelOrderService.execute(orderId, cancelReason);
  }
}
