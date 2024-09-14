// controller/TableController.js
const getAllTests = (connexion, callback) => {
    const query = 'SELECT * FROM test';
    connexion.query(query, callback);
  };
  
  const insertUser = (connexion, { pseudo, num, mail }, callback) => {
    const query = 'INSERT INTO test (pseudo, num, mail) VALUES (?, ?, ?)';
    connexion.query(query, [pseudo, num, mail], callback);
  };

  const getUserbyId = (connexion, { id }, callback) => {
    const query = 'SELECT * FROM test WHERE id = ?';
    connexion.query(query, [id], callback);
  };
  
  module.exports = {
    getAllTests,
    insertUser,
    getUserbyId
  };