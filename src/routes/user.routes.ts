import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { login } from '../controllers/login.controller';
import { authenticateToken } from '../middlewares/auth';
import OtpVerification from '../controllers/OtpVerification.controller';


const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     security:
 *       - BearerAuth: []  # This adds the Bearer token requirement (LOCK)
 *     description: Retrieve a list of all users from the database
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user ID
 *                   name:
 *                     type: string
 *                     description: The user's name
 *                   email:
 *                     type: string
 *                     description: The user's email address
 *                   isAdmin:
 *                     type: boolean
 *                     description: Whether the user is an admin
 */
router.get('/', authenticateToken, UserController.getAllUsers);

/**
 * @swagger
 * /api/users/register/{referralCode}:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user by providing the necessary details. Optionally, a referral code can be provided.
 *     tags: [User]
 *     parameters:
 *       - name: referralCode
 *         in: path
 *         required: false
 *         description: An optional referral code from another user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - mobile
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               mobile:
 *                 type: string
 *                 description: The user's mobile number
 *               password:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user's ID
 *                 name:
 *                   type: string
 *                   description: The user's name
 *                 email:
 *                   type: string
 *                   description: The user's email
 *                 referralCode:
 *                   type: string
 *                   description: The generated referral code for the new user
 *                 otp:
 *                   type: string
 *                   description: OTP sent for mobile verification
 *       400:
 *         description: Bad request
 */
router.post('/register/:referralCode?', UserController.createUser);


/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Log in a user and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);


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
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user to whom the OTP will be sent
 *               type:
 *                 type: string
 *                 enum: [email, mobile]
 *                 description: The medium to send OTP (email or mobile)
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/send', OtpVerification.sendOtp);

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
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user
 *               otp:
 *                 type: string
 *                 description: The OTP to verify
 *               type:
 *                 type: string
 *                 enum: [email, mobile]
 *                 description: The medium used for OTP (email or mobile)
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Internal server error
 */
router.post('/verify', OtpVerification.verifyOtp);

/**
 * @swagger
 * /api/users/referral-chain/{userId}:
 *   get:
 *     summary: Get the referral chain for a user
 *     description: Retrieve the entire referral chain for a specific user, showing the hierarchy of who referred whom.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to get the referral chain for
 *     responses:
 *       200:
 *         description: The referral chain for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user's ID
 *                   name:
 *                     type: string
 *                     description: The user's name
 *                   email:
 *                     type: string
 *                     description: The user's email
 *                   parentUserId:
 *                     type: integer
 *                     description: The ID of the user who referred this user
 *       404:
 *         description: No referral chain found for the user
 *       500:
 *         description: Server error
 */

// API to get the referral chain for a user
router.get('/referral-chain/:userId', UserController.getReferralChain);

/**
 * @swagger
 * /api/users/referrals/{userId}:
 *   get:
 *     summary: Get the referral chain for a user
 *     description: Retrieve the entire referral chain for a specific user, showing the hierarchy of who referred whom.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to get the referral chain for
 *     responses:
 *       200:
 *         description: The referral chain for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user's ID
 *                   name:
 *                     type: string
 *                     description: The user's name
 *                   email:
 *                     type: string
 *                     description: The user's email
 *                   parentUserId:
 *                     type: integer
 *                     description: The ID of the user who referred this user
 *       404:
 *         description: No referral chain found for the user
 *       500:
 *         description: Server error
 */

// API to get the referral chain for a user
router.get('/referrals/:userId', UserController.getReferralChainStartToEnd);


/**
 * @swagger
 * /api/users/referral-children/{userId}:
 *   get:
 *     summary: Get the referrals made by a user
 *     description: Retrieve all the users that were referred by a specific user.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to get referrals made by them
 *     responses:
 *       200:
 *         description: List of users referred by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user's ID
 *                   name:
 *                     type: string
 *                     description: The user's name
 *                   email:
 *                     type: string
 *                     description: The user's email
 *                   parentUserId:
 *                     type: integer
 *                     description: The ID of the user who referred this user
 *       404:
 *         description: No referrals found for the user
 *       500:
 *         description: Server error
 */

// API to get all the referrals made by a user
router.get('/referral-children/:userId', UserController.getReferralChildren);

export default router;
