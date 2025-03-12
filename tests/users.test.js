const request = require('supertest');  // Pour tester les requêtes HTTP
const express = require('express');
const usersRouter = require('../api/users/users'); // Importation du routeur des utilisateurs
const UsersController = require('../api/users/usersController');  // Le contrôleur
jest.mock('../api/users/usersController');  // Mock du contrôleur

const app = express();
app.use(express.json());
app.use('/users', usersRouter);  // Utilisation du routeur dans l'app express

describe('Tests des utilisateurs', () => {

  // Test pour récupérer un utilisateur par ID
  it('devrait récupérer un utilisateur par son ID', async () => {
    // Mock de la fonction GetClientById pour simuler la récupération d'un utilisateur
    const mockUser = { ID_Client: 1, name: 'John Doe', email: 'john@example.com' };
    UsersController.GetClientById.mockImplementation((connexion, { id }, callback) => {
      callback(null, [mockUser]);  // Simuler une réponse réussie
    });

    const response = await request(app).get('/users/userId/1');  // Appel de la route /userId/:id
    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockUser]);  // On vérifie que la réponse est la bonne
  });

  // Test pour ajouter un utilisateur
  it('devrait ajouter un utilisateur', async () => {
    // Mock de la fonction AddClient pour simuler l'ajout d'un utilisateur
    UsersController.AddClient.mockImplementation((connexion, userData, callback) => {
      callback(null, { insertId: 42 });  // On simule l'insertion réussie
    });

    const userToAdd = { name: 'Alice', email: 'alice@example.com', password: 'password123' };
    const response = await request(app).post('/users/userAdd').send(userToAdd);  // Appel de la route /userAdd
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Client ajouté avec succès !');
  });

  // Test pour la connexion d'un utilisateur
  it('devrait connecter un utilisateur', async () => {
    // Mock de la fonction LoginUser pour simuler une connexion
    const mockUser = { ID_Client: 1, mail: 'john@example.com', password: 'password123' };
    UsersController.LoginUser.mockImplementation((connexion, { mail, password }, callback) => {
      if (mail === mockUser.mail && password === mockUser.password) {
        callback(null, mockUser);  // Connexion réussie
      } else {
        callback(new Error('Utilisateur non trouvé ou mot de passe incorrect.'));
      }
    });

    const response = await request(app).post('/users/userLog').send({ mail: 'john@example.com', password: 'password123' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Connexion réussie');
    expect(response.body.user.mail).toBe('john@example.com');
  });

  // Test pour la mise à jour d'un utilisateur
  it('devrait mettre à jour un utilisateur', async () => {
    // Mock de la fonction UpdateClient pour simuler la mise à jour d'un utilisateur
    UsersController.UpdateClient.mockImplementation((connexion, updatedData, callback) => {
      callback(null, { affectedRows: 1 });  // Simuler une mise à jour réussie
    });

    const updatedData = { ID_Client: 1, name: 'John Updated', surname: 'Doe', mail: 'john.updated@example.com' };
    const response = await request(app).put('/users/update').send(updatedData);  // Appel de la route /update
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Utilisateur mis à jour avec succès.');
  });

});
