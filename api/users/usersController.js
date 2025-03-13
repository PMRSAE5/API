// Rechercher un client par ID
const GetClientById = (connexion, { id }, callback) => {
  const query = "SELECT * FROM client WHERE ID_Client = ?";
  connexion.query(query, [id], callback);
};

// Rechercher un client par email
const GetClientByMail = (connexion, { mail }, callback) => {
  const query = "SELECT * FROM client WHERE mail = ?";
  connexion.query(query, [mail], callback);
};

const AddClient = (connexion, data, callback) => {
  if (!data) {
    console.error("Données manquantes !");
    return callback(new Error("Les données sont manquantes ou mal formées."));
  }

  const {
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
  } = data;

  const query = `
    INSERT INTO client (name, surname, num, mail, handicap, civilite, birth, password, contact_mail, contact_num, note)
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

const UpdateClient = (connexion, updatedData, callback) => {
  const { ID_Client, name, surname, mail, num, handicap, contact_num } =
    updatedData;

  if (!ID_Client) {
    return callback(
      new Error("L'identifiant du client (ID_Client) est requis.")
    );
  }

  const query = `
    UPDATE client
    SET
      name = ?,
      surname = ?,
      mail = ?,
      num = ?,
      handicap = ?,
      contact_num = ?
    WHERE ID_Client = ?
  `;

  const values = [
    name || null,
    surname || null,
    mail || null,
    num || null,
    handicap || null,
    contact_num || null,
    ID_Client,
  ];

  connexion.query(query, values, (error, result) => {
    if (error) {
      console.error("Erreur lors de la mise à jour :", error);
      return callback(error);
    }

    if (result.affectedRows === 0) {
      return callback(
        new Error("Aucun utilisateur trouvé avec cet identifiant.")
      );
    }

    callback(null, {
      success: true,
      message: "Utilisateur mis à jour avec succès.",
    });
  });
};

module.exports = {
  GetClientById,
  GetClientByMail,
  AddClient,
  LoginUser,
  UpdateClient,
};
