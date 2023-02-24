const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://admin:admin@mongodb/admin?directConnection=true';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });


async function findInDataBase(response, currentUser, collectionName) {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('connect4');
        const collection = db.collection(collectionName);
        console.log(currentUser);
        const item = await collection.findOne(currentUser);

        if (item) {
            console.log(item);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(item));
        } else {
            console.log('Invalid username or password');
            response.writeHead(401, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Invalid username or password' }));
        }
    } catch (err) {
        console.error('Failed to create database or user', err);
        response.status(500).send('Internal server error.');
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Internal server error' }));
    } finally {
        await client.close();
    }
}

async function createInDataBase(response,valueToFind,collectionName,verifValue) {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db("connect4");
        //await db.addUser("admin", "admin", {roles: [{role: "readWrite", db: "connect4"}]});
        const collection = db.collection(collectionName);
        const item = await collection.findOne(verifValue);
        if (item!=null) {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({status: 'failure'}));
        }
        else{
            const result = await collection.insertOne(valueToFind);
            console.log('Document inserted', result.insertedId);
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({ status: 'success' }));
        }
    } catch (err) {
        console.error('Failed to create database or user', err);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ status: 'failure' }));
    } finally {
        await client.close();
    }
}

async function findEverythingInDataBase(response,valueToFind,collectionName){
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db("connect4");
        //await db.addUser("admin", "admin", {roles: [{role: "readWrite", db: "connect4"}]});
        const collection = db.collection(collectionName);
        const items = await collection.find(valueToFind).toArray();
        console.log(items);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(items));
    } catch (err) {
        console.error('Failed to create database or user', err);
        response.writeHead(400, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ status: 'failure' }));
    } finally {
        await client.close();
    }
}

exports.findInDataBase = findInDataBase;
exports.createInDataBase= createInDataBase;
exports.findEverythingInDataBase= findEverythingInDataBase;