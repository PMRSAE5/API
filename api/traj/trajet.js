const express = require("express");
const router = express.Router();
const { redisClient } = require("../../config/config");
const trajetController = require("./trajetController");

// Route pour récupérer les informations de trajet en fonction d'un lieu
router.get("/trajet/:lieu", async (req, res) => {
  const lieu = req.params.lieu;

  try {
    // Récupérer toutes les sous-clés de 'Trajet'
    const keys = await redisClient.hKeys("Trajet");
    if (keys.length === 0) {
      return res.status(404).json({ message: "No data found in Redis" });
    }

    // Récupérer les données pour chaque sous-clé
    const trajets = await Promise.all(
      keys.map(async (key) => {
        const data = await redisClient.hGet("Trajet", key);
        return JSON.parse(data);
      })
    );

    // Filtrer les trajets par lieu de départ ou d'arrivée
    const filteredTrajet = trajets
      .flatMap((t) => t.trajet)
      .filter((t) => t.lieu_depart === lieu || t.lieu_arrivee === lieu);

    if (filteredTrajet.length === 0) {
      return res
        .status(404)
        .json({ message: "No trajet found for the specified location" });
    }

    res.json(filteredTrajet);
  } catch (error) {
    console.error("Error fetching data from Redis:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/checkReservation", async (req, res) => {
  const { num_reservation, base } = req.body;

  // Log les données reçues pour déboguer
  console.log("Données reçues dans la requête :", { num_reservation, base });

  // Vérification des champs requis
  if (!num_reservation || !base) {
    console.log("Champs manquants :", { num_reservation, base });
    return res
      .status(400)
      .json({ message: "Les champs num_reservation et base sont requis." });
  }

  try {
    const db =
      base.toLowerCase() === "ratp"
        ? req.mongoRATP
        : base.toLowerCase() === "sncf"
        ? req.mongoSNCF
        : null;

    if (!db) {
      console.log("Base de données non valide :", base);
      return res
        .status(400)
        .json({
          message: "Base de données non valide. Utilisez 'RATP' ou 'SNCF'.",
        });
    }

    // Appel au contrôleur avec num_reservation
    const reservation = await trajetController.checkReservation(
      db,
      num_reservation
    );

    if (reservation) {
      console.log("Réservation trouvée :", reservation);
      res.status(200).json({ message: "Réservation trouvée.", reservation });
    } else {
      console.log("Aucune réservation trouvée pour :", {
        num_reservation,
      });
      res.status(404).json({ message: "Aucune réservation trouvée." });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de la réservation :", error);
    res.status(500).json({ message: "Erreur interne du serveur.", error });
  }
});

module.exports = router;
