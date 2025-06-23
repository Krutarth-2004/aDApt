const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Load Cloudinary credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a storage engine for a given folder
const storage = (folderName) =>
  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowed_formats: [
        "jpg",
        "png",
        "jpeg",
        "pdf",
        "doc",
        "docx",
        "txt",
        "mp4",
      ],
    },
  });

/**
 * Usage:
 *   const upload = require('../middleware/cloudinaryUpload')('sharedlib_uploads');
 *   router.post(..., upload.single('file'), controller.uploadCourseFile);
 */
module.exports = (folderName) =>
  multer({
    storage: storage(folderName),
    limits: {
      fileSize: 500 * 1024, // limit: 500 KB
      files: 1,
    },
  });
