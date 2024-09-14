const mysql = require('mysql');

const connexion = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pmove'
});

module.exports = connexion;