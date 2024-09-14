const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  req.connexion.query('SELECT * FROM test', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }
    res.status(200).json(rows);
  });
});

router.post("/user", (req, res) => {
    const { pseudo, num, mail } = req.body;
    const query = 'INSERT INTO test (pseudo, num, mail) VALUES (?, ?, ?)';
    req.connexion.query(query, [pseudo, num, mail], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Erreur lors de l\'insertion des données' });
        return;
      }
      res.status(201).json({ message: 'Utilisateur ajouté avec succès', id: result.insertId });
    });
  });

module.exports = router;