/**
 * tests/test_db.js
 * Test harness – spins up an in-memory MongoDB for isolated, fast Jest tests.
 * Provides connect/clear/close helpers used by all test suites.
 */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

async function connect() {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri, { dbName: 'costmanager_test' });
}

async function clear() {
    const collections = await mongoose.connection.db.collections();
    for (const c of collections) {
        await c.deleteMany({});
    }
}

async function close() {
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
}

module.exports = { connect, clear, close };
