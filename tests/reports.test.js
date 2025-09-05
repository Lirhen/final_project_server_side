/*
 * reports.test.js
 * Tests for GET /api/report – validates grouped structure and categories.
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

describe('Reports API', () => {
    test('GET /api/report returns grouped categories structure', async () => {
        // Create a user and cost in the current month
        await request(app).post('/api/users').send({ id: 10, first_name: 'a', last_name: 'b', birthday: '2000-01-01' });

        await request(app).post('/api/add').send({ userid: 10, description: 'milk', category: 'food', sum: 12 });

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const res = await request(app).get(`/api/report?id=10&year=${year}&month=${month}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('userid', 10);
        expect(res.body).toHaveProperty('year', year);
        expect(res.body).toHaveProperty('month', month);
        expect(Array.isArray(res.body.costs)).toBe(true);

        // Validate the categories array contains all five categories
        const cats = res.body.costs.map(o => Object.keys(o)[0]);
        expect(cats.sort()).toEqual(['education','food','health','housing','sports'].sort());
    });
});
