import multer from "multer";

// store files temporarily on disk (Cloudinary will upload later)
const storage = multer.diskStorage({});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // optional: max 5MB
});

export default upload;
