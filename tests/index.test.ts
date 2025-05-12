import request from 'supertest';
import { server } from '../src/index';
import type {User} from '../src/types';

describe('CRUD API, scenario #1', () => {
  let userId = '';
  const createUserBody: User = { username: 'Henadzi Shutko', age: 99, hobbies: ['reading', 'coding'] };
  const updateUserBody: User = { username: "Henadzi Shutko (updated)", age: 100, hobbies: ['reading', 'coding', 'swimming'] };

  afterAll((done) => {
    server.close(done);
  });

  it('should return an empty array on GET /api/users', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new user on POST /api/users', async () => {
    const res = await request(server)
      .post('/api/users')
      .send(createUserBody)
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toMatchObject(createUserBody);
    userId = res.body.id;
  });

  it("should get the created user by id on GET /api/users/{userId}", async () => {
    const res = await request(server).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
    expect(res.body).toMatchObject(createUserBody);
  });

  it('should update the user on PUT /api/users/:userId', async () => {
    const res = await request(server)
      .put(`/api/users/${userId}`)
      .send(updateUserBody)
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
    expect(res.body).toMatchObject(updateUserBody);
  });

  it('should delete the user on DELETE /api/users/:userId', async () => {
    const res = await request(server).delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(204);
    expect(res.text).toBe("");
  });

  it('should return 404 for deleted user on GET /api/users/:userId', async () => {
    const res = await request(server).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/not found/i);
  });
}); 