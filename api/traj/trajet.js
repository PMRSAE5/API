const express = require('express');
const router = express.Router();
const { redisClient } = require('../../config/config');

// Route pour récupérer les informations de trajet en fonction d'un lieu
router.get('/trajet/:lieu', async (req, res) => {
  const lieu = req.params.lieu;

  try {
    // Récupérer toutes les sous-clés de 'Trajet'
    const keys = await redisClient.hKeys('Trajet');
    if (keys.length === 0) {
      return res.status(404).json({ message: 'No data found in Redis' });
    }

    // Récupérer les données pour chaque sous-clé
    const trajets = await Promise.all(keys.map(async (key) => {
      const data = await redisClient.hGet('Trajet', key);
      return JSON.parse(data);
    }));

    // Filtrer les trajets par lieu de départ ou d'arrivée
    const filteredTrajet = trajets.flatMap(t => t.trajet).filter(t => t.lieu_depart === lieu || t.lieu_arrivee === lieu);

    if (filteredTrajet.length === 0) {
      return res.status(404).json({ message: 'No trajet found for the specified location' });
    }

    res.json(filteredTrajet);
  } catch (error) {
    console.error('Error fetching data from Redis:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;