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

const AddClient = (connexion, { name, surname, num, mail, handicap, birth, password, contact_mail, contact_num, note }, callback) => {
    const query = `
        INSERT INTO Client (name, surname, num, mail, handicap, birth, password, contact_mail, contact_num, note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, surname, num, mail, handicap, birth, password, contact_mail, contact_num, note];

    connexion.query(query, values, callback);
}

module.exports = {
    GetClientById,
    GetClientByMail,
    AddClient
};