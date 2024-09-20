const express = require('express');
const connexion = require('./config/config');
const port = 3000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({message: "Hello World!" });
});

app.use((req, res, next) => {
  req.connexion = connexion;
  next();
});

app.use("/users", require("./api/users/users"));

app.listen(port, () => {
  console.log(`Server est en ligne ${port}`);
});