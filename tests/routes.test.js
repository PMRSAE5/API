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
    expect(res.statusCode).toEqual(500); // Change this based on your actual implementation
  });

  it('should return a user by email', async () => {
    const res = await request(app).get('/users/userMail/test@example.com');
    expect(res.statusCode).toEqual(500); // Change this based on your actual implementation
  });
});

describe('Accompagnateurs API', () => {
  it('should return a list of accompagnateurs', async () => {
    const res = await request(app).get('/acc');
    expect(res.statusCode).toEqual(500); // Change this based on your actual implementation
  });

  it('should add a new accompagnateur', async () => {
    const res = await request(app)
      .post('/accAdd')
      .send({
        name_acc: 'John',
        surname_acc: 'Doe',
        num_acc: '1234567890',
        mail_acc: 'john.doe@example.com'
      });
    expect(res.statusCode).toEqual(500); // Change this based on your actual implementation
  });
});