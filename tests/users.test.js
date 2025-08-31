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

describe('Users API', () => {
    test('POST /api/users creates a user', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ id: 123123, first_name: 'mosh', last_name: 'israeli', birthday: '1990-01-01' });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            id: 123123,
            first_name: 'mosh',
            last_name: 'israeli'
        });
    });

    test('GET /api/users returns array', async () => {
        await request(app).post('/api/users').send({ id: 1, first_name: 'a', last_name: 'b', birthday: '2000-01-01' });
        const res = await request(app).get('/api/users');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
    });

    test('GET /api/users/:id returns user + total', async () => {
        await request(app).post('/api/users').send({ id: 5, first_name: 'x', last_name: 'y', birthday: '2000-01-01' });
        const res = await request(app).get('/api/users/5');
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: 5, first_name: 'x', last_name: 'y', total: 0 });
    });
});
