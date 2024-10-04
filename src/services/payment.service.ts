import Payment from '../models/user/payment.model';

class PaymentService {
  async findPaymentByUserId(userId: number) {
    const payment = await Payment.findOne({ where: { userId }});
    if (!payment) {
      throw new Error('User data not found in payment table');
    }
    return payment;
  }

  async findPaymentById(id: number) {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      throw new Error('User data not found in payment table');
    }
    return payment;
  }

  async getPaymentList() {
    return await Payment.findAll();
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

  async updatePayment(updateData: Partial<Payment>) {
    const payment = await Payment.findByPk(updateData.payId);

    if (!payment) {
      throw new Error('Payment not found');
    }

    return await payment.update(updateData);
  }
}

export default new PaymentService();
