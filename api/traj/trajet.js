const express = require('express');
const router = express.Router();
const { redisClient } = require('../../config/config');

// Route pour récupérer les informations de trajet en fonction d'un lieu
router.get('/trajet/:lieu', async (req, res) => {
  const lieu = req.params.lieu;

  try {
    // Récupérer les données de Redis
    const data = await redisClient.get('Trajet');
    if (!data) {
      return res.status(404).json({ message: 'Data not found in Redis' });
    }

    // Convertir les données JSON en objet
    const trajet = JSON.parse(data);

    // Filtrer les trajets par lieu de départ ou d'arrivée
    const filteredTrajet = trajet.trajet.filter(t => t.lieu_depart === lieu || t.lieu_arrivee === lieu);

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