const express = require('express');
const connexion = require('./config/config');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const port = 3000;

const app = express();

app.use(cors());
app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation with Swagger',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    },
    apis: ['./api/**/*.js'], // Chemin vers vos fichiers d'API
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World!" });
});

app.use((req, res, next) => {
    req.connexion = connexion;
    next();
});

app.use("/users", require("./api/users/users"));
app.use("/acc", require("./api/acc/accompagnateur"));

// Introduce a syntax error
const forceError = () => {
    console.log("This will cause a syntax error"
}

forceError();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});