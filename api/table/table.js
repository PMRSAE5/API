const express = require('express');
const router = express.Router();
const TableController = require('./TableController');

router.get("/", (req, res) => {
  TableController.getAllTests(req.connexion, (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }
    res.status(200).json(rows);
  });
});

router.post("/user", (req, res) => {
  const { pseudo, num, mail } = req.body;
  TableController.insertUser(req.connexion, { pseudo, num, mail }, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de l\'insertion des données' });
      return;
    }
    res.status(201).json({ message: 'Utilisateur ajouté avec succès', id: result.insertId });
  });
});

router.get("/user/:id", (req, res) => {
  const { id } = req.params;
  TableController.getUserbyId(req.connexion, { id }, (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }
    res.status(200).json(rows);
  });
});

module.exports = router;