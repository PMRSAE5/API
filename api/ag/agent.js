const express = require('express');
const router = express.Router();
const { getAgentByName, comparePassword } = require('./agentController');

router.get("/", (req, res) => {
    res.status(200).json({ message: "Agent" });
});

router.post("/login", async (req, res) => {
    const { name, password } = req.body;

    try {
        console.log(`Received login request for name: ${name}`);

        const rows = await getAgentByName(name);
        if (rows.length === 0) {
            console.log('No agent found with the given name');
            return res.status(401).json({ message: "Nom ou mot de passe invalide" });
        }

        const agent = rows[0];
        console.log(`Agent found: ${JSON.stringify(agent)}`);

        const isPasswordValid = comparePassword(password, agent.password);
        console.log(`Password comparison result: ${isPasswordValid}`);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Nom ou mot de passe invalide" });
        }

        res.status(200).json({ message: "Connexion réussie", agent });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
});

module.exports = router;