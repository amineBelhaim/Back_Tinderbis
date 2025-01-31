// backend/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    location: { type: String },
    bio: { type: String }, // Champ supplémentaire
    likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Nouveau champ
  },
  { timestamps: true }
);

// Prévenir la redéfinition du modèle
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
