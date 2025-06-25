"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPost = exports.editPost = exports.deletePost = exports.getPost = exports.getPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const mongoose_1 = __importDefault(require("mongoose"));
// Create new post
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { spot_name, location, description, fish_type, image } = req.body;
        if (!spot_name || !location || !description || !fish_type) {
            return res.status(400).json({ message: "All fields are required except image." });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }
        const newPost = new Post_1.default({
            user_id: userId,
            spot_name,
            location,
            description,
            fish_type,
            image: image || "",
        });
        const savedPost = yield newPost.save();
        res.status(201).json({
            message: "Post created successfully.",
            post: savedPost,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createPost = createPost;
//Get all post
const getPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find().populate("user_id", "nick_name avatar username");
        const formattedData = posts.map((post) => {
            var _a, _b, _c, _d;
            return ({
                post_id: post._id,
                spot_name: post.spot_name,
                description: post.description,
                photo_url: post.image,
                location: post.location,
                sharedBy: ((_a = post.user_id) === null || _a === void 0 ? void 0 : _a._id) || null,
                date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A",
                nick_name: ((_b = post.user_id) === null || _b === void 0 ? void 0 : _b.nick_name) || ((_c = post.user_id) === null || _c === void 0 ? void 0 : _c.username) || "Anonymous",
                avatar: ((_d = post.user_id) === null || _d === void 0 ? void 0 : _d.avatar) || "https://via.placeholder.com/50",
                fish_type: post.fish_type,
            });
        });
        res.status(200).json({
            message: "Posts retrieved successfully.",
            posts: formattedData,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getPosts = getPosts;
//Get single post
const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { postId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID." });
        }
        const post = yield Post_1.default.findById(postId).populate("user_id", "nick_name avatar username");
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        const formattedPost = {
            post_id: post._id,
            spot_name: post.spot_name,
            description: post.description,
            photo_url: post.image,
            location: post.location,
            sharedBy: ((_a = post.user_id) === null || _a === void 0 ? void 0 : _a._id) || null,
            date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A",
            nick_name: ((_b = post.user_id) === null || _b === void 0 ? void 0 : _b.nick_name) || ((_c = post.user_id) === null || _c === void 0 ? void 0 : _c.username) || "Anonymous",
            avatar: ((_d = post.user_id) === null || _d === void 0 ? void 0 : _d.avatar) || "https://via.placeholder.com/50", // Use avatar from User
            fish_type: post.fish_type,
        };
        res.status(200).json({
            message: "Post retrieved successfully.",
            post: formattedPost,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getPost = getPost;
//Delete post
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { postId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID." });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }
        const post = yield Post_1.default.findOne({ _id: postId, user_id: userId });
        if (!post) {
            return res.status(404).json({ message: "Post not found or you do not have permission to delete it." });
        }
        yield Post_1.default.deleteOne({ _id: postId });
        res.status(200).json({ message: "Post deleted successfully." });
    }
    catch (error) {
        next(error);
    }
});
exports.deletePost = deletePost;
//Edit post 
const editPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { postId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID." });
        }
        const { spot_name, location, description, fish_type, image } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }
        const post = yield Post_1.default.findOne({ _id: postId, user_id: userId });
        if (!post) {
            return res.status(404).json({ message: "Post not found or you do not have permission to edit it." });
        }
        post.spot_name = spot_name || post.spot_name;
        post.location = location || post.location;
        post.description = description || post.description;
        post.fish_type = fish_type || post.fish_type;
        post.image = image || post.image;
        const updatedPost = yield post.save();
        res.status(200).json({
            message: "Post updated successfully.",
            post: updatedPost,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.editPost = editPost;
//Get user's posts
const getUserPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }
        const posts = yield Post_1.default.find({ user_id: userId }).populate("user_id", "nick_name avatar username");
        const formattedData = posts.map((post) => {
            var _a, _b, _c, _d;
            return ({
                post_id: post._id,
                spot_name: post.spot_name,
                description: post.description,
                photo_url: post.image,
                sharedBy: ((_a = post.user_id) === null || _a === void 0 ? void 0 : _a._id) || null,
                date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A",
                nick_name: ((_b = post.user_id) === null || _b === void 0 ? void 0 : _b.nick_name) || ((_c = post.user_id) === null || _c === void 0 ? void 0 : _c.username) || "Anonymous",
                avatar: ((_d = post.user_id) === null || _d === void 0 ? void 0 : _d.avatar) || "https://via.placeholder.com/50",
                fish_type: post.fish_type,
            });
        });
        res.status(200).json({
            message: "Posts retrieved successfully.",
            posts: formattedData,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserPost = getUserPost;
//# sourceMappingURL=PostController.js.map