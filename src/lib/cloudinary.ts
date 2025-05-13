import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
};

const cloudinaryInstance = cloudinary;

cloudinaryInstance.config(cloudinaryConfig);

export { 
  cloudinaryInstance
};
