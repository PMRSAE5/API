const connexion = require("../../config/config");

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
 * Compare un mot de passe fourni avec le mot de passe stocké
 * @param {string} inputPassword - Mot de passe fourni
 * @param {string} storedPassword - Mot de passe stocké
 * @returns {boolean} - Retourne true si les mots de passe correspondent, sinon false
 */
const comparePassword = (inputPassword, storedPassword) => {
    return inputPassword === storedPassword;
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

module.exports = {
    getAgentByName,
    comparePassword,
    GetIdAgentByName
};