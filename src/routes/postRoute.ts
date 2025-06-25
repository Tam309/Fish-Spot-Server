import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { createPost, getPosts, deletePost, editPost, getPost, getUserPost } from '../controller/PostController';

const postRouter = express.Router();
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
postRouter.post('/create', authMiddleware, asyncHandler(createPost));

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
postRouter.get('/', authMiddleware, asyncHandler(getPosts));

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
postRouter.get('/user', authMiddleware, asyncHandler(getUserPost));

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
postRouter.get('/:postId', authMiddleware, asyncHandler(getPost));

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
postRouter.put('/:postId', authMiddleware, asyncHandler(editPost));

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
postRouter.delete('/:postId', authMiddleware, asyncHandler(deletePost));

export default postRouter;