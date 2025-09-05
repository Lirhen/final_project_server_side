/*
 * tests/test_db.js
 * Test harness using mongodb-memory-server for isolated Jest tests.
 */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

async function connect() {
    // Boot ephemeral in-memory MongoDB
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri, { dbName: 'costmanager_test' });
}

async function clear() {
    // Remove all documents between tests to keep isolation
    const collections = await mongoose.connection.db.collections();
    for (const c of collections) {
        await c.deleteMany({});
    }
}

async function close() {
    // Close connections and stop the in-memory server
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
}

module.exports = { connect, clear, close };
