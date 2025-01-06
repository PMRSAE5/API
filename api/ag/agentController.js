const getAgentByName = async (connexion, name) => {
    try {
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

module.exports = {
    getAgentByName,
    comparePassword
};