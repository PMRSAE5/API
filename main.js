const express = require("express");
require('dotenv').config();
const connexion = require("./config/config");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const session = require("express-session"); // Ajout de la gestion de sessions
const port = 3000;

const app = express();

// Middleware pour CORS et JSON
app.use(cors({ origin: "http://localhost:3001", credentials: true })); // Autorise le client React
app.use(express.json());

// Configuration des sessions
app.use(
  session({
    secret: "123456789", // Remplacez par une clé sécurisée
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Passez `true` en production avec HTTPS
  })
);

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
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

// Middleware pour ajouter la connexion MySQL à chaque requête
app.use((req, res, next) => {
  req.connexion = connexion; // Ajout de la connexion MySQL dans l'objet `req`
  next();
});

// Import des routes
app.use("/users", require("./api/users/users")); // Routes pour les utilisateurs
app.use("/acc", require("./api/acc/accompagnateur"));

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});