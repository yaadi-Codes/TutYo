//connect to db
//retrieve db connection once connectedf

const { MongoClient } = require('mongodb');

let db;
module.exports = {
    connectToDb: async (cb) => {
    try{
        const client = await MongoClient.connect('mongodb://localhost:27017');
        db = client.db('User')
        return cb();
    }
    catch(err){
        console.error('Failed to connect to the database', err);
        return cb(err);
    }
},
    getDb: () => {
        if (db) return db;
        throw new Error('Database not connected');
    }
};
