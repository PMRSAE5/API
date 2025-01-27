// const express = require("express");
// const { createClient } = require("redis");
// const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   name: Reservation
//  *   description: Reservation
//  */

// // Connexion à Redis
// const redisClient = createClient({
//   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//   password: process.env.REDIS_PASSWORD,
// });

// redisClient.connect().catch(console.error);

// redisClient.on("connect", () => console.log("Connecté à Redis"));
// redisClient.on("error", (err) => console.error("Erreur Redis :", err));

// /**
//  * @swagger
//  * /reservation/addToRedis:
//  *   post:
//  *     summary: Add a billet to Redis
//  *     tags: [Reservation]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               billet:
//  *                 type: object
//  *                 properties:
//  *                   num_reservation:
//  *                     type: string
//  *                   lieu_depart:
//  *                     type: string
//  *                   lieu_arrivee:
//  *                     type: string
//  *     responses:
//  *       200:
//  *         description: Billet successfully added to Redis
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 message:
//  *                   type: string
//  *       400:
//  *         description: Missing billet or required fields
//  *       500:
//  *         description: Internal server error
//  */
// router.post("/addToRedis", async (req, res) => {
//   const { billet } = req.body;

//   if (!billet) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Aucun billet fourni" });
//   }

//   try {
//     const billetKey = `billet:${billet.num_reservation}`;
//     const encodedBillet = Buffer.from(
//       JSON.stringify(billet),
//       "utf-8"
//     ).toString(); // Encodage UTF-8

//     // Enregistrement dans Redis
//     await redisClient.set(billetKey, encodedBillet);

//     res.json({ success: true, message: "Billet ajouté à Redis" });
//   } catch (error) {
//     console.error("Erreur lors de l'ajout du billet à Redis :", error);
//     res.status(500).json({ success: false, message: "Erreur serveur" });
//   }
// });

// router.get("/getTickets", async (req, res) => {
//   const { name, surname } = req.query;

//   if (!name || !surname) {
//     return res.status(400).json({
//       success: false,
//       message: "Le nom et le prénom sont requis.",
//     });
//   }

//   try {
//     // Rechercher tous les billets
//     const keys = await redisClient.keys("billet:*");

//     const billets = [];s
//     for (const key of keys) {
//       const data = await redisClient.get(key);
//       const billet = JSON.parse(data);

//       if (
//         billet.name.toLowerCase() === name.toLowerCase() &&
//         billet.surname.toLowerCase() === surname.toLowerCase()
//       ) {
//         billets.push(billet);
//       }
//     }

//     if (billets.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Aucun billet trouvé pour cet utilisateur.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       billets,
//     });
//   } catch (error) {
//     console.error("Erreur lors de la récupération des billets :", error);
//     res.status(500).json({
//       success: false,
//       message: "Erreur serveur.",
//     });
//   }
// });

// // Fermer la connexion Redis proprement si nécessaire (optionnel)
// process.on("SIGINT", async () => {
//   console.log("Fermeture de la connexion Redis...");
//   await redisClient.quit();
//   process.exit();
// });

// module.exports = router;
