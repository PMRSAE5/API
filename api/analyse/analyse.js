const express = require("express");
const router = express.Router();

router.get("/Neo4j", async (req, res) => {
  const { mongoRATP, mongoSNCF, mysqlConnexion, neo4jDriver } = req;

  try {
    // Récupérer les tickets de RATP et SNCF
    const ratpTickets = await mongoRATP.collection("Reservation").find().toArray();
    const sncfTickets = await mongoSNCF.collection("Reservation").find().toArray();
    console.log("RATP Tickets:", ratpTickets);
    console.log("SNCF Tickets:", sncfTickets);

    // Récupérer les clients de MySQL
    const [clients] = await mysqlConnexion.query("SELECT * FROM Client");

    // Connexion à Neo4j
    const session = neo4jDriver.session();

    // Envoyer les données à Neo4j
    for (const ticket of [...ratpTickets, ...sncfTickets]) {
      await session.run(
        `MERGE (t:Ticket {id: $id, num_mm: $num_mm, num_reservation: $num_reservation, lieu_depart: $lieu_depart, heure_depart: $heure_depart, lieu_arrivee: $lieu_arrivee, heure_arrivee: $heure_arrivee})`,
        {
          id: ticket._id?.toString() || "",
          num_mm: ticket.num_mm?.toString() || "",
          num_reservation: ticket.num_reservation?.toString() || "",
          lieu_depart: ticket.lieu_depart || "",
          heure_depart: ticket.heure_depart || "",
          lieu_arrivee: ticket.lieu_arrivee || "",
          heure_arrivee: ticket.heure_arrivee || "",
        }
      );
    }

    // Envoyer les clients dans Neo4j
    for (const client of clients) {
      await session.run(
        `MERGE (c:Client {id: $id, name: $name, surname: $surname, num: $num, mail: $mail, handicap: $handicap, civilite: $civilite, birth: $birth, contact_mail: $contact_mail, contact_num: $contact_num, note: $note})`,
        {
          id: client.ID_Client?.toString() || "",
          name: client.name || "",
          surname: client.surname || "",
          num: client.num?.toString() || "",
          mail: client.mail || "",
          handicap: client.handicap?.toString() || "",
          civilite: client.civilite?.toString() || "",
          birth: client.birth?.toISOString() || "",
          contact_mail: client.contact_mail || "",
          contact_num: client.contact_num?.toString() || "",
          note: client.note || "",
        }
      );
    }

    // Créer des relations entre les clients et les tickets
    for (const ticket of [...ratpTickets, ...sncfTickets]) {
      const client = clients.find(c => c.num === ticket.num_mm);
      if (client) {
        await session.run(
          `MATCH (c:Client {id: $clientId}), (t:Ticket {id: $ticketId})
           MERGE (c)-[:BOOKED]->(t)`,
          {
            clientId: client.ID_Client?.toString() || "",
            ticketId: ticket._id?.toString() || "",
          }
        );
      }
    }

    await session.close();
    res.status(200).json({ message: "Données envoyées à Neo4j avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'envoi des données à Neo4j :", error);
    res.status(500).json({ error: "Erreur lors de l'envoi des données à Neo4j" });
  }
});

router.get("/preferences/:clientId", async (req, res) => {
    const { neo4jDriver } = req;
    const clientId = req.params.clientId;
  
    try {
      const session = neo4jDriver.session();
  
      // Requête pour obtenir les lieux les plus visités par un client
      const result = await session.run(
        `MATCH (c:Client {id: $clientId})-[:BOOKED]->(t:Ticket)
         RETURN t.lieu_depart AS lieu, COUNT(t) AS count
         ORDER BY count DESC
         LIMIT 10`,
        { clientId: clientId.toString() }
      );
  
      const preferences = result.records.map(record => ({
        lieu: record.get('lieu'),
        nbr: record.get('count').toInt()
      }));
  
      await session.close();
      res.status(200).json({ preferences });
    } catch (error) {
      console.error("Erreur lors de l'analyse des préférences :", error);
      res.status(500).json({ error: "Erreur lors de l'analyse des préférences" });
    }
  });

module.exports = router;