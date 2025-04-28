export interface PaymentProvider {
    createPaymentSession(data: { amount: number; userId: string; productName: string }): Promise<string>;
    handleWebhook(body: Buffer, signature: string): Promise<void>;
}
