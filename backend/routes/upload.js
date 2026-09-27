const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary credentials with verified project defaults so uploads NEVER fail
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "gjjnq5g0";
const apiKey = process.env.CLOUDINARY_API_KEY || "719527795383164";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "5-qhsQBo_a62SzTyQDBpod-zjrc";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

let storage;
try {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "carrents/vehicles",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      transformation: [
        { width: 1400, height: 950, crop: "limit", quality: "auto" },
      ],
    },
  });
  console.log("🚀 Image upload engine initialized: Cloudinary (Cloud CDN)");
} catch (e) {
  console.error("Cloudinary init warning:", e.message);
}

if (!storage) {
  // Ensure local uploads directory exists for fallback
  const uploadDir = path.join(__dirname, "../uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
  console.log("⚠️ Image upload engine initialized: Local Disk (./uploads)");
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype || extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Images Only (JPEG, PNG, WebP, GIF)!"));
    }
  },
});

// @route   POST api/upload
// @desc    Upload an image and return permanent URL
router.post("/", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ msg: "File too large. Maximum allowed size is 10MB." });
      }
      return res
        .status(400)
        .json({ msg: err.message || "Failed to upload file. Images only." });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      // Cloudinary returns file.path or file.secure_url; local storage returns file.filename
      let imageUrl = req.file.path || req.file.secure_url;
      if (!imageUrl && req.file.filename) {
        const baseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:5000";
        imageUrl = `${baseUrl.replace(/\/$/, "")}/uploads/${req.file.filename}`;
      }

      console.log("📸 Image successfully uploaded:", imageUrl);
      return res.json({ url: imageUrl, msg: "Image uploaded successfully!" });
    } catch (error) {
      console.error("Upload error:", error.message);
      return res
        .status(500)
        .json({ msg: "Server Error during upload", error: error.message });
    }
  });
});

module.exports = router;
