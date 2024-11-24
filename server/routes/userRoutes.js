const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyProfile,
  logoutUser,
} = require("../controllers/userController");
const { authenticateToken } = require("../helpers/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-profile", authenticateToken, verifyProfile);
router.post("/logout", logoutUser);

module.exports = router;
