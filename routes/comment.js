import express from "express";
import { query } from "../helpers/db.js";

const commentRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         comment_id:
 *           type: integer
 *         post_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         comment_content:
 *           type: string
 *         saved:
 *           type: boolean
 *         user_name:
 *           type: string
 *         avatar:
 *           type: string
 */

/**
 * @swagger
 * /posts/{post_id}/comments:
 *   get:
 *     summary: Get all comments for a specific post
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of comments for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */

// Get all comments from a post by ID
commentRouter.get("/posts/:post_id/comments", async (req, res) => {
  const id = req.params.post_id;
  try {
    const sql =
      "select comments.*, users.nick_name, users.avatar, users.user_id from comments join users on comments.user_id = users.user_id WHERE post_id=$1";
    const result = await query(sql, [id]);
    const rows = result.rows ? result.rows : [];
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /posts/{post_id}/comments:
 *   post:
 *     summary: Create a new comment for a specific post
 *     tags:
 *        - Comment
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               comment_content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */

// *WORK* Create new comment
commentRouter.post("/posts/:post_id/comments", async (req, res) => {
  try {
    const userId = parseInt(req.body.user_id);
    const postId = parseInt(req.params.post_id);
    const commentContent = req.body.comment_content;

    // Insert comment and join with the users table to fetch user details
    const result = await query(
      `WITH inserted_comment AS (
        INSERT INTO comments (post_id, user_id, comment_content)
        VALUES ($1, $2, $3)
        RETURNING comment_id, post_id, user_id, comment_content, saved
      )
      SELECT ic.comment_id, ic.post_id, ic.user_id, ic.comment_content, ic.saved, u.avatar, u.user_name
      FROM inserted_comment ic
      JOIN users u ON ic.user_id = u.user_id`,
      [postId, userId, commentContent]
    );

    const rows = result.rows ? result.rows : [];
    if (rows.length === 0) {
      return res.status(404).json({ error: "No comment found" });
    }

    res.status(200).json({
      user_name: rows[0].user_name,
      comment_id: rows[0].comment_id,
      comment_content: rows[0].comment_content,
      avatar: rows[0].avatar,
      saved: rows[0].saved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /posts/{post_id}/comments/{comment_id}:
 *   put:
 *     summary: Edit an existing comment by ID
 *     tags:
 *        - Comment
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment_content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */

// Edit a comment
commentRouter.put("/posts/:post_id/comments/:comment_id", async (req, res) => {
  const comment_id = req.params.comment_id;
  const comment_content = req.body.comment_content;
  try {
    const result = await query(
      "UPDATE comments SET comment_content = $1 WHERE comment_id = $2 RETURNING *",
      [comment_content, comment_id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /posts/{post_id}/comments/{comment_id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags:
 *        - Comment
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment_id:
 *                   type: integer
 */

// Delete a comment by ID
commentRouter.delete(
  "/posts/:post_id/comments/:comment_id",
  async (req, res) => {
    const comment_id = Number(req.params.comment_id);
    try {
      const result = await query("DELETE FROM comments WHERE comment_id = $1", [
        comment_id,
      ]);
      res.status(200).json({ comment_id: comment_id });
    } catch (error) {
      console.log(error);
      res.statusMessage = error;
      res.status(500).json({ error: error });
    }
  }
);

export { commentRouter };
