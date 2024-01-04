import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
	process.env;

cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
});

// const storage = new CloudinaryStorage({
// 	cloudinary,
// 	params: {
// 		folder: 'avatars',
// 		allowedFormats: ['jpeg', 'png', 'jpg'],
// 	},
// });

export default cloudinary;
