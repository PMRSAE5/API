const express = require("express");
const mysql = require("mysql2"); // Utilisez mysql2
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import du middleware CORS
require("dotenv").config(); // Charge les variables d'environnement depuis .env
const { driver, mysqlConnexion } = require("./config/config");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*", // Autorise uniquement votre frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes HTTP autorisées
    credentials: true, // Si vous utilisez des cookies ou des headers d'autorisation
  })
);

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

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

// Middleware pour injecter les connexions MongoDB dans chaque requête
app.use((req, res, next) => {
  req.mongoRATP = mongoRATP;
  req.mongoSNCF = mongoSNCF;
  next();
});

// Middleware pour injecter la connexion MySQL et Neo4j dans chaque requête
app.use((req, res, next) => {
  req.mysqlConnexion = mysqlConnexion;
  req.neo4jDriver = driver;
  next();
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
  apis: ["./api/**/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Import des routes
app.use("/users", require("./api/users/users"));
app.use("/acc", require("./api/acc/accompagnateur"));
app.use("/ag", require("./api/ag/agent"));
// app.use("/traj", require("./api/traj/trajet"));
// app.use("/reservation", require("./api/reservation/reservation"));
app.use("/analyse", require("./api/analyse/analyse"));

// Route de base
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});