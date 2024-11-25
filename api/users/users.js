const express = require('express');
const router = express.Router();
const UsersController = require('./usersController');

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
            res.status(500).json({ error: 'Erreur lors de la récupération des données' });
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
            res.status(500).json({ error: 'Erreur lors de la récupération des données' });
            return;
        }
        res.status(200).json(rows);
    });
});

module.exports = router;