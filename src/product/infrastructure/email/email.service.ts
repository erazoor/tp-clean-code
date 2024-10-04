import { Injectable } from '@nestjs/common';
import { EmailServiceInterface } from './email.service.interface';

@Injectable()
export class EmailService implements EmailServiceInterface {
  async notifyStockDepleted(adminEmail: string, product: any): Promise<void> {
    console.log(
      `Sending stock depleted email to ${adminEmail} for product ${product.name}`,
    );

    return Promise.resolve();
  }
}
