const mysql = require("mysql2/promise");
require("dotenv").config();
const neo4j = require('neo4j-driver');

const mysqlConnexion = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const driver = neo4j.driver(
  'neo4j://localhost',
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

module.exports = {
  mysqlConnexion,
  driver
};