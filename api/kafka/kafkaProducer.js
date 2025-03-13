//api/kafka/KafkaProducer.js
const kafka = require("../../config/kafkaConfig"); // Importation de la configuration kafka

const producer = kafka.producer();

/**
 * Envoie un message à un topic Kafka (client, agent, notification)
 * @param {string} topic - Le nom du topic (ex: 'client', 'agent', 'notifications')
 * @param {string} message - Le message à envoyer
 */
const sendMessage = async (topic, message) => {
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: message }],
    });
    console.log(`[Kafka] Message envoyé sur ${topic}: ${message}`);
  } catch (error) {
    console.error(`[Kafka] Erreur lors de l'envoi sur ${topic}:`, error);
  } finally {
    await producer.disconnect();
  }
};

module.exports = sendMessage;

