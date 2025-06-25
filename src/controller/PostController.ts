import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";
import User from "../models/User";
import mongoose from "mongoose";

// Create new post
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { spot_name, location, description, fish_type, image } = req.body;

        if (!spot_name || !location || !description || !fish_type) {
            return res.status(400).json({ message: "All fields are required except image." });
        }

        const userId = (req.user as { id: string })?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }

        const newPost = new Post({
            user_id: userId,
            spot_name,
            location,
            description,
            fish_type,
            image: image || "", 
        });

        const savedPost = await newPost.save();

        res.status(201).json({
            message: "Post created successfully.",
            post: savedPost,
        });
    } catch (error) {
        next(error); 
    }
};

//Get all post
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find().populate("user_id", "nick_name avatar username");

        const formattedData = posts.map((post: any) => ({
            post_id: post._id,
            spot_name: post.spot_name,
            description: post.description,
            photo_url: post.image,
            location: post.location,
            sharedBy: post.user_id?._id || null, 
            date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A", 
            nick_name: post.user_id?.nick_name || post.user_id?.username || "Anonymous", 
            avatar: post.user_id?.avatar || "https://via.placeholder.com/50", 
            fish_type: post.fish_type,
        }));

        res.status(200).json({
            message: "Posts retrieved successfully.",
            posts: formattedData,
        });
    } catch (error) {
        next(error);
    }
};

//Get single post
export const getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID." });
        }

        const post = await Post.findById(postId).populate("user_id", "nick_name avatar username");

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        const formattedPost = {
            post_id: post._id,
            spot_name: post.spot_name,
            description: post.description,
            photo_url: post.image,
            location: post.location,
            sharedBy: post.user_id?._id || null, 
            date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A",
            nick_name: (post.user_id as any)?.nick_name || (post.user_id as any)?.username || "Anonymous", 
            avatar: (post.user_id as any)?.avatar || "https://via.placeholder.com/50", // Use avatar from User
            fish_type: post.fish_type,
        };

        res.status(200).json({
            message: "Post retrieved successfully.",
            post: formattedPost,
        });
    } catch (error) {
        next(error);
    }
};


//Delete post
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID." });
        }

        const userId = (req.user as { id: string })?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }

        const post = await Post.findOne({ _id: postId, user_id: userId });

        if (!post) {
            return res.status(404).json({ message: "Post not found or you do not have permission to delete it." });
        }

        await Post.deleteOne({ _id: postId });

        res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        next(error);
    }
};

//Edit post 
export const editPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID." });
        }

        const { spot_name, location, description, fish_type, image } = req.body;

        const userId = (req.user as { id: string })?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }

        const post = await Post.findOne({ _id: postId, user_id: userId });

        if (!post) {
            return res.status(404).json({ message: "Post not found or you do not have permission to edit it." });
        }

        post.spot_name = spot_name || post.spot_name;
        post.location = location || post.location;
        post.description = description || post.description;
        post.fish_type = fish_type || post.fish_type;
        post.image = image || post.image;

        const updatedPost = await post.save();

        res.status(200).json({
            message: "Post updated successfully.",
            post: updatedPost,
        });
    } catch (error) {
        next(error);
    }
};

//Get user's posts
export const getUserPost = async(req:Request, res: Response, next: NextFunction) => {
    try{
        const userId = (req.user as { id: string })?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }

        const posts = await Post.find({ user_id: userId }).populate("user_id", "nick_name avatar username");
        const formattedData = posts.map((post: any) => ({
            post_id: post._id,
            spot_name: post.spot_name,
            description: post.description,
            photo_url: post.image,
            sharedBy: post.user_id?._id || null, 
            date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A", 
            nick_name: post.user_id?.nick_name || post.user_id?.username || "Anonymous", 
            avatar: post.user_id?.avatar || "https://via.placeholder.com/50", 
            fish_type: post.fish_type,
        }));
        res.status(200).json({
            message: "Posts retrieved successfully.",
            posts: formattedData,
        });
    }catch (error) {
        next(error);
    }
}

