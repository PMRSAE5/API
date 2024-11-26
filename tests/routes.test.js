const request = require('supertest');
const express = require('express');
const app = express();
const usersRouter = require('../api/users/users');
const accRouter = require('../api/acc/accompagnateur');

app.use(express.json());
app.use('/users', usersRouter);
app.use('/acc', accRouter);

describe('Users API', () => {
  it('retourne ', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Utilisateur');
  });

  it('retourne un utilisateur par un id', async () => {
    const res = await request(app).get('/users/userId/1');
    expect(res.statusCode).toEqual(500);
  });

  it('retourne un utilisateur par un mail', async () => {
    const res = await request(app).get('/users/userMail/test@example.com');
    expect(res.statusCode).toEqual(500);
  });
});

describe('Accompagnateurs API', () => {
  it('retourne une liste daccompagnateur', async () => {
    const res = await request(app).get('/acc');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error', 'Erreur lors de la récupération des données');
  });
});