import cloudinary from "./Cloudinary.js";
export const uploadToCloudinary = (buffer) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "blog_users" },
                (err, result) => {
                if (err) return reject(err);
                resolve(result);
                }
            );
            stream.end(buffer);
        });
        };