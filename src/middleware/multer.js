import multer from "multer";
import fs from "fs";

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadFile = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const singlephoto = uploadFile.single("photo");

export default singlephoto;