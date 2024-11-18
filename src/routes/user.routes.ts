import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { login, resendOtp, resetPassword, forgotPassword, verifyOTP } from '../controllers/login.controller';
import { authenticateToken } from '../middlewares/auth';
import OtpVerification from '../controllers/OtpVerification.controller';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *      tags: [Users]
 *     security:
 *       - BearerAuth: []  # This adds the Bearer token requirement (LOCK)
 *     description: Retrieve a list of all users from the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user ID.
 *                   name:
 *                     type: string
 *                     description: The user's name.
 *                   email:
 *                     type: string
 *                     description: The user's email address.
 *                   isAdmin:
 *                     type: boolean
 *                     description: Whether the user is an admin.
 */
router.get('/users', authenticateToken, UserController.getAllUsers);

/**
 * @openapi
 * /api/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []  # This adds the Bearer token requirement (LOCK)
 *     description: Retrieve a user by their ID from the database.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user's ID.
 *                 name:
 *                   type: string
 *                   description: The user's name.
 *                 email:
 *                   type: string
 *                   description: The user's email.
 *                 mobile:
 *                   type: string
 *                   description: The user's mobile number.
 *                 status:
 *                   type: string
 *                   description: The user's status.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.get('/users/:userId', authenticateToken, UserController.getUserById);

/**
 * @openapi
 * /api/users/{userId}/status:
 *   put:
 *     summary: Update user status
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []  # This adds the Bearer token requirement (LOCK)
 *     description: Update the status of a user by their ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the user.
 *     responses:
 *       200:
 *         description: User status updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user's ID.
 *                 status:
 *                   type: string
 *                   description: The updated status.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.put('/users/:userId/status', authenticateToken, UserController.updateUserStatus);

/**
 * @openapi
 * /api/users/{userId}:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []  # This adds the Bearer token requirement (LOCK)
 *     description: Update general user details by their ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the user.
 *               email:
 *                 type: string
 *                 description: The updated email of the user.
 *     responses:
 *       200:
 *         description: User details updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user's ID.
 *                 name:
 *                   type: string
 *                   description: The updated name of the user.
 *                 email:
 *                   type: string
 *                   description: The updated email of the user.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.put('/users/:userId', UserController.updateUser);


/**
 * @openapi
 * /api/register/{referralCode}:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Registers a new user by providing the necessary details. Optionally, a referral code can be provided.
 *     parameters:
 *       - name: referralCode
 *         in: path
 *         required: false
 *         description: An optional referral code from another user.
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
 *                 description: The user's name.
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               mobile:
 *                 type: string
 *                 description: The user's mobile number.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user's ID.
 *                 name:
 *                   type: string
 *                   description: The user's name.
 *                 email:
 *                   type: string
 *                   description: The user's email.
 *                 referralCode:
 *                   type: string
 *                   description: The generated referral code for the new user.
 *                 otp:
 *                   type: string
 *                   description: OTP sent for mobile verification.
 *       400:
 *         description: Bad request.
 */
router.post('/register/:referralCode?', UserController.createUser);

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     description: Log in a user and return a JWT token.
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
 *         description: Login successful, returns a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token.
 *       401:
 *         description: Invalid credentials.
 */
router.post('/login', login);

/**
 * @swagger
 * /api/resend-otp:
 *   post:
 *     summary: Resend OTP for password reset.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *                 description: The registered email address of the user.
 *     responses:
 *       200:
 *         description: OTP resent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP resent successfully. Check your email.
 *       400:
 *         description: Missing email in request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email is required.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/resend-otp', resendOtp);

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Reset the user's password using the provided OTP and new password.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *                 description: The registered email address of the user.
 *               otp:
 *                 type: string
 *                 example: "123456"
 *                 description: The OTP sent to the user's email.
 *               newPassword:
 *                 type: string
 *                 example: MySecurePassword123!
 *                 description: The new password the user wants to set.
 *     responses:
 *       200:
 *         description: Password reset successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successful.
 *       400:
 *         description: Invalid input data (e.g., missing fields, weak password).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP or new password is missing.
 *       401:
 *         description: Invalid or expired OTP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired OTP.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */

router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /api/forgot-password:
 *   post:
 *     summary: Initiates a password reset
 *     tags: [Authentication]
 *     description: Sends a password reset email with a token if the email is registered.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's registered email address
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', forgotPassword);

/**
*  @openapi
*  /api/verify-otp:
*    post:
*      summary: Verify OTP
*      description: Verifies the OTP sent to the user's email and generates a token upon success.
*      tags:
*        - Authentication
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                otp:
*                  type: string
*                  description: The OTP sent to the user.
*                  example: "123456"
*                email:
*                  type: string
*                  description: The user's email address.
*                  example: "user@example.com"
*      responses:
*        '200':
*          description: OTP verified successfully
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  status:
*                    type: string
*                    example: "success"
*                  message:
*                    type: string
*                    example: "OTP verified successfully"
*                  token:
*                    type: string
*                    example: "eyJhbGciOiJIUzI1NiIsIn..."
*        '400':
*          description: Bad Request - Missing parameters
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  status:
*                    type: string
*                    example: "error"
*                  message:
*                    type: string
*                    example: "OTP and Email are required"
*        '401':
*          description: Unauthorized - Invalid OTP
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  status:
*                    type: string
*                    example: "error"
*                  message:
*                    type: string
*                    example: "Invalid OTP or OTP expired"
 */
router.post('/verify-otp', verifyOTP);

/**
 * @swagger
 * /api/reset-internal-password:
 *   post:
 *     summary: Completes password reset with a new password
 *     description: Resets the user password if the provided token is valid.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: User's unique identifier
 *                 example: 1
 *               token:
 *                 type: string
 *                 description: Reset token sent via email
 *                 example: abcdef123456
 *               newPassword:
 *                 type: string
 *                 description: New password to replace the old one
 *                 example: NewStrongPassword!123
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-internal-password', UserController.resetPassword);

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
 *     summary: Send an OTP to the user's email
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
 * /api/referral-chain/{userId}:
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
router.get('/referral-chain/:userId', authenticateToken, UserController.getReferralChain);

/**
 * @swagger
 * /api/referrals/{userId}:
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
router.get('/referrals/:userId', authenticateToken, UserController.getUserReferralChainList);


/**
 * @swagger
 * /api/referral-parents/{userId}:
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
router.get('/referral-parents/:userId', authenticateToken, UserController.getParentReferralChainList);


/**
 * @swagger
 * /api/referral-tree/{userId}:
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
router.get('/referral-tree/:userId', authenticateToken, UserController.getReferralTree);


/**
 * @swagger
 * /api/referral-parent/{userId}:
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
router.get('/referral-parent/:userId', authenticateToken, UserController.getReferralParent);

/**
 * @swagger
 * /api/referral-children/{userId}:
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
router.get('/referral-children/:userId', authenticateToken, UserController.getReferralChildren);

/**
 * @swagger
 * /api/delete/{userId}:
 *   delete:
 *     summary: Delete a user profile and their referrals
 *     description: Deletes the specified user and all referrals made by them.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User and their referrals successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User and referrals deleted successfully
 *       404:
 *         description: User or referrals not found
 *       500:
 *         description: Server error
 */

// API to get all the referrals made by a user
router.delete('/delete/:userId', authenticateToken, UserController.deleteUserProfile);

export default router;
