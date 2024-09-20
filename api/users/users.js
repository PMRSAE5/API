const express = require('express');
const router = express.Router();
const UsersController = require('./usersController');

router.get("/", (req, res) => {
    res.status(200).json({message: "Utilisateur" });
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



module.exports = router;