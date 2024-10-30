import { Router } from 'express';
import PaymentController from '../controllers/payment.controller';
import { authenticateToken } from '../middlewares/auth';

const paymentRouter = Router();

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
 *               earnAmount:
 *                 type: number
 *               totalAmount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *               transactionId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Payment already exists
 *       500:
 *         description: Failed to create payment
 */
paymentRouter.post('/payment', PaymentController.createPayment);

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
 *               earnAmount:
 *                 type: number
 *               totalAmount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *               transactionId:
 *                 type: string
 *               status:
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
 *                   earnAmount:
 *                     type: number
 *                   totalAmount:
 *                     type: number
 *                   paymentMethod:
 *                     type: string
 *                   transactionId:
 *                     type: string
 *                   status:
 *                     type: string
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
 *                   earnAmount:
 *                     type: number
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
