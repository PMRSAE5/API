const express = require('express');
const router = express.Router();
const UsersController = require('./usersController');
const { AddClient } = require('./usersController');

router.get("/", (req, res) => {
    res.status(200).json({ message: "Utilisateur" });
});

router.get("/userId/:id", (req, res) => {
    const { id } = req.params;
    UsersController.GetClientById(req.connexion, { id }, (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la récupération des données' });
            return;
        }
        res.status(200).json(rows);
    });
});

router.get("/userMail/:mail", (req, res) => {
    const { mail } = req.params;
    UsersController.GetClientByMail(req.connexion, { mail }, (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la récupération des données' });
            return;
        }
        res.status(200).json(rows);
    });
});

router.post("/userAdd", (req, res) => {
    const { name, surname, num, mail, handicap, civilite, birth, password, contact_mail, contact_num, note } = req.body;
    AddClient(req.connexion, { name, surname, num, mail, handicap, civilite, birth, password, contact_mail, contact_num, note }, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de l\'insertion des données' });
            return;
        }
        res.status(201).json({ message: 'Client ajouté avec succès', id: result.insertId });
    });
});

module.exports = router;