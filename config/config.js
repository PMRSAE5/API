const mysql = require("mysql");
require("dotenv").config();

const connexion = mysql.createConnection({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connecte la base de données
connexion.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  } else {
    console.log("Connecté à la base de données !");
  }
});

module.exports = connexion;
