import { Router } from 'express';
import AccountDetailsController from '../controllers/account.controller';

const accRouter = Router();

/**
 * @swagger
 * /api/account:
 *   post:
 *     summary: Create account details
 *     tags: [AccountDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               bankName:
 *                 type: string
 *               branchName:
 *                 type: string
 *               accountType:
 *                 type: string
 *               accountHolderName:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               ifscCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
accRouter.post('/account', AccountDetailsController.createAccountDetails);

/**
 * @swagger
 * /account/{userId}:
 *   get:
 *     summary: Get account details by ID
 *     tags: [AccountDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The account details ID
 *     responses:
 *       200:
 *         description: The account details data
 *       404:
 *         description: Account details not found
 */
accRouter.get('/account/:userId', AccountDetailsController.getAccountDetails);

/**
 * @swagger
 * /api/account/{userId}:
 *   put:
 *     summary: Update account details
 *     tags: [AccountDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The account details ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Account details updated
 *       400:
 *         description: Bad request
 */
accRouter.put('/account/:userId', AccountDetailsController.updateAccountDetails);

/**
 * @swagger
 * /api/accountDetails/{userId}:
 *   delete:
 *     summary: Delete account details
 *     tags: [AccountDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The account details ID
 *     responses:
 *       200:
 *         description: Account details deleted
 *       400:
 *         description: Unable to delete account details
 */
accRouter.delete('/account/:userId', AccountDetailsController.deleteAccountDetails);

export default accRouter;
