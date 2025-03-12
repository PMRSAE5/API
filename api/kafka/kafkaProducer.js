const kafka = require("../../config/kafkaConfig");

const producer = kafka.producer();

/**
 * Envoie un message à un topic Kafka
 * @param {string} topic - Le nom du topic
 * @param {string} message - Le message à envoyer
 */
const sendMessage = async (topic, message) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: message }],
  });
  console.log(`📨 Message envoyé sur ${topic}: ${message}`);
  await producer.disconnect();
};

module.exports = sendMessage;
