import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";

export default class CloudinaryHelper {
  constructor() {
    this.cloudinary = cloudinary;
    this.cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  uploadFile(fileObj, folderName) {
    return new Promise(async (resolve, rejected) => {
      try {
        const response = await this.cloudinary.uploader.upload(fileObj.path, {
          folder: folderName,
          public_id: fileObj.filename,
          resource_type: fileObj.mimetype.startsWith("image") ? "image" : "raw",
        });
        resolve(response);
      } catch (error) {
        rejected(error);
      }
    });
  }

  deleteFile(fileUniqueID) {
    return new Promise(async (resolve, rejected) => {
      try {
        const response = await cloudinary.uploader.destroy(fileUniqueID);
        resolve(response);
      } catch (error) {
        rejected(error);
      }
    });
  }
  deleteFolder(folderUniqueID) {
    return new Promise(async (resolve, rejected) => {
      try {
        const response = await cloudinary.api.delete_folder(folderUniqueID);
        resolve(response);
      } catch (error) {
        rejected(error);
      }
    });
  }
}
