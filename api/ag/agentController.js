const connexion = require("../../config/config");
const bcrypt = require('bcrypt');

/**
 * Hash un mot de passe en utilisant bcrypt.
 * @param {string} password - Mot de passe à hacher.
 * @returns {string} - Mot de passe haché.
 */
const hashPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password.trim(), saltRounds);
};

async function comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Récupère les informations d'un agent par son nom
 * @param {object} connexion - Connexion à la base de données
 * @param {string} name - Nom de l'agent
 * @returns {Promise<object[]>} - Résultats de la requête
 */
const getAgentByName = async (connexion, name) => {
    try {
        // Récupérer les informations d'un agent par son nom
        const [rows] = await connexion.promise().execute('SELECT * FROM Agent WHERE name = ?', [name]);
        return rows;
    } catch (error) {
        console.error('Error fetching agent by name:', error);
        throw error;
    }
};

/**
 * Récupère l'ID d'un agent par son nom
 * @param {object} connexion - Connexion à la base de données
 * @param {string} name - Nom de l'agent
 * @param {function} callback - Gérer le résultat ou l'erreur
 */
const GetIdAgentByName = (connexion, name, callback) => {
    const query = "SELECT ID_Agent FROM Agent WHERE name = ?";
    connexion.query(query, [name], (err, results) => {
        if (err) {
            console.error('Error fetching agent ID by name:', err);
            callback(err, null);
        } else {
            console.log('Results:', results);
            callback(null, results);
        }
    });
};

/**
 * Ajoute un nouvel agent.
 * @param {Object} connexion - Connexion à la base de données.
 * @param {Object} data - Informations du client à ajouter.
 * @param {Function} callback - Gérer les résultats.
 */
const AddAgent = (connexion, data, callback) => {
    if (!data) {
        console.error("Données manquantes !");
        return callback(new Error("Les données sont manquantes ou mal formées."));
    }

    const {
        name,
        surname,
        password,
    } = data;

    const hashedPassword = hashPassword(password); // Hash du mot de passe

    const query = `INSERT INTO Agent (name, surname, password) VALUES (?, ?, ?)`;

    const values = [
        name,
        surname,
        hashedPassword,
    ];

    connexion.query(query, values, callback);
};


module.exports = {
    getAgentByName,
    comparePassword,
    GetIdAgentByName,
    AddAgent,
};