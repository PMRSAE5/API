const kafka = require("../../config/kafkaConfig");

const producer = kafka.producer();

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
