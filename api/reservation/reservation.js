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

  try {
    const billetKey = `billet:${billet.num_reservation}`;
    const encodedBillet = Buffer.from(
      JSON.stringify(billet),
      "utf-8"
    ).toString(); // Encodage UTF-8

    // Enregistrement dans Redis
    await redisClient.set(billetKey, encodedBillet);

    res.json({ success: true, message: "Billet ajouté à Redis" });
  } catch (error) {
    console.error("Erreur lors de l'ajout du billet à Redis :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

router.get("/getFromRedis/:num_reservation", async (req, res) => {
  const { num_reservation } = req.params;

  try {
    const billetKey = `billet:${num_reservation}`;
    const rawData = await redisClient.get(billetKey);

    if (!rawData) {
      return res
        .status(404)
        .json({ success: false, message: "Billet non trouvé" });
    }

    const decodedData = JSON.parse(Buffer.from(rawData, "utf-8").toString()); // Décodage UTF-8
    res.json({ success: true, billet: decodedData });
  } catch (error) {
    console.error("Erreur lors de la récupération du billet :", error);
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
