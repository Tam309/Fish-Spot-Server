import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

cloudinary.config({
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
export const uploadImageToCloudinary = async (
  filePath: string,
  folder?: string
): Promise<UploadApiResponse> => {
  try {
    const options: { folder?: string } = {};
    if (folder) {
      options.folder = folder;
    }

    const result = await cloudinary.uploader.upload(filePath, options);
    return result;
  } catch (error) {
    throw new Error(
      `Failed to upload image to Cloudinary: ${
        (error as UploadApiErrorResponse).message || error
      }`
    );
  }
};