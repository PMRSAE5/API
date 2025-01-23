const express = require('express');
const router = express.Router();
const { getAgentByName, comparePassword, GetIdAgentByName } = require('./agentController');

/**
 * @swagger
 * tags:
 *   name: Agent
 *   description: Agent management
 */

/**
 * @swagger
 * /agent:
 *   get:
 *     summary: Retrieve a message for agents
 *     tags: [Agent]
 *     responses:
 *       200:
 *         description: A message for agents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/", (req, res) => {
    res.status(200).json({ message: "Agent" });
});


/**
 * @swagger
 * /agent/login:
 *   post:
 *     summary: Log in an agent
 *     tags: [Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agent successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 agent:
 *                   type: object
 *       401:
 *         description: Invalid name or password
 *       500:
 *         description: Internal server error
 */
router.post("/login", async (req, res) => {
    console.log("Login request received:", req.body);
    const { name, password } = req.body; // On récupère le nom et le mot de passe de l'agent

    try {
        // On vérifie si l'agent existe
        const rows = await getAgentByName(req.connexion, name);
        if (rows.length === 0) {
            console.log("Agent not found");
            return res.status(401).json({ message: "Nom ou mot de passe invalide" }); // On renvoie une erreur si l'agent n'existe pas
        }

        const agent = rows[0];
        console.log("Agent found:", agent);

        const isPasswordValid = comparePassword(password, agent.password); // On compare le mot de passe fourni avec le mot de passe de l'agent
        if (!isPasswordValid) { // Si le mot de passe est invalide
            console.log("Invalid password");
            return res.status(401).json({ message: "Nom ou mot de passe invalide" });
        }

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /agent/agentId/{name}:
 *   get:
 *     summary: Retrieve agent ID by name
 *     tags: [Agent]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The agent's name
 *     responses:
 *       200:
 *         description: Agent ID retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Error retrieving data
 */
router.get("/agentId/:name", (req, res) => {
    const { name } = req.params; // On récupère le nom de l'agent
    GetIdAgentByName(req.connexion, name, (err, rows) => { // On récupère l'ID de l'agent par le nom
        if (err) {
            res.status(500).json({ error: "Erreur lors de la récupération des données" });
            return;
        }
        res.status(200).json(rows);
    });
});

module.exports = router;