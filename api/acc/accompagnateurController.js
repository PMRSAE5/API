const GetAccompagnateurById = (connexion, { id }, callback) => {
    const query = 'SELECT * FROM accompagnateur WHERE ID_Accompagnateur = ?';
    connexion.query(query, [id], callback);
}

const GetAccompagnateurByMail = (connexion, { mail }, callback) => {
    const query = 'SELECT * FROM accompagnateur WHERE mail_acc = ?';
    connexion.query(query, [mail], callback);
}

const GetAccompagnateurByNum = (connexion, { num }, callback) => {
    const query = 'SELECT * FROM accompagnateur WHERE num_acc = ?';
    connexion.query(query, [num], callback);
}

const AddAccompagnateur = (connexion, { name_acc, surname_acc, num_acc, mail_acc }, callback) => {
    const query = `
        INSERT INTO Accompagnateur (name_acc, surname_acc, num_acc, mail_acc)
        VALUES (?, ?, ?, ?)
    `;
    const values = [name_acc, surname_acc, num_acc, mail_acc];

    connexion.query(query, values, callback);
}

module.exports = {
    GetAccompagnateurById,
    GetAccompagnateurByMail,
    GetAccompagnateurByNum,
    AddAccompagnateur
};
