exports.checkReservation = async (db, num_reservation) => {
  try {
    // Convertir num_reservation en entier
    const reservationNumber = parseInt(num_reservation, 10);

    // Vérifie si la conversion est valide
    if (isNaN(reservationNumber)) {
      throw new Error("Le numéro de réservation doit être un entier.");
    }

    // Recherche dans la collection "Reservation"
    const collection = db.collection("Reservation");

    // Log pour déboguer les paramètres de la recherche
    console.log("Recherche MongoDB avec :", {
      num_reservation: reservationNumber,
    });

    const reservation = await collection.findOne({
      num_reservation: reservationNumber, // Utilise le numéro converti
    });

    // Log le résultat de la recherche
    console.log("Résultat de la recherche :", reservation);

    return reservation;
  } catch (error) {
    console.error("Erreur lors de la recherche MongoDB :", error);
    throw error;
  }
};
