const express = require('express');
const router = express.Router();
const { redisClient } = require('../../config/config');

// Route pour récupérer les informations de trajet en fonction d'un lieu
router.get('/trajet/:lieu', async (req, res) => {
  const lieu = req.params.lieu;
  console.log(`Received request for lieu: ${lieu}`);

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

    // Filtrer les trajets par lieu
    const filteredTrajets = trajets.filter(trajet => 
      trajet.trajet.some(etape => etape.lieu_depart === lieu || etape.lieu_arrivee === lieu)
    );

    if (filteredTrajets.length === 0) {
      return res.status(404).json({ message: 'No trajets found for the specified lieu' });
    }

    res.status(200).json(filteredTrajets);
  } catch (err) {
    console.error('Error retrieving data from Redis:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
});

module.exports = router;