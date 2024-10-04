import { Router } from 'express';
import PaymentController from '../controllers/payment.controller';
import { authenticateToken } from '../middlewares/auth';
import multer, { FileFilterCallback } from 'multer';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

const paymentRouter = Router();

// Create the directory if it doesn't exist
const uploadsPath = path.join(__dirname, '../uploads/receipts');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

// Multer storage configuration with absolute path
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsPath); // Absolute path to the uploads/receipts directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File filter to accept only JPEG, PNG, and PDF files
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
        cb(null, true); // No error, accept file
    } else {
        //cb("Only JPEG, PNG, and PDF files are allowed", false); // Pass error to multer
    }
};

// Initialize multer
const upload = multer({ storage, fileFilter });

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
paymentRouter.post('/payment/:userId/upload-receipt', authenticateToken, upload.single('receipt'), PaymentController.uploadReceipt);

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
