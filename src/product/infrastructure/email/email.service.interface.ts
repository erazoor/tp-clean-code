export interface EmailServiceInterface {
  notifyStockDepleted(adminEmail: string, product: any): Promise<void>;
}
