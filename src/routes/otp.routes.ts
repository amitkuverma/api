import { Router } from 'express';
import OtpVerification from '../controllers/OtpVerification.controller';

const otpRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OtpRequest:
 *       type: object
 *       required:
 *         - userId
 *         - type
 *       properties:
 *         userId:
 *           type: integer
 *           description: The ID of the user to whom the OTP will be sent
 *         type:
 *           type: string
 *           enum: [email, mobile]
 *           description: The medium to send OTP (email or mobile)
 *     OtpVerification:
 *       type: object
 *       required:
 *         - userId
 *         - otp
 *         - type
 *       properties:
 *         userId:
 *           type: integer
 *           description: The ID of the user
 *         otp:
 *           type: string
 *           description: The OTP to verify
 *         type:
 *           type: string
 *           enum: [email, mobile]
 *           description: The medium used for OTP (email or mobile)
 */

/**
 * @openapi
 * /api/otp/send:
 *   post:
 *     summary: Send an OTP to the user's email or mobile
 *     description: Sends a One-Time Password (OTP) to the specified user
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
otpRouter.post('/send', OtpVerification.sendOtp);

/**
 * @openapi
 * /api/otp/verify:
 *   post:
 *     summary: Verify the OTP sent to the user's email or mobile
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
otpRouter.post('/verify', OtpVerification.verifyOtp);

export default otpRouter;
