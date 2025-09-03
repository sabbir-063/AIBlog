const router = require("express").Router();
const { registerUser, loginUser, updateUser } = require("../Controllers/authController");
const { upload, uploadProfilePictureLocal } = require("../Middleware/upload");


// POST /api/auth/register
router.post("/register", upload.single("profilePicture"), uploadProfilePictureLocal, registerUser);
// POST /api/auth/login
router.post("/login", loginUser);

module.exports = router;
