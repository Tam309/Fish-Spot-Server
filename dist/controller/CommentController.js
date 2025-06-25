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
exports.deleteComment = exports.editComment = exports.getComments = exports.createComment = void 0;
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const mongoose_1 = __importDefault(require("mongoose"));
// Create a new comment
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { postId, content } = req.body;
        if (!postId || !content) {
            return res.status(400).json({ message: "Post ID and content are required." });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }
        const post = yield Post_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        const user = yield User_1.default.findById(userId).select("username nick_name avatar");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const comment = {
            _id: new mongoose_1.default.Types.ObjectId(),
            user_id: new mongoose_1.default.Types.ObjectId(userId),
            post_id: postId,
            content,
            createdAt: new Date()
        };
        (_b = post.comments) === null || _b === void 0 ? void 0 : _b.push(comment);
        yield post.save();
        const responseComment = Object.assign(Object.assign({}, comment), { username: user.username, nick_name: user.nick_name, avatar: user.avatar });
        res.status(201).json({ message: "Comment created successfully.", comment: responseComment });
    }
    catch (error) {
        next(error);
    }
});
exports.createComment = createComment;
// Get all comments for a post
const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        if (!postId) {
            return res.status(400).json({ message: "Post ID is required." });
        }
        const post = yield Post_1.default.findById(postId).populate('comments.user_id', 'username avatar nick_name');
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        res.status(200).json({ comments: post.comments });
    }
    catch (error) {
        next(error);
    }
});
exports.getComments = getComments;
//Edit comment
const editComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { content } = req.body;
        const { commentId } = req.params;
        if (!commentId || !content) {
            return res.status(400).json({ message: "Comment ID and content are required." });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }
        const post = yield Post_1.default.findOne({ "comments._id": commentId, "comments.user_id": userId });
        if (!post) {
            return res.status(404).json({ message: "Comment not found or you do not have permission to edit it." });
        }
        const comment = (_b = post.comments) === null || _b === void 0 ? void 0 : _b.find((comment) => comment._id.toString() === commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }
        comment.content = content;
        comment.createdAt = new Date();
        yield post.save();
        res.status(200).json({ message: "Comment updated successfully.", comment });
    }
    catch (error) {
        next(error);
    }
});
exports.editComment = editComment;
// Delete comment
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { commentId } = req.params;
        if (!commentId) {
            return res.status(400).json({ message: "Comment ID is required." });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }
        const post = yield Post_1.default.findOne({ "comments._id": commentId, "comments.user_id": userId });
        if (!post) {
            return res.status(404).json({ message: "Comment not found or you do not have permission to delete it." });
        }
        post.comments = (_b = post.comments) === null || _b === void 0 ? void 0 : _b.filter((comment) => comment._id.toString() !== commentId);
        yield post.save();
        res.status(200).json({ message: "Comment deleted successfully." });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteComment = deleteComment;
//# sourceMappingURL=CommentController.js.map