// accompagnateur.test.js

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Import du routeur
const accompagnateurRouter = require('../api/acc/accompagnateur');

// Simulation de la fonction AddAccompagnateur dans le contrôleur
jest.mock('../api/acc/accompagnateurController', () => ({
  AddAccompagnateur: jest.fn((connexion, { name_acc, surname_acc, num_acc, mail_acc }, callback) => {
    console.log('Mock de AddAccompagnateur appelé'); // Log pour savoir quand la méthode est appelée
    // Simule un résultat d'insertion réussie
    const result = { insertId: 123 };
    callback(null, result); // Appel de la callback avec succès
  }),
}));

// Configuration de l'application
app.use(bodyParser.json());
app.use('/acc', accompagnateurRouter);

// Test de la route POST /accAdd
describe('POST /accAdd', () => {
  it('should add an accompagnateur and return success message', async () => {
    const newAccompagnateur = {
      name_acc: 'John',
      surname_acc: 'Doe',
      num_acc: '123456789',
      mail_acc: 'john.doe@example.com',
    };

    const response = await request(app)
      .post('/acc/accAdd')
      .send(newAccompagnateur)
      .expect('Content-Type', /json/)
      .expect(201);

    // Vérification du message et de l'ID retournés
    expect(response.body.message).toBe('Accompagnateur ajouté avec succès');
    expect(response.body.id).toBe(123); // Vérifie l'ID simulé
  });

  it('should return an error if data is missing', async () => {
    const response = await request(app)
      .post('/acc/accAdd')
      .send({}) // Envoie des données vides
      .expect('Content-Type', /json/)
      .expect(500);

    expect(response.body.error).toBe('Erreur lors de l\'insertion des données');
  });
});