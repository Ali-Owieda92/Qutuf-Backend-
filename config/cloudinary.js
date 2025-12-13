import multer from "multer";
import { v2 as cloudinary } from "cloudinary";


export const upload = multer({ storage: multer.memoryStorage() });


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, public_id: result.public_id });
    }
    );
        stream.end(fileBuffer);
    });
};

export const deleteFromCloudinary = async (public_id) => {
    return cloudinary.uploader.destroy(public_id);
};

export default cloudinary;