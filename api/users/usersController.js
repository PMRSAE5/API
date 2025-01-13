const connexion = require("../../config/config");

// Rechercher un client par ID
const GetClientById = (connexion, { id }, callback) => {
  const query = "SELECT * FROM Client WHERE ID_Client = ?";
  connexion.query(query, [id], callback);
};

// Rechercher un client par email
const GetClientByMail = (connexion, { mail }, callback) => {
  const query = "SELECT * FROM Client WHERE mail = ?";
  connexion.query(query, [mail], callback);
};

// Ajouter un nouveau client
const AddClient = (
  connexion,
  {
    name,
    surname,
    num,
    mail,
    handicap,
    civilite,
    birth,
    password,
    contact_mail,
    contact_num,
    note,
  },
  callback
) => {
  const query = `
    INSERT INTO Client (name, surname, num, mail, handicap, civilite, birth, password, contact_mail, contact_num, note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    name,
    surname,
    num,
    mail,
    handicap,
    civilite,
    birth,
    password,
    contact_mail,
    contact_num,
    note,
  ];

  // Utilisation correcte de connexion
  connexion.query(query, values, callback);
};

const LoginUser = (connexion, { mail, password }, callback) => {
  const query = "SELECT * FROM client WHERE mail = ? AND password = ?";
  console.log("Requête SQL exécutée :", query);
  console.log("Paramètres SQL :", [mail, password]);

  connexion.query(query, [mail, password], (err, results) => {
    if (err) {
      console.error("Erreur dans la requête SQL :", err);
      return callback(err, null);
    }

    // Log des résultats de la requête SQL
    console.log("Résultats de la requête SQL :", results);

    callback(null, results);
  });
};

// Mettre à jour un client par ID
const UpdateClient = (
  connexion,
  { ID_Client, name, surname, mail, num },
  callback
) => {
  const query = `
    UPDATE Client
    SET name = ?, surname = ?, mail = ?, num = ?
    WHERE ID_Client = ?
  `;
  const values = [name, surname, mail, num, ID_Client];

  connexion.query(query, values, callback);
};

module.exports = {
  GetClientById,
  GetClientByMail,
  AddClient,
  LoginUser,
  UpdateClient,
};
