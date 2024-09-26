import { Request, Response } from 'express';
import PaymentService from '../services/payment.service';

class PaymentController {
  // Upload receipt and update payment
  async uploadReceipt(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const receiptPath = req.file?.path;

      if (!receiptPath) {
        return res.status(400).json({ message: 'Receipt file is required' });
      }

      const payment = await PaymentService.uploadReceipt(Number(userId), receiptPath);

      return res.status(200).json({
        message: 'Receipt uploaded successfully',
        payment,
      });
    } catch (error: any) {
      console.error('Error uploading receipt:', error.message);
      return res.status(500).json({ message: error.message });
    }
  }

  async createPayment(req: Request, res: Response) {
    try {
      const { userId, totalAmount, paymentMethod, transactionId } = req.body;
  
      let existingPayment = await PaymentService.findPaymentByUserId(userId);
  
      if (existingPayment) {
        const updatedPayment = await PaymentService.updatePayment(existingPayment.userId, {
          totalAmount,
          paymentMethod,
          transactionId,
          status: 'completed',
        });
  
        return res.status(200).json({
          message: 'Payment updated successfully',
          payment: updatedPayment,
        });
      } else {
        const newPayment = await PaymentService.createPayment({
          userId,
          totalAmount,
          paymentMethod,
          transactionId,
          status: 'completed',
        });
  
        return res.status(201).json({
          message: 'Payment created successfully',
          payment: newPayment,
        });
      }
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to create or update payment', error: error.message });
    }
  }

  async getPaymentsByUserId(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const payments = await PaymentService.findPaymentByUserId(Number(userId));
      res.status(200).json(payments);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to retrieve payments', error: error.message });
    }
  }

  async getAllUserPayments(req: Request, res: Response) {
    try {
      const payments = await PaymentService.getPaymentList();
      res.status(200).json(payments);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to retrieve payments', error: error.message });
    }
  }
}

export default new PaymentController();
