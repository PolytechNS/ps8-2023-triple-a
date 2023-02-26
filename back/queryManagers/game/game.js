const mongoDBConnection = require('../mongoConnection');
const {MongoClient, ObjectId} = require("mongodb");

 async function manageRequest(request, response) {
     console.log("in manageRequest in game.js");

     const MongoClient = require('mongodb').MongoClient;

     const url = 'mongodb://admin:admin@mongodb/admin?directConnection=true';
     const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

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
                         response.writeHead(200, {'Content-Type': 'application/json'});
                         response.end(JSON.stringify({status: 'failure'}));
                     } else {
                         const result = await collection.insertOne(gameData);
                         console.log('Document inserted', result.insertedId);
                         response.writeHead(200, {'Content-Type': 'application/json'});
                         response.end(JSON.stringify({status: 'success'}));
                     }
                 } catch (err) {
                     console.error('Failed to insert document', err);
                     response.writeHead(200, {'Content-Type': 'application/json'});
                     response.end(JSON.stringify({status: 'failure'}));
                 } finally {
                     await client.close();
                 }
             });
         } else if (filePath[3] === "resume") {
             request.on('end', async function () {
                 let currentUser = JSON.parse(body);
                 let userInfo = {
                     userId: currentUser._id,
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
         } else if (filePath[3] === "retrieve") {
             request.on('end', async function () {
                 let currentUser = JSON.parse(body);
                 const id = new ObjectId(currentUser._id);
                 console.log("Received request to resume game with ID:", typeof currentUser._id);


                 try {
                     const client = await MongoClient.connect('mongodb://admin:admin@mongodb/admin?directConnection=true', {useUnifiedTopology: true});
                     const db = client.db('connect4');
                     console.log("Received request to resume game with ID:", currentUser._id);
                     const idString = currentUser._id.toString();
                     const game = await db.collection('games').findOne({_id: new ObjectId(currentUser._id)});

                     if (game) {
                         response.writeHead(200, {'Content-Type': 'application/json'});
                         console.log("Game found:", game);
                         response.end(JSON.stringify(game));
                     } else {
                         response.writeHead(404, {'Content-Type': 'application/json'});
                         response.end(JSON.stringify({status: 'failure', message: 'No game found with that ID'}));
                         console.log("No game found with ID:", currentUser._id);
                         console.log("user : ", currentUser);
                     }

                     await client.close();
                 } catch (error) {
                     console.error("Error occurred while retrieving game from database:", error);
                     response.writeHead(500, {'Content-Type': 'application/json'});
                     response.end(JSON.stringify({
                         status: 'failure',
                         message: 'Error occurred while retrieving game from database'
                     }));
                     console.log(error); // log the error message
                 }

                 request.removeAllListeners();
             });
         } else if (filePath[3] === "list") {
             request.on('end', async function () {
                 let currentUser = JSON.parse(body);
                 const games = await findAllInDataBase({userToken: currentUser.token}, "games");
                 if (games) {
                     response.writeHead(200, {'Content-Type': 'application/json'});
                     response.end(JSON.stringify(games));
                 } else {
                     response.writeHead(404, {'Content-Type': 'application/json'});
                     response.end(JSON.stringify({status: 'failure', message: 'No games found for user'}));
                 }
                 request.removeAllListeners();
             });
         } else if (filePath[3] === "delete") {
             request.on('end', async function () {
                 let currentUser = JSON.parse(body);

                 console.log("Received request to delete game with ID:",  currentUser._id);

                 try {
                     const client = await MongoClient.connect('mongodb://admin:admin@mongodb/admin?directConnection=true', {useUnifiedTopology: true});
                     const db = client.db('connect4');
                     console.log("Received request to delete game with ID:", currentUser._id);
                     const game = await db.collection('games').deleteOne({_id: new ObjectId(currentUser._id)});

                     if (game.deletedCount > 0) {
                         response.writeHead(200, {'Content-Type': 'application/json'});
                         response.end(JSON.stringify({status: 'success', message: 'Game deleted successfully'}));
                         console.log("Game deleted successfully:", game);
                     } else {
                         response.writeHead(404, {'Content-Type': 'application/json'});
                         response.end(JSON.stringify({status: 'failure', message: 'No game found with that ID'}));
                         console.log("No game found with ID");
                     }
                     await client.close();
                 } catch (error) {
                     console.error("Error occurred while retrieving game from database:", error);
                     response.writeHead(500, {'Content-Type': 'application/json'});
                     response.end(JSON.stringify({
                         status: 'failure',
                         message: 'Error occurred while retrieving game from database'
                     }));
                     console.log(error); // log the error message
                 }

                 request.removeAllListeners();
             });
         }
     }
 }

async function findOneInDataBase(data, collection) {
    try {
        const client = await MongoClient.connect('mongodb://admin:admin@mongodb/admin?directConnection=true', { useUnifiedTopology: true });
        const db = client.db('connect4');


        const result = await db.collection(collection).findOne({ _id: new ObjectId(data._id) });

        await client.close();
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}
async function findAllInDataBase(query, collectionName) {
    const client = await MongoClient.connect('mongodb://admin:admin@mongodb/admin?directConnection=true', { useUnifiedTopology: true });
    const collection = client.db("connect4").collection(collectionName);
    const result = await collection.find(query).toArray();
    await client.close();
    return result;
}

exports.manage = manageRequest;


