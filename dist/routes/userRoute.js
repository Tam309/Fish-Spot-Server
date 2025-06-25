"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controller/UserController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userRouter = express_1.default.Router();
// Utility to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     Profile:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         nick_name:
 *           type: string
 *         location:
 *           type: string
 *         bio:
 *           type: string
 *         avatar:
 *           type: string
 */
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: User already exists
 */
userRouter.post('/register', asyncHandler(UserController_1.register));
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login an existing user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing username or password
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid credentials
 */
userRouter.post('/login', asyncHandler(UserController_1.login));
/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Change password for an authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Missing old or new password
 *       401:
 *         description: Old password is incorrect
 *       404:
 *         description: User not found
 */
userRouter.post('/change-password', authMiddleware_1.authMiddleware, asyncHandler(UserController_1.changePassword));
/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile for an authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 nick_name:
 *                   type: string
 *                 location:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 postCount:
 *                   type: integer
 *       400:
 *         description: User ID is required
 *       404:
 *         description: User not found
 */
userRouter.get('/profile', authMiddleware_1.authMiddleware, asyncHandler(UserController_1.getUserProfile));
/**
 * @swagger
 * /users/edit:
 *   put:
 *     summary: Edit profile for an authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: User ID is required
 *       404:
 *         description: User not found
 */
userRouter.put('/edit', authMiddleware_1.authMiddleware, asyncHandler(UserController_1.editProfile));
exports.default = userRouter;
//# sourceMappingURL=userRoute.js.map