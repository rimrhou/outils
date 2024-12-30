const mysql = require('mysql');
require('dotenv').config(); // Charger les variables d'environnement

// Configuration de la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Établir la connexion
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion :', err.message);
    return;
  }
  console.log('Connecté à la base de données MySQL.');
});

module.exports = db;
