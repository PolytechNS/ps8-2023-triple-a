const mongoDBConnection = require('../mongoConnection');
const {MongoClient} = require("mongodb");

async function manageRequest(request, response) {
    console.log("in manageRequest in game.js")

    const MongoClient = require('mongodb').MongoClient;

    const url = 'mongodb://admin:admin@mongodb/admin?directConnection=true';
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    let filePath = request.url.split("/").filter(function (elem) {
        return elem !== "..";
    });

    if (request.method === 'POST') {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        if (filePath[3] == null) {
            request.on('end', async function () {
                const gameData = JSON.parse(body);
                try {
                    await client.connect();
                    console.log('Connected to MongoDB');
                    const db = client.db("connect4");
                    const collection = db.collection("games");
                    const valueToFind = {
                        gameType: gameData.gameType,
                        userToken: gameData.token
                    };
                    const item = await collection.findOne(valueToFind);
                    if (item != null) {
                        console.log("Game state already exists for user");
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify({ status: 'failure' }));
                    }
                    else {
                        const result = await collection.insertOne(gameData);
                        console.log('Document inserted', result.insertedId);
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify({ status: 'success' }));
                    }
                } catch (err) {
                    console.error('Failed to insert document', err);
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ status: 'failure' }));
                } finally {
                    await client.close();
                }
            });
        } else if (filePath[3] === "retrieve") {
            request.on('end', function () {
                let currentUser = JSON.parse(body);
                let userInfo = {
                    userToken: currentUser.token,
                }
                mongoDBConnection.findEverythingInDataBase(response, userInfo, "games");
                console.log(currentUser.tab);
                console.log(currentUser);
                request.removeAllListeners();
            });
        }
        else if (filePath[3] === "load") {
            request.on('end', function () {
                let currentUser = JSON.parse(body);
                let userInfo = {
                    userToken: currentUser.token,
                }
                mongoDBConnection.findEverythingInDataBase(response, userInfo, "games");
                response.end(currentUser.tab);
                request.removeAllListeners();
            });
        }
        else if (filePath[3] === "resume") {
            request.on('end', async function() {
                let currentUser = JSON.parse(body);
                let userInfo = {
                    userToken: currentUser.token,
                }
                const game = await findOneInDataBase(userInfo, "games");
                if (game) {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(game));
                } else {
                    response.writeHead(404, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({status: 'failure', message: 'No game found for user'}));
                }
                request.removeAllListeners();
            });
        }
    }
}
async function findOneInDataBase(query, collectionName) {
    const client = await MongoClient.connect('mongodb://admin:admin@mongodb/admin?directConnection=true', { useUnifiedTopology: true });
    const collection = client.db("connect4").collection(collectionName);
    const result = await collection.findOne(query);
    await client.close();
    return result;
}

exports.manage = manageRequest;
