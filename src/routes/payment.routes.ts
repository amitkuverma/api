import { Router } from 'express';
import PaymentController from '../controllers/payment.controller';
import { authenticateToken } from '../middlewares/auth';

const paymentRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API to manage payments
 */

/**
 * @swagger
 * /api/payment:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               totalAmount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *               transactionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Payment already exists
 *       500:
 *         description: Failed to create payment
 */
paymentRouter.post('/payment', authenticateToken, PaymentController.createPayment);

/**
 * @swagger
 * /api/payment/{userId}:
 *   put:
 *     summary: Update an existing payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID of the payment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalAmount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *               transactionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Failed to update payment
 */
paymentRouter.put('/payment/:userId', authenticateToken, PaymentController.updatePayment);

/**
 * @swagger
 * /api/payment/{userId}/upload-receipt:
 *   post:
 *     summary: Upload a receipt and update payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID of the payment
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               receipt:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Receipt uploaded successfully
 *       400:
 *         description: Receipt file is required
 *       500:
 *         description: Failed to upload receipt
 */
paymentRouter.post('/payment/:userId/upload-receipt', authenticateToken, PaymentController.uploadReceipt);

/**
 * @swagger
 * /api/payment/{userId}:
 *   get:
 *     summary: Get all payments for a specific user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID to retrieve payments for
 *     responses:
 *       200:
 *         description: Successfully retrieved payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                   totalAmount:
 *                     type: number
 *                   paymentMethod:
 *                     type: string
 *                   transactionId:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [completed, pending, failed]
 *       500:
 *         description: Failed to retrieve payments
 */
paymentRouter.get('/payment/:userId', authenticateToken, PaymentController.getPaymentsByUserId);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all user payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                   totalAmount:
 *                     type: number
 *                   paymentMethod:
 *                     type: string
 *                   transactionId:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [completed, pending, failed]
 *       500:
 *         description: Failed to retrieve payments
 */
paymentRouter.get('/payments', authenticateToken, PaymentController.getAllUserPayments);

export default paymentRouter;
