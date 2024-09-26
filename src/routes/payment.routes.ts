import express from 'express';
import multer from 'multer';
import PaymentController from '../controllers/payment.controller';
import { authenticateToken } from '../middlewares/auth';
import path from 'path';
import fs from 'fs';

const payRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/receipts');
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
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
 *     security:
 *       - BearerAuth: []  # This adds the Bearer token requirement (LOCK)
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
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
payRouter.post('/payments', authenticateToken, PaymentController.createPayment);

/**
 * @swagger
 * /api/payment/{userId}:
 *   get:
 *     summary: Get payments by user ID
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []  # This adds the Bearer token requirement (LOCK)
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payments not found
 *       500:
 *         description: Server error
 */
payRouter.get('/payment/:userId', authenticateToken, PaymentController.getPaymentsByUserId);

/**
 * @swagger
 * /api/upload/{userId}:
 *   post:
 *     summary: Upload a payment receipt
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []  # This adds the Bearer token requirement (LOCK)
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
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
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
payRouter.post('/upload/:userId', authenticateToken, upload.single('receipt'), PaymentController.uploadReceipt);

export default payRouter;
