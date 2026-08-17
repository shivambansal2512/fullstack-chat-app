import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Lets the controllers return a clear "not configured" message instead of a
// confusing 500 when the keys are missing from .env.
export const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

/**
 * Uploads a base64 image and returns its hosted URL.
 * We store only this URL in MongoDB - never the image data itself.
 */
export const uploadImage = async (base64Image, folder) => {
  const result = await cloudinary.uploader.upload(base64Image, { folder });
  return result.secure_url;
};

export default cloudinary;
