// backend/src/controllers/chatController.js
const { Message, User } = require("../models");

// Envoyer un message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, message } = req.body;
    const sender = req.user;

    // Vérifier que les deux utilisateurs ont matché
    const senderUser = await User.findById(sender);
    const receiverUser = await User.findById(receiver);

    if (!receiverUser || !senderUser.matches.includes(receiver)) {
      return res.status(403).json({
        msg: "Vous ne pouvez pas envoyer de message à cet utilisateur.",
      });
    }

    // Enregistrer le message en base de données
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    res.json(newMessage);
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
};

// Récupérer les messages entre deux utilisateurs
exports.getMessages = async (req, res) => {
  try {
    const sender = req.user;
    const receiver = req.params.userId;

    // Vérifier si les deux utilisateurs ont matché
    const senderUser = await User.findById(sender);
    if (!senderUser.matches.includes(receiver)) {
      return res
        .status(403)
        .json({ msg: "Vous ne pouvez pas voir cette conversation." });
    }

    // Récupérer les messages entre les deux utilisateurs
    const messages = await Message.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
};
