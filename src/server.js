// backend/src/server.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/database");
const { Message, User } = require("./models"); // Utiliser le fichier index.js
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // À ajuster en production
    methods: ["GET", "POST"],
  },
});

// Connexion à la base de données
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const matchRoutes = require("./routes/match");
const chatRoutes = require("./routes/chat"); // Assurez-vous que chatRoutes est correctement importé

console.log("Auth router:", authRoutes);
console.log("Match router:", matchRoutes);
console.log("Chat router:", chatRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/chat", chatRoutes);
// app.use("/api/test", testRoutes); // Décommentez si vous avez une route de test

// Stocker les utilisateurs connectés
let connectedUsers = {};

io.on("connection", (socket) => {
  console.log(`🟢 Utilisateur connecté : ${socket.id}`);

  // Associer l'utilisateur au socket
  socket.on("userConnected", (userId) => {
    connectedUsers[userId] = socket.id;
    console.log(
      `👤 Utilisateur ${userId} connecté avec le socket ${socket.id}`
    );
  });

  // Envoyer un message à un utilisateur spécifique
  socket.on("sendMessage", async (data) => {
    const { sender, receiver, message } = data;

    // Vérifier si les utilisateurs ont matché
    const senderUser = await User.findById(sender);
    if (!senderUser || !senderUser.matches.includes(receiver)) {
      return;
    }

    // Sauvegarder le message en base de données
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    // Envoyer le message au destinataire si connecté
    const receiverSocket = connectedUsers[receiver];
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", newMessage);
    }

    console.log(`📩 Message envoyé de ${sender} à ${receiver}: ${message}`);
  });

  // Gérer la déconnexion des utilisateurs
  socket.on("disconnect", () => {
    console.log(`🔴 Utilisateur déconnecté : ${socket.id}`);

    // Retirer l'utilisateur de la liste
    Object.keys(connectedUsers).forEach((userId) => {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
      }
    });
  });
});

// Sécurité - Headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "connect-src 'self' ws://127.0.0.1:5000;"
  );
  next();
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Serveur WebSocket actif sur ws://127.0.0.1:${PORT}`)
);
