import Payment from '../models/user/payment.model';

class PaymentService {
  async findPaymentByUserId(userId: number) {
    const payment = await Payment.findOne({ where: { userId }});
    if (!payment) {
      throw new Error('User data not found in payment table');
    }
    return payment;
  }

  async getPaymentList() {
    return await Payment.findAll();
  }

  async uploadReceipt(userId: number, receiptPath: string | undefined) {
    const payment = await this.findPaymentByUserId(userId);
    payment.receipt = receiptPath;
    payment.status = "receipt";
    await payment.save();
    return payment;
  }

  async createPayment(data: {
    userId: number;
    userName: string;
    earnAmount: number;
    totalAmount: number;
    paymentMethod: string;
    transactionId: string;
    status: string;
    receipt?: string;
  }) {
    return await Payment.create(data);
  }

  async updatePayment(userId: number, updateData: Partial<Payment>) {
    const payment = await Payment.findByPk(userId);

    if (!payment) {
      throw new Error('Payment not found');
    }

    return await payment.update(updateData);
  }
}

export default new PaymentService();
