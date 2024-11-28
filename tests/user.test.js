const { GetClientById, GetClientByMail, AddClient } = require('../api/users/usersController');

describe('User Controller', () => {
    let mockConnexion;
    let mockCallback;

    beforeEach(() => {
        mockConnexion = {
            query: jest.fn()
        };
        mockCallback = jest.fn();
    });

    it('id', () => {
        const id = 1;
        GetClientById(mockConnexion, { id }, mockCallback);
        expect(mockConnexion.query).toHaveBeenCalledWith('SELECT * FROM client WHERE ID_Client = ?', [id], mockCallback);
    });

    it('mail', () => {
        const mail = 'test@gmail.com';
        GetClientByMail(mockConnexion, { mail }, mockCallback);
        expect(mockConnexion.query).toHaveBeenCalledWith('SELECT * FROM client WHERE mail = ?', [mail], mockCallback);
    });
});