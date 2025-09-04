/**
 * misc.test.js
 * Covers: /api/about and /api/logs basic shape
 */
const request = require('supertest');
const { connect, clear, close } = require('./test_db');

let app;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connect();
    app = require('../app');
});

afterEach(async () => {
    await clear();
});

afterAll(async () => {
    await close();
});

describe('About & Logs', () => {
    test('GET /api/about returns array of names', async () => {
        const res = await request(app).get('/api/about');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        if (res.body.length) {
            expect(res.body[0]).toHaveProperty('first_name');
            expect(res.body[0]).toHaveProperty('last_name');
        }
    });

    test('GET /api/logs returns logs after a request', async () => {
        await request(app).get('/health');
        const res = await request(app).get('/api/logs');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
