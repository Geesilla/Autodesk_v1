import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export async function POST(req, res) {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(500).send("Error uploading file");
    }
    return res.status(200).send({ file: req.file });
  });
}
