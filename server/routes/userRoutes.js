const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/userController");
// const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

// router.post("/upload-image", upload.single("image"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   // Store only filename
//   const fileName = req.file.filename;

//   // Still return the full URL for immediate preview
//   const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;

//   res.status(200).json({ fileName, imageUrl });
// });
module.exports = router;
