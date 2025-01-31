// backend/controllers/matchController.js
const { User } = require("../models");

// Liker un utilisateur
exports.likeUser = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const likedUser = await User.findById(req.params.id);

    if (!likedUser)
      return res.status(404).json({ msg: "Utilisateur non trouvé" });

    // Ajouter le like
    if (!user.likedUsers.includes(likedUser._id)) {
      user.likedUsers.push(likedUser._id);
      await user.save();
    }

    // Vérifier si c'est un match
    if (likedUser.likedUsers.includes(user._id)) {
      user.matches.push(likedUser._id);
      likedUser.matches.push(user._id);
      await user.save();
      await likedUser.save();
      return res.json({ msg: "C'est un match !", match: true });
    }

    res.json({ msg: "Like enregistré", match: false });
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
};

// Obtenir les matchs
exports.getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate(
      "matches",
      "name email age location bio" // Ajouter bio si disponible
    );

    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    res.json(user.matches);
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
};

// Obtenir les likes
exports.getLikes = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate(
      "likedUsers",
      "name email age location bio" // Ajouter bio si disponible
    );

    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    res.json(user.likedUsers);
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
};

exports.getSwipeUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user);
    if (!currentUser)
      return res.status(404).json({ msg: "Utilisateur non trouvé" });

    // Combiner toutes les listes d'exclusion en une seule
    const excludedUsers = [
      req.user,
      ...currentUser.likedUsers,
      ...currentUser.matches,
      ...currentUser.dislikedUsers,
    ];

    // Requête corrigée
    const swipeUsers = await User.find({
      _id: { $nin: excludedUsers },
    }).select("-password"); // Exclure les mots de passe

    res.json(swipeUsers);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

exports.dislikeUser = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const dislikedUser = await User.findById(req.params.id);

    if (!dislikedUser)
      return res.status(404).json({ msg: "Utilisateur non trouvé" });

    // Ajouter le dislike
    if (!user.dislikedUsers.includes(dislikedUser._id)) {
      user.dislikedUsers.push(dislikedUser._id);
      await user.save();
    }

    res.json({ msg: "Utilisateur disliké" });
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
};
