/**
 * reports.test.js
 * Covers: GET /api/report structure and categories
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

describe('Reports API', () => {
    test('GET /api/report returns grouped categories structure', async () => {
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

        const cats = res.body.costs.map(o => Object.keys(o)[0]);
        expect(cats.sort()).toEqual(['education','food','health','housing','sports'].sort());
    });
});
