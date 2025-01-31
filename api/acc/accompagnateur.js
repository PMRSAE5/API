const express = require("express");
const router = express.Router();
const { AddAccompagnateur } = require("./accompagnateurController");

/**
 * @swagger
 * tags:
 *   name: Accompagnateurs
 *   description: Accompagnateur
 */

/**
 * @swagger
 * /acc:
 *   get:
 *     summary: Retrieve a list of accompagnateurs
 *     tags: [Accompagnateurs]
 *     responses:
 *       200:
 *         description: A list of accompagnateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error retrieving data
 */
router.get("/", (req, res) => {
  // Logique pour récupérer les accompagnateurs
  res.status(500).json({ error: "Route accompagnateur" });
});

/**
 * @swagger
 * /accAdd:
 *   post:
 *     summary: Add a new accompagnateur
 *     tags: [Accompagnateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_acc:
 *                 type: string
 *               surname_acc:
 *                 type: string
 *               num_acc:
 *                 type: string
 *               mail_acc:
 *                 type: string
 *     responses:
 *       201:
 *         description: Accompagnateur ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *       500:
 *         description: Erreur lors de l'insertion des données
 */
router.post("/accAdd", (req, res) => {
  const { name_acc, surname_acc, num_acc, mail_acc } = req.body; // Récupération des données
  AddAccompagnateur( // On appelle la méthode AddAccompagnateur dans AccompagnateurController
    req.connexion,
    { name_acc, surname_acc, num_acc, mail_acc }, // On fournit les données à la méthode
    (err, result) => {
      if (err) { // En cas d'erreur
        res
          .status(500)
          .json({ error: "Erreur lors de l'insertion des données" });
        return;
      }
      res // En cas de succès
        .status(201)
        .json({
          message: "Accompagnateur ajouté avec succès",
          id: result.insertId,
        });
    }
  );
});

module.exports = router;
