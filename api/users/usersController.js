//// Get

const GetClientById = (connexion, { id }, callback) => {
    const query = 'SELECT * FROM client WHERE ID_Client = ?';
    connexion.query(query, [id], callback);
}

const GetClientByMail = (connexion, { mail }, callback) => {
    const query = 'SELECT * FROM client WHERE mail = ?';
    connexion.query(query, [mail], callback);
}

//// Add


module.exports = {
    GetClientById,
    GetClientByMail,
};