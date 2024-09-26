import { Router } from 'express';
import OTPController from '../controllers/OtpVerification.controller';

const otpRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OtpRequest:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: integer
 *           description: The ID of the user to whom the OTP will be sent
 *     OtpVerification:
 *       type: object
 *       required:
 *         - userId
 *         - otp
 *       properties:
 *         userId:
 *           type: integer
 *           description: The ID of the user
 *         otp:
 *           type: string
 *           description: The OTP to verify
 */

/**
 * @openapi
 * /api/otp/send:
 *   post:
 *     summary: Send an OTP to the user's email
 *     description: Sends a One-Time Password (OTP) to the specified user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OtpRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
otpRouter.post('/send', OTPController.sendOtp);

/**
 * @openapi
 * /api/otp/verify:
 *   post:
 *     summary: Verify the OTP sent to the user's email
 *     description: Verifies the provided OTP for the specified user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OtpVerification'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Internal server error
 */
otpRouter.post('/verify', OTPController.verifyOtp);

export default otpRouter;
