const express = require('express');
const router = express.Router();
const UsersController = require('./accompagnateurController');
const { AddAccompagnateur } = require('./accompagnateurController');

router.get("/", (req, res) => {
    res.status(200).json({message: "Accompagnateur" });
});

router.get("/accId/:id", (req, res) => {
    const { id } = req.params;
    UsersController.GetAccompagnateurById(req.connexion, { id }, (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la récupération des données' });
            return;
        }
        res.status(200).json(rows);
    });
});

router.get("/accMail/:mail", (req, res) => {
    const { mail } = req.params;
    UsersController.GetAccompagnateurByMail(req.connexion, { mail }, (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la récupération des données' });
            return;
        }
        res.status(200).json(rows);
    });
});

router.get("/accNum/:num", (req, res) => {
    const { num } = req.params;
    UsersController.GetAccompagnateurByNum(req.connexion, { num }, (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la récupération des données' });
            return;
        }
        res.status(200).json(rows);
    });
});

router.post("/accAdd", (req, res) => {
    const { name_acc, surname_acc, num_acc, mail_acc } = req.body;
    AddAccompagnateur(req.connexion, { name_acc, surname_acc, num_acc, mail_acc }, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de l\'insertion des données' });
            return;
        }
        res.status(201).json({ message: 'Accompagnateur ajouté avec succès', id: result.insertId });
    });
});

module.exports = router;