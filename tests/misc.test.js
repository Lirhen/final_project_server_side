/*
 * misc.test.js
 * Tests for /api/about and /api/logs endpoints.
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

describe('About & Logs', () => {
    test('GET /api/about returns array of names', async () => {
        // Send GET request to /api/about
        const res = await request(app).get('/api/about');

        // Validate response: status 200 and array of objects with first_name, last_name
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        if (res.body.length) {
            expect(res.body[0]).toHaveProperty('first_name');
            expect(res.body[0]).toHaveProperty('last_name');
        }
    });

    test('GET /api/logs returns logs after a request', async () => {
        // Trigger a request so it will be logged
        await request(app).get('/health');

        // Now query /api/logs and expect an array of logs
        const res = await request(app).get('/api/logs');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
