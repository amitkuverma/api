import Payment from '../models/user/payment.model';

class PaymentService {
  // Find a payment by its ID
  async findPaymentById(paymentId: number) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  }

  // Upload receipt and update payment
  async uploadReceipt(paymentId: number, receiptPath: string | undefined) {
    const payment = await this.findPaymentById(paymentId);
    payment.receipt = receiptPath;
    await payment.save();
    return payment;
  }

  async createPayment(data: {
    userId: number;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    status: string;
    receipt?: string;
  }): Promise<Payment> {
    const payment = await Payment.create(data);
    return payment;
  }
}

export default new PaymentService();
