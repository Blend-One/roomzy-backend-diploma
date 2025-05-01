export interface PaymentProvider {
    createPaymentSession(data: { amount: number; rentId: string; productName: string }): Promise<string>;
    handleWebhook(req: Request): Promise<any>;
}
