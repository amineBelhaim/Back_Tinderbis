// backend/models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Prévenir la redéfinition du modèle
module.exports =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
