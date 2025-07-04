//connect to db
//retrieve db connection once connected

const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;
let client;

module.exports = {
    connectToDb: async () => {
        try{
            client = await MongoClient.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@tutyocluster.okwwnss.mongodb.net/`);
            db = client.db('User')
            return db;
        }
        catch(err){
            console.error('Failed to connect to the database', err);
            throw err;
        }
    },
    getDb: () => {
        if (!db) throw new Error('Database not connected');
        return db;      
    },
    closeConnection: async () => {
        if (client) {
            await client.close();
            db = null;
            client = null;
            console.log('Database connection closed');
        }
    }
};


