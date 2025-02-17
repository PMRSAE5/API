const GetAccompagnateurById = (connexion, { id }, callback) => {
  const query = "SELECT * FROM accompagnateur WHERE ID_Accompagnateur = ?"; // On récupère l'accompagnateur par son ID
  connexion.query(query, [id], callback);
};

const GetAccompagnateurByMail = (connexion, { mail }, callback) => {
  const query = "SELECT * FROM accompagnateur WHERE mail_acc = ?";
  connexion.query(query, [mail], callback);
};

const GetAccompagnateurByNum = (connexion, { num }, callback) => {
  const query = "SELECT * FROM accompagnateur WHERE num_acc = ?";
  connexion.query(query, [num], callback);
};

const AddAccompagnateur = (
  connexion,
  { name_acc, surname_acc, num_acc, mail_acc }, // On récupère les données
  callback
) => {
  // On utilise une requête SQL pour insérer un nouvel accompagnateur
  const query = `
         INSERT INTO Accompagnateur (name_acc, surname_acc, num_acc, mail_acc) 
         VALUES (?, ?, ?, ?)
     `;
  // On fournit les valeurs
  const values = [name_acc, surname_acc, num_acc, mail_acc];

  connexion.query(query, values, callback);
};

module.exports = {
  AddAccompagnateur,
  GetAccompagnateurById,
  GetAccompagnateurByMail,
  GetAccompagnateurByNum,
};
