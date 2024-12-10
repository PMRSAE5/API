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

router.post("/userAdd", (req, res) => {
  console.log("Requête reçue :", req.body);

  UsersController.AddClient(req.body, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout :", err);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'ajout du client" });
    }
    res.status(201).json({ message: "Client ajouté avec succès !" });
  });
});

router.post("/userLog", (req, res) => {
  try {
    console.log("Données reçues :", req.body); // Debug

    // Extraction des champs depuis req.body
    const { mail, password } = req.body;

    // Vérification de la présence des données requises
    if (!mail || !password) {
      return res
        .status(400)
        .json({ error: "Veuillez fournir un email et un mot de passe." });
    }

    // Appel à la méthode LoginUser du contrôleur
    UsersController.LoginUser(
      req.connexion,
      { mail, password },
      (err, results) => {
        if (err) {
          console.error("Erreur lors de la connexion :", err);
          return res.status(500).json({
            error: "Erreur interne lors de la tentative de connexion.",
          });
        }

        // Vérifie si l'utilisateur est trouvé
        if (!results || results.length === 0) {
          return res
            .status(401)
            .json({ error: "Email ou mot de passe incorrect." });
        }

        // Connexion réussie
        const user = results[0]; // Premier utilisateur trouvé
        return res.status(200).json({ message: "Connexion réussie", user });
      }
    );
  } catch (error) {
    console.error("Erreur inattendue :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err);
      return res.status(500).json({ error: "Erreur lors de la déconnexion." });
    }

    res.clearCookie("connect.sid"); // Supprime le cookie de session
    return res.status(200).json({ message: "Déconnexion réussie." });
  });
});

module.exports = router;
