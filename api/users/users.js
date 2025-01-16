const express = require("express");
const router = express.Router();
const UsersController = require("./usersController");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a message for users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A message for users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/", (req, res) => {
  res.status(200).json({ message: "Utilisateur" });
});

/**
 * @swagger
 * /users/userId/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Error retrieving data
 */
router.get("/userId/:id", (req, res) => {
  const { id } = req.params;
  UsersController.GetClientById(req.connexion, { id }, (err, rows) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des données" });
      return;
    }
    res.status(200).json(rows);
  });
});

/**
 * @swagger
 * /users/userMail/{mail}:
 *   get:
 *     summary: Retrieve a user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: mail
 *         required: true
 *         schema:
 *           type: string
 *         description: The user email
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Error retrieving data
 */
router.get("/userMail/:mail", (req, res) => {
  const { mail } = req.params;
  UsersController.GetClientByMail(req.connexion, { mail }, (err, rows) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des données" });
      return;
    }
    res.status(200).json(rows);
  });
});

/**
 * @swagger
 * /users/userAdd:
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error adding user
 */
router.post("/userAdd", (req, res) => {
  console.log("Requête reçue :", req.body);

  UsersController.AddClient(req.connexion, req.body, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout :", err);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'ajout du client" });
    }
    res.status(201).json({ message: "Client ajouté avec succès !" });
  });
});

router.put("/update", (req, res) => {
  const updatedData = req.body;

  if (!updatedData.ID_Client) {
    return res.status(400).json({
      success: false,
      message: "ID_Client est requis.",
    });
  }

  UsersController.UpdateClient(req.connexion, updatedData, (err, result) => {
    if (err) {
      console.error("Erreur lors de la mise à jour :", err);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour avec succès.",
    });
  });
});

router.post("/userLog", (req, res) => {
  const { mail, password } = req.body;

  UsersController.LoginUser(
    req.connexion,
    { mail, password },
    (err, results) => {
      if (err) {
        console.error("Erreur SQL :", err);
        return res
          .status(500)
          .json({ error: "Erreur interne lors de la connexion." });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Utilisateur non trouvé." });
      }

      const user = results[0];
      console.log("Utilisateur trouvé :", user);
      return res.status(200).json({ message: "Connexion réussie", user });
    }
  );
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err);
      return res.status(500).json({ error: "Erreur lors de la déconnexion." });
    }

    res.clearCookie("connect.sid"); // Supprime le cookie de session (si utilisé)
    return res.status(200).json({ message: "Déconnexion réussie." });
  });
});

router.get("/me", (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Utilisateur non connecté" });
  }
});

router.get("/test", (req, res) => {
  res.status(200).json({ message: "Connexion API OK" });
});

router.get("/userId/:id", (req, res) => {
  const { id } = req.params;
  console.log("Requête pour ID_Client :", id);

  UsersController.GetClientById(req.connexion, { id }, (err, rows) => {
    if (err) {
      console.error("Erreur dans GetClientById :", err);
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération des données." });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }
    res.status(200).json(rows);
  });
}); // Connexion à votre base de données MySQL

// Endpoint pour récupérer le profil utilisateur
router.get("/profile", (req, res) => {
  const userId = req.session.userID; // Récupère l'ID de l'utilisateur depuis la session
  if (!userId) {
    return res.status(401).json({ error: "Utilisateur non connecté." });
  }

  const query = "SELECT * FROM clients WHERE ID_Client = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération du profil :", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Retourne les données utilisateur
    res.json(results[0]);
  });
});

module.exports = router;
