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
exports.editProfile = exports.getUserProfile = exports.changePassword = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Create a new user
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: "Username, email and password are required." });
        }
        const existingUser = yield User_1.default.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists." });
        }
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
        const user = new User_1.default({ username, password: hashedPassword, email });
        yield user.save();
        res.status(201).json({ message: "User created successfully." });
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
// Login
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, process.env.SECRETKEY || "defaultSecretKey");
        res.status(200).json({ message: "Login successful.", token, userId: user._id });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
// Change password
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { oldPassword, newPassword } = req.body;
        console.log("User ID:", userId);
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old password and new password are required." });
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const isMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect." });
        }
        const saltRounds = 10;
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        yield user.save();
        res.status(200).json({ message: "Password changed successfully." });
    }
    catch (error) {
        next(error);
    }
});
exports.changePassword = changePassword;
// Get user profile by id
const getUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }
        const user = yield User_1.default.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const postCount = yield Post_1.default.countDocuments({ user_id: userId });
        res.status(200).json(Object.assign(Object.assign({}, user.toObject()), { postCount }));
    }
    catch (error) {
        next(error);
    }
});
exports.getUserProfile = getUserProfile;
// Edit profile
const editProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { email, nick_name, location, bio, avatar } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const updates = { email, nick_name, location, bio, avatar };
        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                user[key] = value;
            }
        });
        yield user.save();
        res.status(200).json({ message: "Profile updated successfully.", user });
    }
    catch (error) {
        next(error);
    }
});
exports.editProfile = editProfile;
//# sourceMappingURL=UserController.js.map