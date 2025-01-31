// backend/src/routes/chat.js
const express = require("express");
const { sendMessage, getMessages } = require("../controllers/chatController"); // Assurez-vous que les noms sont corrects
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

// Route pour envoyer un message
router.post("/send", auth, sendMessage);

// Route pour obtenir les messages entre deux utilisateurs
router.get("/messages/:userId", auth, getMessages);

module.exports = router;
