//// Get

const GetClientById = (connexion, { id }, callback) => {
    const query = 'SELECT * FROM client WHERE ID_Client = ?';
    connexion.query(query, [id], callback);
}

const GetClientByMail = (connexion, { mail }, callback) => {
    const query = 'SELECT * FROM client WHERE mail = ?';
    connexion.query(query, [mail], callback);
}

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


//// Add

const AddClient = (connexion, { name_acc, surname_acc, num_acc, mail_acc, name, surname, num, mail, handicap, birth, password, contact_mail, contact_num, note }, callback) => {
    const queryAccompagnateur = `
        INSERT INTO Accompagnateur (name_acc, surname_acc, num_acc, mail_acc)
        VALUES (?, ?, ?, ?)
    `;
    const valuesAccompagnateur = [name_acc, surname_acc, num_acc, mail_acc];

    connexion.query(queryAccompagnateur, valuesAccompagnateur, (err, result) => {
        if (err) {
            return callback(err);
        }

        const accompagnateurId = result.insertId;

        const queryClient = `
            INSERT INTO Client (
                accompagnateur, name, surname, num, mail, handicap, birth, password, contact_mail, contact_num, note
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const valuesClient = [accompagnateurId, name, surname, num, mail, handicap, birth, password, contact_mail, contact_num, note];

        connexion.query(queryClient, valuesClient, callback);
    });
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
    GetClientById,
    GetClientByMail,
    GetAccompagnateurById,
    GetAccompagnateurByMail,
    GetAccompagnateurByNum,
    AddClient,
    AddAccompagnateur
};