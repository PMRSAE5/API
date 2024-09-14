const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({message: "Utilisateur" });
});

router.get("/search", (req, res) => {
    req.query.q;
    res.status(200).json({message: "Bonjour" });
});

router.get("/us/:id", (req, res) => {
    req.params.id;
    res.status(200).json({
        id: req.params.id,
    });
});

module.exports = router;