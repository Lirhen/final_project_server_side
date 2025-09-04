/**
 * @file tests/test_db.js
 * @description Helpers for in-memory MongoDB in Jest tests.
 * @module tests/test_db
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
