"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const PostController_1 = require("../controller/PostController");
const postRouter = express_1.default.Router();
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         spot_name:
 *           type: string
 *         location:
 *           type: string
 *         description:
 *           type: string
 *         fish_type:
 *           type: string
 *         image:
 *           type: string
 */
/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
postRouter.post('/create', authMiddleware_1.authMiddleware, asyncHandler(PostController_1.createPost));
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
postRouter.get('/', authMiddleware_1.authMiddleware, asyncHandler(PostController_1.getPosts));
/**
 * @swagger
 * /posts/user:
 *   get:
 *     summary: Get all posts created by the authenticated user
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 */
postRouter.get('/user', authMiddleware_1.authMiddleware, asyncHandler(PostController_1.getUserPost));
/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Get a single post by ID
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid post ID
 *       404:
 *         description: Post not found
 */
postRouter.get('/:postId', authMiddleware_1.authMiddleware, asyncHandler(PostController_1.getPost));
/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Edit a post by ID
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Invalid post ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
postRouter.put('/:postId', authMiddleware_1.authMiddleware, asyncHandler(PostController_1.editPost));
/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       400:
 *         description: Invalid post ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
postRouter.delete('/:postId', authMiddleware_1.authMiddleware, asyncHandler(PostController_1.deletePost));
exports.default = postRouter;
//# sourceMappingURL=postRoute.js.map