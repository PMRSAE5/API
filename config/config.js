const mysql = require("mysql");

// Charger les variables d'environnement
require('dotenv').config();

const connexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  authPlugins: {
    mysql_native_password: () => () => Buffer.from(process.env.DB_PASSWORD)
  }
});

// Connecte la base de données
connexion.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  } else {
    if (process.env.NODE_ENV !== "test") {
      console.log("Connecté à la base de données !");
    }
  }
});

module.exports = connexion;