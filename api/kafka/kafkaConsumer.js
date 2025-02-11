const kafka = require("../../config/kafkaConfig");

const consumer = kafka.consumer({ groupId: "api-group" });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`📥 Message reçu sur ${topic}: ${message.value.toString()}`);
    },
  });
};

runConsumer();

module.exports = consumer;
