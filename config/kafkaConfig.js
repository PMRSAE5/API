const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "api-service", // Identifiant de ton service
  brokers: ["localhost:9092"], // Assure-toi que Kafka tourne bien ici
});

module.exports = kafka;
