const express = require('express');
const connexion = require('./config/config');
const cors = require('cors'); // Importer le middleware CORS
const port = 3000;

const app = express();

app.use(cors()); // Utiliser le middleware CORS
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World!" });
});

app.use((req, res, next) => {
    req.connexion = connexion;
    next();
});

app.use("/users", require("./api/users/users"));
app.use("/acc", require("./api/acc/accompagnateur"));

app.listen(port, () => {
    console.log(`Server est en ligne ${port}`);
});