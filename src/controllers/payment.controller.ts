import { Request, Response } from 'express';
import PaymentService from '../services/payment.service';

class PaymentController {
  // Upload receipt and update payment
  async uploadReceipt(req: Request, res: Response) {
    // try {
      
    //   const { id } = req.params;
    //   const receiptPath = req.file?.path;
    //   const type = req.body.type;

    //   if (!receiptPath) {
    //     return res.status(400).json({ message: 'Receipt file is required' });
    //   }

    //   const payment = await PaymentService.uploadReceipt(Number(id), receiptPath,  type);

    //   return res.status(200).json({
    //     message: 'Receipt uploaded successfully',
    //     payment,
    //   });
    // } catch (error: any) {
    //   console.error('Error uploading receipt:', error.message);
    //   return res.status(500).json({ message: error.message });
    // }
  }

  // Create a new payment
  async createPayment(req: Request, res: Response) {
    try {
      const { userId, userName, earnAmount, totalAmount, paymentMethod, transactionId, status } = req.body;

      // Create new payment
      const newPayment = await PaymentService.createPayment({
        userId,
        userName,
        earnAmount,
        totalAmount,
        paymentMethod,
        transactionId,
        status,
      });

      return res.status(201).json({
        message: 'Payment created successfully',
        payment: newPayment,
      });
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to create payment', error: error.message });
    }
  }

  // Update an existing payment
  async updatePayment(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      // Ensure that the payment exists before attempting to update
      const existingPayment = await PaymentService.findPaymentById(Number(userId));
      if (!existingPayment) {
        return res.status(404).json({
          message: 'Payment not found for this user. Use create endpoint instead.',
        });
      }

      // Update payment
      const updatedPayment = await PaymentService.updatePayment(req.body);

      return res.status(200).json({
        message: 'Payment updated successfully',
        payment: updatedPayment,
      });
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to update payment', error: error.message });
    }
  }

  // Retrieve payments for a specific user by user ID
  async getPaymentsByUserId(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const payments = await PaymentService.findPaymentByUserId(Number(userId));
      res.status(200).json(payments);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to retrieve payments', error: error.message });
    }
  }

  // Retrieve all payments
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
