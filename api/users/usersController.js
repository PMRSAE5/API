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

  connexion.query(query, values, callback);
};
const LoginUser = (connexion, { mail, password }, callback) => {
  const query = "SELECT * FROM client WHERE mail = ? AND password = ?";
  connexion.query(query, [mail, password], callback);
};

module.exports = {
  GetClientById,
  GetClientByMail,
  AddClient,
  LoginUser,
};
