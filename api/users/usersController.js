const bcrypt = require('bcrypt');

/**
 * Recherche un client par son ID.
 * @param {Object} connexion - Connexion à la base de données.
 * @param {Object} params - ID du client à rechercher.
 * @param {Function} callback - Gérer les résultats.
 */
const GetClientById = (connexion, { id }, callback) => {
  const query = "SELECT * FROM Client WHERE ID_Client = ?";
  connexion.query(query, [id], callback);
};

/**
 * Recherche un client par son adresse mail.
 * @param {Object} connexion - Connexion à la base de données.
 * @param {Object} params - Le mail du client à rechercher.
 * @param {Function} callback - Gérer les résultats.
 */
const GetClientByMail = (connexion, { mail }, callback) => {
  const query = "SELECT * FROM Client WHERE mail = ?";
  connexion.query(query, [mail], callback);
};

/**
 * Hash un mot de passe en utilisant bcrypt.
 * @param {string} password - Mot de passe à hacher.
 * @returns {string} - Mot de passe haché.
 */
const hashPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password.trim(), saltRounds);
};

/**
 * Ajoute un nouveau client.
 * @param {Object} connexion - Connexion à la base de données.
 * @param {Object} data - Informations du client à ajouter.
 * @param {Function} callback - Gérer les résultats.
 */
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

  // Hash du mot de passe avec bcrypt
  const hashedPassword = hashPassword(password);

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
    hashedPassword,  // Utiliser le mot de passe haché
    contact_mail,
    contact_num,
    note,
  ];

  connexion.query(query, values, callback);
};

/**
 * Authentifie un utilisateur en vérifiant son mot de passe et mail.
 * @param {Object} connexion - Connexion à la base de données.
 * @param {Object} params - Contient le mail et le mot de passe.
 * @param {Function} callback - Gérer l'authentification.
 */
const LoginUser = (connexion, { mail, password }, callback) => {
  const query = "SELECT * FROM Client WHERE mail = ?";

  connexion.query(query, [mail], (err, results) => {
    if (err) {
      return callback(err);
    }

    if (results.length === 0) {
      return callback(new Error("Utilisateur non trouvé."));
    }

    const user = results[0];
    
    // Comparer le mot de passe fourni avec le mot de passe haché dans la base de données
    bcrypt.compare(password.trim(), user.password, (err, isMatch) => {
      if (err) {
        return callback(err);
      }

      if (!isMatch) {
        return callback(new Error("Mot de passe incorrect."));
      }

      callback(null, user);  // Mot de passe correct
    });
  });
};

/**
 * Met à jour les informations d'un client.
 * @param {Object} connexion - Connexion à la base de données.
 * @param {Object} updatedData - Les nouvelles informations du client.
 * @param {Function} callback - Gérer la mise à jour.
 */
const UpdateClient = (connexion, updatedData, callback) => {
  const { ID_Client, name, surname, mail, num, handicap, contact_num } = updatedData;

  if (!ID_Client) {
    return callback(
      new Error("L'identifiant du client (ID_Client) est requis.")
    );
  }

  const query = `
    UPDATE Client
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
