const express = require('express');
const mysql = require("mysql2"); // Utilisez mysql2
const { createClient } = require("redis");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import du middleware CORS
require("dotenv").config(); // Charge les variables d'environnement depuis .env;

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*", // Autorise uniquement votre frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes HTTP autorisées
    credentials: true, // Si vous utilisez des cookies ou des headers d'autorisation
  })
);
// Middleware pour parser le corps des requêtes HTTP
app.use(express.json());

<<<<<<< HEAD
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});
=======
// Connexion à MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données MySQL:', err);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

// Middleware pour ajouter la connexion MySQL à chaque requête
app.use((req, res, next) => {
  req.connexion = db; // Ajout de la connexion MySQL dans l'objet `req`
  next();
});

>>>>>>> facd9164fb03adcfb8fd85a4542483f13bcdddff
// Connexion à MongoDB RATP
const mongoRATP = mongoose.createConnection(process.env.MONGO_URI_RATP, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoRATP.on("connected", () => {
  console.log("Connecté à MongoDB (RATP)");
});

mongoRATP.on("error", (err) => {
  console.error("Erreur de connexion à MongoDB (RATP) :", err);
});

// Connexion à MongoDB SNCF
const mongoSNCF = mongoose.createConnection(process.env.MONGO_URI_SNCF, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoSNCF.on("connected", () => {
  console.log("Connecté à MongoDB (SNCF)");
});

mongoSNCF.on("error", (err) => {
  console.error("Erreur de connexion à MongoDB (SNCF) :", err);
});

<<<<<<< HEAD
// Middleware pour injecter les connexions MongoDB dans chaque requête
app.use((req, res, next) => {
  req.mongoRATP = mongoRATP;
  req.mongoSNCF = mongoSNCF;
  next();
});

// Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pmove",
});

// Connexion à la base de données MySQL
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err);
    return;
  }
  console.log("Connecté à la base de données MySQL");

  console.error("Erreur de connexion à la base de données:", err);
  return;
}, console.log("Connecté à la base de données MySQL"));

// Configuration Redis
const redisClient = createClient({
  url: "redis://172.20.10.11:6379",
  password: "kaka",
});

redisClient.connect().catch(console.error);

redisClient.on("error", (err) => {
  console.error("Redis error:", err);

  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });
});

=======
// Configuration de Swagger
>>>>>>> facd9164fb03adcfb8fd85a4542483f13bcdddff
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation with Swagger",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./api/**/*.js"], // Chemin vers vos fichiers d'API
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Import des routes
app.use("/users", require("./api/users/users")); // Routes pour les utilisateurs
app.use("/acc", require("./api/acc/accompagnateur"));
app.use("/ag", require("./api/ag/agent"));
app.use("/traj", require("./api/traj/trajet")); // Ajoutez cette ligne pour inclure la nouvelle route
<<<<<<< HEAD
app.use("/reservation", require("./api/reservation/reservation"));

// Ajoutez cette route pour la racine
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Démarrage du serveur après la connexion à Redis
redisClient.on("ready", () => {
  console.log("Redis client connected");
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
=======


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
>>>>>>> facd9164fb03adcfb8fd85a4542483f13bcdddff
