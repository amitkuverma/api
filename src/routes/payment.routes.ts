import express from 'express';
import multer from 'multer';
import PaymentController from '../controllers/payment.controller';

const payRouter = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req:any, file:any, cb:any) => {
    cb(null, 'uploads/receipts/');
  },
  filename: (req:any, file:any, cb:any) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });


/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *               transactionId:
 *                 type: string
 *               status:
 *                 type: string
 *               receipt:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       500:
 *         description: Failed to create payment
 */
payRouter.post('/payments', PaymentController.createPayment);

/**
 * @swagger
 * /api/payments/user/{userId}:
 *   get:
 *     summary: Get all payments for a user
 *     tags: [Payments]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to get payments for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of payments
 *       500:
 *         description: Failed to retrieve payments
 */
payRouter.get('/payments/user/:userId', PaymentController.getPaymentsByUserId);

// Upload payment receipt
/**
 * @swagger
 * /api/payments/upload-receipt/{paymentId}:
 *   post:
 *     summary: Upload payment receipt
 *     description: Uploads a receipt for a specific payment and updates the payment record.
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the payment
 *     requestBody:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Receipt uploaded successfully
 *                 payment:
 *                   type: object
 *                   $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
payRouter.post('/upload-receipt/:paymentId', upload.single('receipt'), PaymentController.uploadReceipt);

export default payRouter;
