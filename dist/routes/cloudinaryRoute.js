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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../cloudinary/cloudinary");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({});
const upload = (0, multer_1.default)({ storage });
/**
 * @swagger
 * components:
 *   schemas:
 *     UploadResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         url:
 *           type: string
 *         public_id:
 *           type: string
 */
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an image to Cloudinary
 *     tags:
 *       - Cloudinary
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *                 description: Optional folder name in Cloudinary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/upload", upload.single("image"), authMiddleware_1.authMiddleware, (req, res, next) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded." });
            }
            const filePath = req.file.path;
            const folder = req.body.folder || undefined;
            const result = yield (0, cloudinary_1.uploadImageToCloudinary)(filePath, folder);
            res.status(200).json({
                message: "Image uploaded successfully.",
                url: result.secure_url,
                public_id: result.public_id,
            });
        }
        catch (error) {
            next(error);
        }
    }))();
});
exports.default = router;
//# sourceMappingURL=cloudinaryRoute.js.map