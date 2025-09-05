/*
 * costs.test.js
 * Tests for POST /api/add when adding costs and validating input.
 */
const request = require('supertest');
const { connect, clear, close } = require('./test_db');

let app;

beforeAll(async () => {
    // Set NODE_ENV to test and connect to in-memory MongoDB
    process.env.NODE_ENV = 'test';
    await connect();
    // Load the Express app after DB connection
    app = require('../app');
});

afterEach(async () => {
    // Clear the database after each test for isolation
    await clear();
});

afterAll(async () => {
    // Close DB connection and stop in-memory MongoDB
    await close();
});

describe('Costs API', () => {
    test('POST /api/add adds a cost', async () => {
        // Create a user first
        await request(app).post('/api/users').send({ id: 123123, first_name: 'mosh', last_name: 'israeli', birthday: '1990-01-01' });

        // Add a cost for that user
        const res = await request(app)
            .post('/api/add')
            .send({ userid: 123123, description: 'milk', category: 'food', sum: 8 });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ userid: 123123, description: 'milk', category: 'food', sum: 8 });

        // Verify user total is updated
        const userRes = await request(app).get('/api/users/123123');
        expect(userRes.body.total).toBe(8);
    });

    test('rejects invalid category', async () => {
        await request(app).post('/api/users').send({ id: 1, first_name: 'a', last_name: 'b', birthday: '2000-01-01' });
        const res = await request(app)
            .post('/api/add')
            .send({ userid: 1, description: 'x', category: 'invalid', sum: 10 });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('invalid_category');
    });
});
