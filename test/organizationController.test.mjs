import * as chai from 'chai';
import supertest from 'supertest';
import app from '../app.js';

const { expect } = chai;

describe('Organization CRUD Operations', () => {
  let token;

  before(async () => {
    const userResponse = await supertest(app)
      .post('/api/users/login')
      .send({ email: 'admin@test.com', password: '1234' });
    token = userResponse.body.token;
  });

  describe('POST /organizations', () => {
    it('should create an organization with valid token', async () => {
      const res = await supertest(app)
        .post('/api/organizations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Organization',
          addresses: [
            {
              street: '123 main',
              city: 'anytown',
              state: 'CA',
              zip: '12345',
              country: 'USA',
            },
          ],
        });
      expect(res.statusCode).to.equal(201);
      expect(res.body).to.have.property('name');
      expect(res.body).to.have.property('addresses');
    });
    it('should return an error if a name is missing in the request body', async () => {
      const res = await supertest(app)
        .post('/api/organizations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          addresses: [
            {
              street: '123 main',
              city: 'anytown',
              state: 'CA',
              zip: '12345',
              country: 'USA',
            },
          ],
        });
      expect(res.statusCode).to.equal(400);
    });
  });

  describe('GET /organizations', () => {
    it('should return all organizations', async () => {
      const res = await supertest(app)
        .get('/api/organizations');
      expect(res.statusCode).to.equal(200);
      expect(res.body.length).to.not.equal(0);
    });
  });

  describe('GET /organizations/:id', () => {
    it('should return an organization for a valid ID', async () => {
      const res = await supertest(app)
        .get('/api/organizations/65d651f4b66591c6f6562f0f');
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property('name');
    });

    it('should return 500 for a non-existent ID', async () => {
      const res = await supertest(app)
        .get('/api/organizations/65d651f4b66591c6f6562f0g');
      expect(res.statusCode).to.equal(500);
    });
  });

  describe('GET /organizations/:id with query parameters', () => {
    it('should return specific fields for an organization based on query params', async () => {
      const validId = '65d5617b40e12c0140bd250b';
      const field = 'city';
      const res = await supertest(app)
        .get(`/api/organizations/${validId}/?${field}=Lakeside`);
      expect(res.statusCode).to.equal(200);
      expect(res.body[0].name).to.equal('Ooogle');
      expect(res.body[0].addresses[0].city).to.equal('Lakeside');
    });
  });

  describe('PUT /organizations/:id', () => {
    it('should update the organization name with valid token and ID', async () => {
      const newName = 'Updated Org Name';
      const res = await supertest(app)
        .put('/api/organizations/65d653658ac56b31865e73c9')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: newName });
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property('name', newName);
    });
  });

  describe('DELETE /organizations/:id', () => {
    let token;
    let organizationId;

    before(async () => {
      const userResponse = await supertest(app)
        .post('/api/users/login')
        .send({ email: 'admin@test.com', password: '1234' });
      token = userResponse.body.token;

      const orgResponse = await supertest(app)
        .post('/api/organizations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Org to Delete',
          addresses: [
            {
              street: 'Delete Street',
              city: 'Deletetown',
              state: 'CA',
              zip: '12345',
              country: 'USA',
            },
          ],
        });
      organizationId = orgResponse.body._id;
    });
    it('should delete the organization with valid token and ID', async () => {
      const res = await supertest(app)
        .delete(`/api/organizations/${organizationId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).to.equal(204);
    });
  });
});
