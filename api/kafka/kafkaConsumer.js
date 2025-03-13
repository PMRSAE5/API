//api/kafka/KafkaConsumer.js
const kafka = require("../../config/kafkaConfig");
const Redis = require("ioredis");
const mysql = require("mysql2/promise");

// Connexion Redis
const redis = new Redis(6379, "localhost");

// Connexion MySQL
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "pmove",
  port: 8889, // MAMP / Docker Desktop port // 3306
};

// Kafka Consumer
const consumer = kafka.consumer({ groupId: "api-group" });

/**
 * Consommateur Kafka pour écouter les topics (clients, agents) et stocker
 */
const runConsumer = async (topic) => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log(`[Kafka] Message reçu sur ${topic}: ${value}`);

      // Envoi Redis (canal = topic)
      await redis.publish(topic, value);
      console.log(`[Redis] Publié sur le canal ${topic}`);

      // Traitement MySQL
      const connection = await mysql.createConnection(dbConfig);

      if (topic === "client") {
        const [name, surname, num, mail, handicap, civilite, birth, password, contact_mail, contact_num, note] = value.split(";");
        try {
          await connection.execute(
            `INSERT INTO Client (name, surname, num, mail, handicap, civilite, birth, password, contact_mail, contact_num, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, surname, num, mail, handicap, civilite, birth, password, contact_mail, contact_num, note]
          );
          console.log(`[MySQL] Client inséré avec succès`);
        } catch (error) {
          console.error(`[MySQL] Erreur insertion client :`, error.message);
        }
      } else if (topic === "agent") {
        const [id, name, surname, password] = value.split(";");
        try {
          await connection.execute(
            `INSERT INTO Agent (ID_Agent, name, surname, password) VALUES (?, ?, ?, ?)`,
            [id, name, surname, password]
          );
          console.log(`[MySQL] Agent inséré avec succès`);
        } catch (error) {
          console.error(`[MySQL] Erreur insertion agent :`, error.message);
        }
      } else {
        console.log(`[Kafka] Topic non pris en charge : ${topic}`);
      }

      await connection.end();
    },
  });
};

module.exports = { runConsumer };

