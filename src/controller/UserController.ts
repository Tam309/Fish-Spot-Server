import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Post from "../models/Post"; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Create a new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, email } = req.body;
    
        if (!username || !password || !email) {
        return res.status(400).json({ message: "Username, email and password are required." });
        }
    
        const existingUser = await User.findOne({ username });
        if (existingUser) {
        return res.status(409).json({ message: "User already exists." });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        const user = new User({ username, password: hashedPassword, email });
        await user.save();
    
        res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        next(error);
    }
}

// Login
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.SECRETKEY || "defaultSecretKey"
        );

        res.status(200).json({ message: "Login successful.", token, userId: user._id });
    } catch (error) {
        next(error);
    }
}

// Change password
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as { id: string })?.id;
        const { oldPassword, newPassword } = req.body;
        console.log("User ID:", userId);

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old password and new password are required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
        next(error);
    }
}

// Get user profile by id
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as { id: string })?.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const postCount = await Post.countDocuments({ user_id: userId });

        res.status(200).json({ ...user.toObject(), postCount });
    } catch (error) {
        next(error);
    }
}

// Edit profile
export const editProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as { id: string })?.id;
        const { email, nick_name, location, bio, avatar } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const updates = { email, nick_name, location, bio, avatar };
        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
            (user as any)[key] = value;
            }
        });

        await user.save();

        res.status(200).json({ message: "Profile updated successfully.", user });
    } catch (error) {
        next(error);
    }
}