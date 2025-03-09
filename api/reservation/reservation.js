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
    console.log("✅ Billet enregistré dans Redis :", billetKey);

    // Envoi de l'email
    const subject = "Confirmation de réservation";
    const message = `
      Votre réservation pour le trajet ${billet.lieu_depart} - ${billet.lieu_arrivee} a bien été enregistrée.
      Numéro de réservation : ${billet.num_reservation}.
    `;

    try {
      await sendConfirmationEmail({
        name: billet.name,
        email,
        subject,
        message,
      });
      console.log("📧 E-mail de confirmation envoyé à :", email);
    } catch (emailError) {
      console.error(
        "⚠️ Erreur lors de l'envoi de l'email :",
        emailError.message
      );
      return res.json({
        success: true,
        message:
          "Billet ajouté à Redis mais erreur lors de l'envoi de l'email.",
      });
    }

    res.json({
      success: true,
      message: "Billet ajouté à Redis et e-mail envoyé.",
    });
  } catch (error) {
    console.error("🚨 Erreur dans la route /addToRedis :", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du traitement de la réservation.",
    });
  }
});

/**
 * @swagger
 * /getTickets:
 *   get:
 *     summary: Récupérer les billets d'un utilisateur
 *     tags: [Reservation]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom de l'utilisateur
 *       - in: query
 *         name: surname
 *         required: true
 *         schema:
 *           type: string
 *         description: Prénom de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des billets de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 billets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       surname:
 *                         type: string
 *                       otherProperties:
 *                         type: string
 *       400:
 *         description: Nom et prénom requis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Le nom et le prénom sont requis.
 *       404:
 *         description: Aucun billet trouvé pour cet utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Aucun billet trouvé pour cet utilisateur.
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Erreur serveur.
 */

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

/**
 * @swagger
 * /deleteFromRedis:
 *   delete:
 *     summary: Supprimer un billet de Redis
 *     tags: [Reservation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               num_reservation:
 *                 type: string
 *                 description: Numéro de réservation du billet
 *     responses:
 *       200:
 *         description: Billet supprimé de Redis avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Billet supprimé de Redis avec succès.
 *       400:
 *         description: Numéro de réservation manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Le numéro de réservation est requis.
 *       404:
 *         description: Aucun billet trouvé avec ce numéro de réservation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Aucun billet trouvé avec ce numéro de réservation.
 *       500:
 *         description: Erreur serveur lors de la suppression du billet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Erreur serveur lors de la suppression du billet.
 */

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

/**
 * @swagger
 * /reservation/getByPoint:
 *   get:
 *     summary: Récupère les réservations pour un point de récupération donné
 *     tags: [Reservation]
 *     parameters:
 *       - in: query
 *         name: pmr_point_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du point de récupération (gare ou aéroport)
 *     responses:
 *       200:
 *         description: Liste des réservations pour le point de récupération
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   client_name:
 *                     type: string
 *                   client_surname:
 *                     type: string
 *                   client_phone:
 *                     type: string
 *                   handicap_type:
 *                     type: string
 *                   baggage_count:
 *                     type: number
 *                   trajet:
 *                     type: object
 *                     properties:
 *                       point:
 *                         type: string
 *                       heure:
 *                         type: string
 *       400:
 *         description: Paramètre manquant
 *       500:
 *         description: Erreur serveur
 */
router.get("/getByPoint", async (req, res) => {
  const { pmr_point_id } = req.query;

  if (!pmr_point_id) {
    return res
      .status(400)
      .json({ success: false, message: "Paramètre pmr_point_id manquant." });
  }

  try {
    console.log("Paramètre pmr_point_id reçu :", pmr_point_id); // Log du paramètre reçu

    const keys = await redisClient.keys("billet:*");
    console.log("Clés Redis trouvées :", keys); // Log des clés Redis

    const reservations = [];

    for (const key of keys) {
      const data = await redisClient.get(key);
      const billet = JSON.parse(data);

      console.log("Données Redis pour la clé", key, ":", billet); // Log des données Redis

      // Normalisation des données pour la comparaison
      if (
        billet.lieu_depart.trim().toLowerCase() ===
        pmr_point_id.trim().toLowerCase()
      ) {
        reservations.push({
          id: billet.num_reservation,
          client_name: billet.name,
          client_surname: billet.surname,
          client_phone: billet.phone,
          handicap_type: billet.handicap_type,
          baggage_count: billet.numBags,
          trajet: {
            point: billet.lieu_depart,
            heure: billet.heure_depart,
          },
        });
      }
    }

    console.log("Réservations filtrées :", reservations); // Log des réservations filtrées

    if (reservations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucune réservation trouvée pour ce point.",
      });
    }

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations :", error);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

router.get("/getById", async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Paramètre id manquant." });
  }

  try {
    // Rechercher le billet correspondant dans Redis
    const billetKey = `billet:${id}`;
    const data = await redisClient.get(billetKey);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Aucune réservation trouvée pour cet ID.",
      });
    }

    const billet = JSON.parse(data); // Convertir les données en objet JSON
    res.status(200).json({
      success: true,
      reservation: billet,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la réservation :", error);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// Fermer la connexion Redis proprement si nécessaire (optionnel)
process.on("SIGINT", async () => {
  console.log("Fermeture de la connexion Redis...");
  await redisClient.quit();
  process.exit();
});

module.exports = router;
