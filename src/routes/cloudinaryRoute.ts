import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import { uploadImageToCloudinary } from "../cloudinary/cloudinary";
import { authMiddleware } from '../middleware/authMiddleware'; 

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

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
router.post(
  "/upload",
  upload.single("image"),
  authMiddleware, 
  (req: Request, res: Response, next: NextFunction) => {
    (async () => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded." });
        }

        const filePath = req.file.path; 
        const folder = req.body.folder || undefined; 

        const result = await uploadImageToCloudinary(filePath, folder);

        res.status(200).json({
          message: "Image uploaded successfully.",
          url: result.secure_url,
          public_id: result.public_id,
        });
      } catch (error) {
        next(error); 
      }
    })();
  }
);

export default router;