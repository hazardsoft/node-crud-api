import request from 'supertest';
import { server } from '../src/index';
import type {User} from '../src/types';
import {v4} from 'uuid';

describe('CRUD API', () => {
  afterAll(() => {
    server.close();
  });

  let userId = '';
  const createUserBody: User = { username: 'Henadzi Shutko', age: 99, hobbies: ['reading', 'coding'] };
  const updateUserBody: User = { username: "Henadzi Shutko (updated)", age: 100, hobbies: ['reading', 'coding', 'swimming'] };

  test('all requests are successful', async () => {
    // should return an empty array on GET /api/users
    const emptyUsersRes = await request(server).get('/api/users');
    expect(emptyUsersRes.statusCode).toBe(200);
    expect(emptyUsersRes.body).toEqual([]);

    // should create a new user on POST /api/users
    const createdUserRes = await request(server)
      .post('/api/users')
      .send(createUserBody)
      .set('Content-Type', 'application/json');
    expect(createdUserRes.statusCode).toBe(201);
    expect(createdUserRes.body).toHaveProperty('id');
    expect(createdUserRes.body).toMatchObject(createUserBody);
    userId = createdUserRes.body.id;

    // should get the created user by id on GET /api/users/{userId}
    const getUserRes = await request(server).get(`/api/users/${userId}`);
    expect(getUserRes.statusCode).toBe(200);
    expect(getUserRes.body).toHaveProperty('id', userId);
    expect(getUserRes.body).toMatchObject(createUserBody);

    //should update the user on PUT /api/users/:userId
    const updateUserRes = await request(server)
      .put(`/api/users/${userId}`)
      .send(updateUserBody)
      .set('Content-Type', 'application/json');
    expect(updateUserRes.statusCode).toBe(200);
    expect(updateUserRes.body).toHaveProperty('id', userId);
    expect(updateUserRes.body).toMatchObject(updateUserBody);

    //should delete the user on DELETE /api/users/:userId
    const deleteUserRes = await request(server).delete(`/api/users/${userId}`);
    expect(deleteUserRes.statusCode).toBe(204);
    expect(deleteUserRes.text).toBe("");

    //should return 404 for deleted user on GET /api/users/:userId
    const getDeletedUserRes = await request(server).get(`/api/users/${userId}`);
    expect(getDeletedUserRes.statusCode).toBe(404);
    expect(getDeletedUserRes.body).toHaveProperty('message');
    expect(getDeletedUserRes.body.message).toMatch(/not found/i);
  });

  test("GET /api/users returns errors", async () => {
    const invalidRouteResponse = await request(server).get("/fake");
    expect(invalidRouteResponse.statusCode).toBe(404);
    expect(invalidRouteResponse.body.message).toMatch(/endpoint is not found/i);

    const invalidUserIdResponse = await request(server).get("/api/users/");
    expect(invalidUserIdResponse.statusCode).toBe(400);
    expect(invalidUserIdResponse.body.message).toMatch(/user id is invalid/i);

    const userNotFoundResponse = await request(server).get(`/api/users/${v4()}`);
    expect(userNotFoundResponse.statusCode).toBe(404);
    expect(userNotFoundResponse.body.message).toMatch(/user not found/i);
  });

  test("POST /api/users returns errors", async () => {
    const createInvalidUserRes = await request(server)
      .post('/api/users')
      .send({...createUserBody, username: ''})
      .set('Content-Type', 'application/json');
    expect(createInvalidUserRes.statusCode).toBe(400);
    expect(createInvalidUserRes.body.message).toMatch(/user body is invalid/i);
  });

  test("PUT /api/users returns errors", async () => {
    const updateInvalidUserRes = await request(server)
      .put(`/api/users/${userId}`)
      .send({...updateUserBody, username: ''})
      .set('Content-Type', 'application/json');
    expect(updateInvalidUserRes.statusCode).toBe(400);  
    expect(updateInvalidUserRes.body.message).toMatch(/user body is invalid/i);
  });
}); 