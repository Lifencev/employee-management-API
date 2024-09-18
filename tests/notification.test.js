// tests/notification.test.js
const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const db = require('../models');

let adminToken;

describe('Notification API', () => {
  before(async () => {
    await db.sequelize.sync({ force: true });

    // Создаем администратора и получаем токен
    await request(app)
      .post('/register')
      .send({
        email: 'admin@example.com',
        password: 'adminpassword',
        firstName: 'Admin',
        lastName: 'User',
        middleName: 'Middle',
        birthDate: '1980-01-01',
        phone: '+987654321',
        programmingLanguage: 'N/A',
        role: 'admin',
        secretWord: process.env.SECRET_WORD
      });

    const res = await request(app)
      .post('/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpassword'
      });

    adminToken = res.body.token;

    // Создаем уведомление
    await db.Notification.create({
      message: 'Test notification',
      userId: 1
    });
  });

  describe('GET /notifications', () => {
    it('should get list of notifications for admin', async () => {
      const res = await request(app)
        .get('/notifications')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('message');
    });
  });

  describe('PATCH /notifications/:id/mark-as-read', () => {
    it('should mark notification as read', async () => {
      const res = await request(app)
        .patch('/notifications/1/mark-as-read')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Уведомление отмечено как прочитанное');
    });
  });
});
