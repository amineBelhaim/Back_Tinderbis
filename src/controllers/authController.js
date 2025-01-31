// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Inscription
exports.register = async (req, res) => {
  try {
    const { name, email, password, age, gender, location } = req.body;
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ msg: "L'utilisateur existe déjà" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      location,
    });
    await user.save();

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, userId: user.id });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "Identifiants invalides" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Identifiants invalides" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, userId: user.id });
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
};

// Obtenir le profil de l'utilisateur
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password"); // Exclure le mot de passe

    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    res.json(user);
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
};

// Mettre à jour le profil de l'utilisateur
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, age, gender, location, bio } = req.body;

    // Optionnel : vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.id !== req.user) {
        return res.status(400).json({ msg: "Email déjà utilisé" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { name, email, age, gender, location, bio },
      { new: true, runValidators: true, context: "query" }
    ).select("-password"); // Exclure le mot de passe

    res.json(updatedUser);
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
};
