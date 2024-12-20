const mysql = require('mysql2/promise');
const redis = require('redis');
require('dotenv').config();

// Configuration MySQL
const mysqlConnexion = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configuration Redis
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD
});

redisClient.connect().catch(console.error);

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = {
  mysqlConnexion,
  redisClient
};