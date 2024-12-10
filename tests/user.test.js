const {
  GetClientById,
  GetClientByMail,
} = require("../api/users/usersController");

describe("User Controller", () => {
  let mockConnexion;
  let mockCallback;

  beforeEach(() => {
    mockConnexion = {
      query: jest.fn(),
    };
    mockCallback = jest.fn();
  });

  it("id", () => {
    const id = 1;
    GetClientById(mockConnexion, { id }, mockCallback);
    expect(mockConnexion.query).toHaveBeenCalledWith(
      "SELECT * FROM Client WHERE ID_Client = ?",
      [id],
      mockCallback
    );
  });

  it("mail", () => {
    const mail = "test@gmail.com";
    GetClientByMail(mockConnexion, { mail }, mockCallback);
    expect(mockConnexion.query).toHaveBeenCalledWith(
      "SELECT * FROM Client WHERE mail = ?",
      [mail],
      mockCallback
    );
  });

  it("should handle empty id", () => {
    const id = null;
    GetClientById(mockConnexion, { id }, mockCallback);
    expect(mockConnexion.query).toHaveBeenCalledWith(
      "SELECT * FROM Client WHERE ID_Client = ?",
      [id],
      mockCallback
    );
  });

  it("should handle empty mail", () => {
    const mail = null;
    GetClientByMail(mockConnexion, { mail }, mockCallback);
    expect(mockConnexion.query).toHaveBeenCalledWith(
      "SELECT * FROM Client WHERE mail = ?",
      [mail],
      mockCallback
    );
  });

  it("should handle invalid id", () => {
    const id = "invalid";
    GetClientById(mockConnexion, { id }, mockCallback);
    expect(mockConnexion.query).toHaveBeenCalledWith(
      "SELECT * FROM Client WHERE ID_Client = ?",
      [id],
      mockCallback
    );
  });

  it("should handle invalid mail", () => {
    const mail = "invalid";
    GetClientByMail(mockConnexion, { mail }, mockCallback);
    expect(mockConnexion.query).toHaveBeenCalledWith(
      "SELECT * FROM Client WHERE mail = ?",
      [mail],
      mockCallback
    );
  });
});
