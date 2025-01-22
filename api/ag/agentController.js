const connexion = require("../../config/config");


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

const comparePassword = (inputPassword, storedPassword) => {
    return inputPassword === storedPassword;
};

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