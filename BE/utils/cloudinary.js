const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `vietduky/${folder}`, // Lưu vào thư mục riêng trên Cloudinary
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    },
  });

// Middleware Multer cho từng loại ảnh
const uploadAvatar = multer({ storage: createStorage("avatars") });
const uploadTourImage = multer({ storage: createStorage("tourImage") });
const uploadLocation = multer({ storage: createStorage("locations") });
const uploadTourActivities = multer({
  storage: createStorage("tour_activities"),
});
const uploadAlbumPost = multer({ storage: createStorage("album_posts") });
const uploadPostExperience = multer({
  storage: createStorage("post_experience"),
});
const uploadAlbumFeedback = multer({
  storage: createStorage("album_feedback"),
});
module.exports = {
  cloudinary,
  uploadAvatar,
  uploadTourImage,
  uploadLocation,
  uploadTourActivities,
  uploadAlbumPost,
  uploadPostExperience,
  uploadAlbumFeedback,
};
