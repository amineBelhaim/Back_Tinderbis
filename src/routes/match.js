// backend/routes/match.js
const express = require("express");
const {
  likeUser,
  dislikeUser, // Importer le dislikeUser
  getMatches,
  getLikes,
  getSwipeUsers,
} = require("../controllers/matchController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

// Liker un utilisateur
router.post("/like/:id", auth, likeUser);

// Disliker un utilisateur
router.post("/dislike/:id", auth, dislikeUser); // Nouvelle route

// Obtenir les matchs
router.get("/matches", auth, getMatches);

// Obtenir les likes
router.get("/likes", auth, getLikes);

// Obtenir les utilisateurs à swiper
router.get("/swipe", auth, getSwipeUsers);

module.exports = router;
