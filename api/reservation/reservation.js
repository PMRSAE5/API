const express = require("express");
const { createClient } = require("redis");
const router = express.Router();
const nodemailer = require("nodemailer");
const { sendConfirmationEmail } = require("./mailler");

/**
 * @swagger
 * tags:
 *   name: Reservation
 *   description: Reservation
 */

// Connexion à Redis
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

redisClient.connect().catch(console.error);

redisClient.on("connect", () => console.log("Connecté à Redis"));
redisClient.on("error", (err) => console.error("Erreur Redis :", err));

/**
 * @swagger
 * /reservation/addToRedis:
 *   post:
 *     summary: Add a billet to Redis
 *     tags: [Reservation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               billet:
 *                 type: object
 *                 properties:
 *                   num_reservation:
 *                     type: string
 *                   lieu_depart:
 *                     type: string
 *                   lieu_arrivee:
 *                     type: string
 *     responses:
 *       200:
 *         description: Billet successfully added to Redis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing billet or required fields
 *       500:
 *         description: Internal server error
 */
router.post("/addToRedis", async (req, res) => {
  const { billet, email } = req.body;

  console.log("=== Requête reçue pour ajouter dans Redis ===");
  console.log("Données du billet :", billet);
  console.log("Email cible :", email);

  if (!billet || !email) {
    console.error("Données manquantes : billet ou email.");
    return res
      .status(400)
      .json({ success: false, message: "Billet et email requis." });
  }

  try {
    const billetKey = `billet:${billet.num_reservation}`;
    await redisClient.set(billetKey, JSON.stringify(billet));
    console.log("Billet enregistré dans Redis :", billetKey);

    // Envoi de l'email
    const subject = "Confirmation de réservation";
    const message = `
      Votre réservation pour le trajet ${billet.lieu_depart} - ${billet.lieu_arrivee} a bien été enregistrée.
      Numéro de réservation : ${billet.num_reservation}.
    `;

    await sendConfirmationEmail({ name: billet.name, email, subject, message });
    console.log("E-mail de confirmation envoyé à :", email);

    res.json({
      success: true,
      message: "Billet ajouté à Redis et e-mail envoyé.",
    });
  } catch (error) {
    console.error("Erreur dans la route /addToRedis :", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors du traitement de la réservation.",
      });
  }
});

router.get("/getTickets", async (req, res) => {
  const { name, surname } = req.query;

  if (!name || !surname) {
    return res.status(400).json({
      success: false,
      message: "Le nom et le prénom sont requis.",
    });
  }

  try {
    // Rechercher tous les billets
    const keys = await redisClient.keys("billet:*");

    const billets = [];
    for (const key of keys) {
      const data = await redisClient.get(key);
      const billet = JSON.parse(data);

      if (
        billet.name.toLowerCase() === name.toLowerCase() &&
        billet.surname.toLowerCase() === surname.toLowerCase()
      ) {
        billets.push(billet);
      }
    }

    if (billets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucun billet trouvé pour cet utilisateur.",
      });
    }

    res.status(200).json({
      success: true,
      billets,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des billets :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur.",
    });
  }
});

router.delete("/deleteFromRedis", async (req, res) => {
  console.log("Requête reçue pour suppression :", req.body);

  const { num_reservation } = req.body;

  if (!num_reservation) {
    console.log("Numéro de réservation manquant");
    return res.status(400).json({
      success: false,
      message: "Le numéro de réservation est requis.",
    });
  }

  try {
    const billetKey = `billet:${num_reservation}`;
    const result = await redisClient.del(billetKey);

    console.log("Résultat de suppression Redis :", result);

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucun billet trouvé avec ce numéro de réservation.",
      });
    }

    res.json({
      success: true,
      message: "Billet supprimé de Redis avec succès.",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de Redis :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression du billet.",
    });
  }
});

// Fermer la connexion Redis proprement si nécessaire (optionnel)
process.on("SIGINT", async () => {
  console.log("Fermeture de la connexion Redis...");
  await redisClient.quit();
  process.exit();
});

module.exports = router;
