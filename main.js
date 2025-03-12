// main.js
const express = require("express");
const mysql = require("mysql2"); // Utilisez mysql2
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import du middleware CORS
require("dotenv").config(); // Charge les variables d'environnement depuis .env
const { createClient } = require("redis");
const sendMessage = require("./api/kafka/kafkaProducer");

const app = express();
const port = process.env.PORT || 3000;

// Middleware et configuration de l'application
app.use(express.json());
app.use(
  cors({
    origin: "*", // Autorise uniquement votre frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes HTTP autorisées
    credentials: true, // Si vous utilisez des cookies ou des headers d'autorisation
  })
);
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// Vérification du token API
const checkApiToken = (req, res, next) => {
  const token = req.headers["x-api-token"];
  console.log("Token reçu:", token);
  if (token && token === process.env.TEAM_API_TOKEN) {
    next();
  } else {
    console.log("Token invalide ou manquant");
    res.status(403).json({ message: "Forbidden: Invalid Token" });
  }
};

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocs);
});

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
    console.error("Erreur de connexion à la base de données MySQL:", err);
  } else {
    console.log("🗄️ ✅ Connecté à la base de données MySQL");
  }
});

// Middleware pour ajouter la connexion MySQL à chaque requête
app.use((req, res, next) => {
  req.connexion = db;
  next();
});

// Connexions à MongoDB
const mongoRATP = mongoose.createConnection(process.env.MONGO_URI_RATP, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mongoSNCF = mongoose.createConnection(process.env.MONGO_URI_SNCF, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mongoAirFrance = mongoose.createConnection(process.env.MONGO_URI_AIRFRANCE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoRATP.on("connected", () => {
  console.log("🛤️ ✅ Connecté à MongoDB (RATP)");
});
mongoRATP.on("error", (err) => {
  console.error("Erreur de connexion à MongoDB (RATP) :", err);
});
mongoSNCF.on("connected", () => {
  console.log("🚆✅ Connecté à MongoDB (SNCF)");
});
mongoSNCF.on("error", (err) => {
  console.error("Erreur de connexion à MongoDB (SNCF) :", err);
});
mongoAirFrance.on("connected", () => {
  console.log("✈️ ✅ Connecté à MongoDB (AirFrance)");
});
mongoAirFrance.on("error", (err) => {
  console.error("Erreur de connexion à MongoDB (AirFrance) :", err);
});

// Middleware pour injecter les connexions MongoDB dans chaque requête
app.use((req, res, next) => {
  req.mongoRATP = mongoRATP;
  req.mongoSNCF = mongoSNCF;
  req.mongoAirFrance = mongoAirFrance;
  next();
});

// Configuration Redis
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});
redisClient.connect().catch(console.error);
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Configuration de Swagger
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

// Routes avec vérification du token
app.use("/api", checkApiToken);

// Import des routes
app.use("/users", require("./api/users/users"));
app.use("/acc", require("./api/acc/accompagnateur"));
app.use("/ag", require("./api/ag/agent"));
app.use("/traj", require("./api/traj/trajet"));
app.use("/reservation", require("./api/reservation/reservation"));

// Route d'envoi de message Kafka
app.post("/send", async (req, res) => {
  const { topic, message } = req.body;
  await sendMessage(topic, message);
  res.json({ success: true, message: `Message envoyé à ${topic}` });
});

// Route racine
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Démarrage du serveur
if (process.env.NODE_ENV !== "test") {
  // Démarrage classique du serveur
  // On démarre d'abord sur le port 3001 puis sur le port défini dans l'env via Redis si disponible
  app.listen(3001, () => console.log("🚀 API en écoute sur le port 3001"));
  redisClient.on("ready", () => {
    console.log("🔄 Redis client connected");
    app.listen(port, () => {
      console.log(`🌍 Server is running on http://localhost:${port}`);
    });
  });
}

module.exports = { app, db };

