import express from "express";
import { v2 as cloudinary } from "cloudinary";
const cloudinaryRouter = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET,
    cloud_url: process.env.CLOUDINARY_URL
})

export { cloudinaryRouter };