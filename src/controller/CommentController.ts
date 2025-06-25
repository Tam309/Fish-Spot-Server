import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Post from "../models/Post"; 
import mongoose from "mongoose";

// Create a new comment
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId, content } = req.body;

        if (!postId || !content) {
            return res.status(400).json({ message: "Post ID and content are required." });
        }

        const userId = (req.user as { id: string })?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        const user = await User.findById(userId).select("username nick_name avatar");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const comment = {
            _id: new mongoose.Types.ObjectId(),
            user_id: new mongoose.Types.ObjectId(userId),
            post_id: postId,
            content,
            createdAt: new Date()
        };

        post.comments?.push(comment);
        await post.save();

        const responseComment = {
            ...comment,
            username: user.username,
            nick_name: user.nick_name,
            avatar: user.avatar,
        };

        res.status(201).json({ message: "Comment created successfully.", comment: responseComment });
    } catch (error) {
        next(error);
    }
};

// Get all comments for a post
export const getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({ message: "Post ID is required." });
        }

        const post = await Post.findById(postId).populate('comments.user_id', 'username avatar nick_name');
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        res.status(200).json({ comments: post.comments });
    } catch (error) {
        next(error);
    }
}

//Edit comment
export const editComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { content } = req.body;
        const { commentId } = req.params;

        if (!commentId || !content) {
            return res.status(400).json({ message: "Comment ID and content are required." });
        }

        const userId = (req.user as { id: string })?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }

        const post = await Post.findOne({ "comments._id": commentId, "comments.user_id": userId });

        if (!post) {
            return res.status(404).json({ message: "Comment not found or you do not have permission to edit it." });
        }

        const comment = post.comments?.find((comment) => comment._id.toString() === commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }
        comment.content = content;
        comment.createdAt = new Date();
        await post.save();

        res.status(200).json({ message: "Comment updated successfully.", comment });
    } catch (error) {
        next(error);
    }
};

// Delete comment
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params;

        if (!commentId) {
            return res.status(400).json({ message: "Comment ID is required." });
        }

        const userId = (req.user as { id: string })?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }

        const post = await Post.findOne({ "comments._id": commentId, "comments.user_id": userId });

        if (!post) {
            return res.status(404).json({ message: "Comment not found or you do not have permission to delete it." });
        }

        post.comments = post.comments?.filter((comment) => comment._id.toString() !== commentId);
        await post.save();

        res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
        next(error);
    }
};