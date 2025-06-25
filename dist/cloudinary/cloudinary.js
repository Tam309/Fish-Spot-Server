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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME || "",
    api_key: process.env.CLOUDINARY_APIKEY || "",
    api_secret: process.env.CLOUDINARY_APISECRET || "",
});
/**
 * Uploads an image to Cloudinary.
 * @param filePath - The local path to the image file to be uploaded.
 * @param folder - The folder in Cloudinary where the image will be stored (optional).
 * @returns A promise that resolves with the Cloudinary upload response or rejects with an error.
 */
const uploadImageToCloudinary = (filePath, folder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {};
        if (folder) {
            options.folder = folder;
        }
        const result = yield cloudinary_1.v2.uploader.upload(filePath, options);
        return result;
    }
    catch (error) {
        throw new Error(`Failed to upload image to Cloudinary: ${error.message || error}`);
    }
});
exports.uploadImageToCloudinary = uploadImageToCloudinary;
//# sourceMappingURL=cloudinary.js.map