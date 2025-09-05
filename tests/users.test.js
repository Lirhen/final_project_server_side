/*
 * users.test.js
 * Tests for /api/users endpoints: creation, listing, and details with total.
 */
const request = require('supertest');
const { connect, clear, close } = require('./test_db');

let app;

beforeAll(async () => {
    // Ensure NODE_ENV is set to test
    process.env.NODE_ENV = 'test';
    await connect();
    app = require('../app');
});

afterEach(async () => {
    // Clear DB between tests
    await clear();
});

afterAll(async () => {
    // Close DB connection
    await close();
});

describe('Users API', () => {
    test('POST /api/users creates a user', async () => {
        // Send POST request with valid user data
        const res = await request(app)
            .post('/api/users')
            .send({ id: 123123, first_name: 'mosh', last_name: 'israeli', birthday: '1990-01-01' });

        // Expect a successful response with the same user data
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            id: 123123,
            first_name: 'mosh',
            last_name: 'israeli'
        });
    });

    test('GET /api/users returns array', async () => {
        // Insert one user first
        await request(app).post('/api/users').send({ id: 1, first_name: 'a', last_name: 'b', birthday: '2000-01-01' });

        // Fetch all users
        const res = await request(app).get('/api/users');

        // Validate response: status 200 and body is an array with length 1
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
    });

    test('GET /api/users/:id returns user + total', async () => {
        // Insert a user with id 5
        await request(app).post('/api/users').send({ id: 5, first_name: 'x', last_name: 'y', birthday: '2000-01-01' });

        // Fetch that user by id
        const res = await request(app).get('/api/users/5');

        // Expect the correct user details and total costs (0 by default)
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: 5, first_name: 'x', last_name: 'y', total: 0 });
    });
});
