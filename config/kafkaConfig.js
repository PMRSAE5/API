//config/kafkaConfig.js
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "api-service", // Identifiant du service
  brokers: ["localhost:9092"], // Docker Desktop Kafka container
});

module.exports = kafka;

