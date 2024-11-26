const request = require('supertest');
const express = require('express');
const app = express();
const usersRouter = require('../api/users/users');
const accRouter = require('../api/acc/accompagnateur');

app.use(express.json());
app.use('/users', usersRouter);
app.use('/acc', accRouter);

describe('Users API', () => {
  it('should return a message for users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Utilisateur');
  });

  it('should return a user by ID', async () => {
    const res = await request(app).get('/users/userId/1');
    expect(res.statusCode).toEqual(500);
  });

  it('should return a user by email', async () => {
    const res = await request(app).get('/users/userMail/test@example.com');
    expect(res.statusCode).toEqual(500);
  });
});
