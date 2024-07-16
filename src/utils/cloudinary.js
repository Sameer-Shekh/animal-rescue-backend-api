import { configDotenv } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

configDotenv();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImageCloud = (filePath, fileName) => {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: 'auto', 
        public_id: fileName,
      };
  
      cloudinary.uploader.upload(filePath, uploadOptions, (error, result) => {
        if (error) {
          console.error(error);
          reject({ error }); 
        } else {
          resolve({ result });
        }
      });
    });
  };

export { uploadImageCloud };
