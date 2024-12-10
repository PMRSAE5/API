const { GetAccompagnateurById, GetAccompagnateurByMail, GetAccompagnateurByNum, AddAccompagnateur } = require('../api/acc/accompagnateurController');

describe('Accompagnateur Controller', () => {
  let mockConnexion;
  let mockCallback;

  beforeEach(() => {
    mockConnexion = {
      query: jest.fn()
    };
    mockCallback = jest.fn();
  });

  it('should get accompagnateur by ID', () => {
    const id = 1;
    GetAccompagnateurById(mockConnexion, { id }, mockCallback);
    expect(mockConnexion.query).toHaveBeenCalledWith('SELECT * FROM accompagnateur WHERE ID_Accompagnateur = ?', [id], mockCallback);
  });

  it('should get accompagnateur by mail', () => {
    const mail = 'test@example.com';
    GetAccompagnateurByMail(mockConnexion, { mail }, mockCallback);
    expect(mockConnexion.query).toHaveBeenCalledWith('SELECT * FROM accompagnateur WHERE mail_acc = ?', [mail], mockCallback);
  });

  it('should get accompagnateur by num', () => {
    const num = '1234567890';
    GetAccompagnateurByNum(mockConnexion, { num }, mockCallback);
    expect(mockConnexion.query).toHaveBeenCalledWith('SELECT * FROM accompagnateur WHERE num_acc = ?', [num], mockCallback);
  });
});