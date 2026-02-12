require('dotenv').config(); // Lire .env
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const notesRoutes = require('./routes/notes.routes');

const app = express();

// Connexion MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: '*', // autorise toutes les sources (pour le dev)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
app.use('/api/notes', notesRoutes);

// PORT et HOST
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // écoute toutes les interfaces réseau

// Lancer le serveur
app.listen(PORT, HOST, () => {
  console.log(`🚀 Serveur démarré sur http://${HOST}:${PORT}`);
  console.log(`📱 Accessible depuis ton téléphone à l'adresse : http://192.168.11.109:${PORT}`);
});

// Test rapide pour vérifier que GET fonctionne
app.get('/test', (req, res) => {
  res.json({ message: 'Le backend est accessible depuis le téléphone !' });
});
