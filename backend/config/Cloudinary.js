import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUD_NAME
const apiKey = process.env.API_KEY
const apiSecret = process.env.API_SECRET

// Only configure if credentials are available
if (cloudName && apiKey && apiSecret) {
        cloudinary.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
        });
} else {
        console.warn("Cloudinary environment variables are missing. Profile image uploads will be skipped.");
}

export default cloudinary