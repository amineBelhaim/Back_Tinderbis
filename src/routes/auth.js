// backend/routes/auth.js
const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

// Routes d'authentification
router.post("/register", register);
router.post("/login", login);

// Routes de profil
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

module.exports = router;
