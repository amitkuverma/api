import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { login } from '../controllers/login.controller';
import { authenticateToken } from '../middlewares/auth';


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
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Add a new user to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: The user's password
 *               isAdmin:
 *                 type: boolean
 *                 description: Whether the user is an admin
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', UserController.createUser);

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

export default router;
