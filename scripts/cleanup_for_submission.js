const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Cost = require('../models/Cost');
const Log = require('../models/Log');

async function run() {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing');
    await mongoose.connect(process.env.MONGO_URI, { dbName: undefined }); // אם יש שם DB ב-URI, זה מספיק
    console.log('Connected to', mongoose.connection.name);

    const reports = mongoose.connection.collection('reports_cache');

    await Promise.all([
        Cost.deleteMany({}),
        Log.deleteMany({}),
        reports.deleteMany({})
    ]);

    await User.deleteMany({ id: { $ne: 123123 } });
    await User.updateOne(
        { id: 123123 },
        { $set: { id: 123123, first_name: 'mosh', last_name: 'israeli', birthday: new Date('1990-01-01') } },
        { upsert: true }
    );

    console.log('Cleanup done.');
    await mongoose.connection.close();
}

run().catch(e => { console.error(e); process.exit(1); });
