import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload file to cloudinary and return the url and public_id
export const uploadToCloudinary = async (filePath: string, folder = 'carDoctor') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
    });
    // delete the local file after upload
    try {
      await fs.unlink(filePath);
      console.log('File deleted successfully!');
    } catch (err) {
      console.warn('Failed to delete local file:', err);
    }
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// delete file from cloudinary by public_id
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) {
      return;
    }
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};
