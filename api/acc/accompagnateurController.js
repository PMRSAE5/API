// const GetAccompagnateurById = (connexion, { id }, callback) => {
//   const query = "SELECT * FROM accompagnateur WHERE ID_Accompagnateur = ?"; // On récupère l'accompagnateur par son ID
//   connexion.query(query, [id], callback);
// };

// const GetAccompagnateurByMail = (connexion, { mail }, callback) => {
//   const query = "SELECT * FROM accompagnateur WHERE mail_acc = ?";
//   connexion.query(query, [mail], callback);
// };

// const GetAccompagnateurByNum = (connexion, { num }, callback) => {
//   const query = "SELECT * FROM accompagnateur WHERE num_acc = ?";
//   connexion.query(query, [num], callback);
// };

/**
 * Ajoute un nouvel accompagnateur dans  la bdd
 * @param {object} connexion - Connexion à la base de données
 * @param {object} accompagnateur - Données de l'accompagnateur (nom, prénom, numéro, email)
 * @param {function} callback -Gérer le résultat ou l'erreur
 */
// accompagnateurController.js

const AddAccompagnateur = (connexion, { name_acc, surname_acc, num_acc, mail_acc }, callback) => {
  console.log('Ajout d\'un accompagnateur:', { name_acc, surname_acc, num_acc, mail_acc });

  const query = `
         INSERT INTO Accompagnateur (name_acc, surname_acc, num_acc, mail_acc) 
         VALUES (?, ?, ?, ?)
     `;
  const values = [name_acc, surname_acc, num_acc, mail_acc];

  connexion.query(query, values, callback);
};

module.exports = {
  AddAccompagnateur,
};

module.exports = {
  AddAccompagnateur,
  // GetAccompagnateurById,
  // GetAccompagnateurByMail,
  // GetAccompagnateurByNum,
};
