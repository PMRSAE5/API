const request = require('supertest');
const express = require('express');
const app = express();
const usersRouter = require('../api/users/users');
const accRouter = require('../api/acc/accompagnateur');
const UsersController = require('../api/users/usersController');

app.use(express.json());
app.use('/users', usersRouter);
app.use('/acc', accRouter);

jest.mock('../api/users/usersController');

describe('Users API', () => {
  it('retourne un message pour les utilisateurs', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Utilisateur');
  });

  it('retourne un utilisateur par un id', async () => {
    const mockUser = { id: 1, name: 'John Doe' };
    UsersController.GetClientById.mockImplementation((connexion, { id }, callback) => {
      callback(null, [mockUser]);
    });

    const res = await request(app).get('/users/userId/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([mockUser]);
  });

  it('retourne une erreur lors de la récupération par id', async () => {
    UsersController.GetClientById.mockImplementation((connexion, { id }, callback) => {
      callback(new Error('Erreur lors de la récupération des données'), null);
    });

    const res = await request(app).get('/users/userId/1');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error', 'Erreur lors de la récupération des données');
  });

  it('retourne un utilisateur par un mail', async () => {
    const mockUser = { id: 1, name: 'John Doe', mail: 'test@example.com' };
    UsersController.GetClientByMail.mockImplementation((connexion, { mail }, callback) => {
      callback(null, [mockUser]);
    });

    const res = await request(app).get('/users/userMail/test@example.com');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([mockUser]);
  });

  it('retourne une erreur lors de la récupération par mail', async () => {
    UsersController.GetClientByMail.mockImplementation((connexion, { mail }, callback) => {
      callback(new Error('Erreur lors de la récupération des données'), null);
    });

    const res = await request(app).get('/users/userMail/test@example.com');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error', 'Erreur lors de la récupération des données');
  });
});

describe('Accompagnateurs API', () => {
  it('retourne une liste d\'accompagnateurs', async () => {
    const res = await request(app).get('/acc');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error', 'Erreur lors de la récupération des données');
  });
});