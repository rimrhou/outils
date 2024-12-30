// Import des modules nécessaires
const express = require('express');
const { Pool } = require('pg'); // Importer le module pg pour PostgreSQL
const cors = require('cors');
require('dotenv').config();

// Création de l'application Express
const app = express();
app.use(cors());
app.use(express.json()); // Permet de parser les requêtes JSON

// Connexion à la base de données PostgreSQL
const db = new Pool({
  connectionString: 'postgresql://outils_user:5fzFMKfw2b7DbQhfYxiDTxgQTlm536Ed@dpg-ctp66djtq21c73d2ad20-a/outils'
});

// Vérification de la connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion :', err.message);
    return;
  }
  console.log('Connecté à la base de données PostgreSQL.');
});

// Lancer le serveur
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

// Routes pour la gestion des utilisateurs
// Ajouter un utilisateur
app.post('/api/users', (req, res) => {
  const { username, email, password, role } = req.body;
  const query = 'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)';
  db.query(query, [username, email, password, role], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de l'ajout de l'utilisateur." });
    }
    res.status(201).json({ message: "Utilisateur ajouté avec succès." });
  });
});

// Lister tous les utilisateurs
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
    }
    res.json(results.rows);
  });
});

// Mettre à jour un utilisateur
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  const query = 'UPDATE users SET username = $1, email = $2, password = $3, role = $4 WHERE id = $5';
  db.query(query, [username, email, password, role, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur." });
    }
    res.json({ message: "Utilisateur mis à jour avec succès." });
  });
});

// Supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM users WHERE id = $1', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur." });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.json({ message: "Utilisateur supprimé avec succès." });
  });
});

// Route pour vérifier la connexion
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe sont requis." });
  }

  const query = 'SELECT * FROM users WHERE email = $1';
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const user = results.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    res.status(200).json({
      message: "Connexion réussie.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
});

// Routes pour la gestion des catégories
// Ajouter une catégorie
app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  const query = 'INSERT INTO categories (name, description) VALUES ($1, $2)';
  db.query(query, [name, description], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de l'ajout de la catégorie." });
    }
    res.status(201).json({ message: "Catégorie ajoutée avec succès." });
  });
});

// Lister toutes les catégories
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération des catégories." });
    }
    res.json(results.rows);
  });
});

// Mettre à jour une catégorie
app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const query = 'UPDATE categories SET name = $1, description = $2 WHERE id = $3';
  db.query(query, [name, description, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la mise à jour de la catégorie." });
    }
    res.json({ message: "Catégorie mise à jour avec succès." });
  });
});

// Supprimer une catégorie
app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM categories WHERE id = $1', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la suppression de la catégorie." });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Catégorie non trouvée." });
    }

    res.json({ message: "Catégorie supprimée avec succès." });
  });
});

// Routes pour la gestion des outils
// Ajouter un outil
app.post('/api/tools', (req, res) => {
  const { designation, nature, type, marque, reference, puissance, couleur, numero_serie, quantite, etat, utilise_avec, client, emplacement, description, remarque, observation, statut } = req.body;
  const query = `
    INSERT INTO tools 
    (designation, nature, type, marque, reference, puissance, couleur, numero_serie, quantite, etat, utilise_avec, client, emplacement, description, remarque, observation, statut) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [designation, nature, type, marque, reference, puissance, couleur, numero_serie, quantite, etat, utilise_avec, client, emplacement, description, remarque, observation, statut], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de l'ajout d'outil." });
    }
    res.status(201).json({ message: "Outil ajouté avec succès." });
  });
});

// Mettre à jour un outil
app.put('/api/tools/:id', (req, res) => {
  const { id } = req.params;
  const { designation, nature, type, marque, reference, puissance, couleur, numero_serie, quantite, etat, utilise_avec, client, emplacement, description, remarque, observation, statut } = req.body;

  const query = `
    UPDATE tools 
    SET designation=?, nature=?, type=?, marque=?, reference=?, puissance=?, couleur=?, numero_serie=?, quantite=?, etat=?, utilise_avec=?, client=?, emplacement=?, description=?, remarque=?, observation=?, statut=? 
    WHERE id = ?`;
  db.query(query, [designation, nature, type, marque, reference, puissance, couleur, numero_serie, quantite, etat, utilise_avec, client, emplacement, description, remarque, observation, statut, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la mise à jour de l'outil." });
    }
    res.json({ message: "Outil mis à jour avec succès." });
  });
});

// Supprimer un outil
app.delete('/api/tools/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM tools WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la suppression de l'outil." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Outil non trouvé." });
    }

    res.json({ message: "Outil supprimé avec succès." });
  });
});

// Lister tous les outils
app.get('/api/tools', (req, res) => {
  const toolsResults = 'SELECT * FROM tools';
  const categoriesResults = 'SELECT * FROM categories';
  db.query(toolsResults, (err, tools) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération des outils." });
    }

    db.query(categoriesResults, (err, categories) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors de la récupération des catégories." });
      }
      res.json({
        tools,
        categories
      });
    });
  });
});




app.get('/api/dettools', (req, res) => {0..toExponential.apply
  const toolsQuery = 'SELECT * FROM tools';
  const categoriesQuery = `
    SELECT categories.name AS category_name , tools.category as name , COUNT(*) AS count
FROM tools
JOIN categories ON tools.category = categories.id
GROUP BY categories.name;

  `;

  db.query(toolsQuery, (err, toolsResults) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération des outils." });
    }

    db.query(categoriesQuery, (err, categoriesResults) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors de la récupération des catégories." });
      }

      // Répondre avec les données organisées
      res.json({
        tools: toolsResults,
        categories: categoriesResults
      });
    });
  });
});
