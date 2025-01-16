const express = require("express");
const redis = require("redis");
const router = express.Router();

// Connexion à Redis
const redisClient = redis.createClient({
  url: "redis://172.20.10.11:6379",
  password: "kaka",
});

redisClient.connect().catch(console.error);

redisClient.on("connect", () => console.log("Connecté à Redis"));
redisClient.on("error", (err) => console.error("Erreur Redis :", err));

// Route pour ajouter le billet à Redis
router.post("/addToRedis", async (req, res) => {
  const { billet } = req.body;

  if (!billet) {
    return res
      .status(400)
      .json({ success: false, message: "Aucun billet fourni" });
  }

  // Vérifier les champs obligatoires du billet
  const requiredFields = ["num_reservation", "lieu_depart", "lieu_arrivee"];
  const missingFields = requiredFields.filter((field) => !billet[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Champs manquants : ${missingFields.join(", ")}`,
    });
  }

  try {
    const billetKey = `billet:${billet.num_reservation}`;

    // Convertir en JSON et enregistrer dans Redis
    await redisClient.set(billetKey, JSON.stringify(billet));

    res.json({ success: true, message: "Billet ajouté à Redis" });
  } catch (error) {
    console.error("Erreur lors de l'ajout du billet à Redis :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Fermer la connexion Redis proprement si nécessaire (optionnel)
process.on("SIGINT", async () => {
  console.log("Fermeture de la connexion Redis...");
  await redisClient.quit();
  process.exit();
});

module.exports = router;
