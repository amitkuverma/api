import { Request, Response } from 'express';
import PaymentService from '../services/payment.service';

class PaymentController {
  // Upload receipt and update payment
  async uploadReceipt(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const receiptPath = req.file?.path;

      if (!receiptPath) {
        return res.status(400).json({ message: 'Receipt file is required' });
      }

      const payment = await PaymentService.uploadReceipt(Number(paymentId), receiptPath);

      return res.status(200).json({
        message: 'Receipt uploaded successfully',
        payment,
      });
    } catch (error:any) {
      console.error('Error uploading receipt:', error.message);
      return res.status(500).json({ message: error.message });
    }
  }

  async createPayment(req: Request, res: Response) {
    try {
      const payment = await PaymentService.createPayment(req.body);
      res.status(201).json(payment);
    } catch (error:any) {
      res.status(500).json({ message: 'Failed to create payment', error: error.message });
    }
  }

  async getPaymentsByUserId(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const payments = await PaymentService.findPaymentById(Number(userId));
      res.status(200).json(payments);
    } catch (error:any) {
      res.status(500).json({ message: 'Failed to retrieve payments', error: error.message });
    }
  }
}

export default new PaymentController();
