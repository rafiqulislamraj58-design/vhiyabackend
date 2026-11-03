import ImageKit from "imagekit";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();


const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});


export const uploadToImageKit = async (fileBuffer, fileName) => {
  try {
    const response = await imagekit.upload({
      file: fileBuffer, 
      fileName: fileName, 
      folder: "/political-site", 
    });
    return response; 
  } catch (error) {
    throw new Error("ImageKit upload failed: " + error.message);
  }
};

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});