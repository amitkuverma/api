
import { Router } from 'express';
import TransactionController from '../controllers/transaction.controller';
import { authenticateToken } from '../middlewares/auth';

const transRouter = Router();

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Retrieve a list of transactions
 *     responses:
 *       200:
 *         description: A list of transactions.
 */
transRouter.get('/transaction/', authenticateToken, TransactionController.getAll);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the transaction to retrieve.
 *     responses:
 *       200:
 *         description: Transaction data.
 */
transRouter.get('/transaction/:transId', authenticateToken, TransactionController.getOne);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     requestBody:
 *       description: Transaction data to create
 *     responses:
 *       201:
 *         description: Transaction created.
 */
transRouter.post('/transaction/', authenticateToken, TransactionController.create);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the transaction to update.
 *     responses:
 *       200:
 *         description: Updated transaction.
 */
transRouter.put('/transaction/:transId', authenticateToken, TransactionController.update);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the transaction to delete.
 *     responses:
 *       200:
 *         description: Deleted transaction.
 */
transRouter.delete('/transaction/:transId', authenticateToken, TransactionController.delete);

export default transRouter;
