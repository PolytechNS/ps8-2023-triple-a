const mongoDBConnection = require('../mongoConnection');
const {MongoClient, ObjectId} = require("mongodb");

async function manageRequest(request, response) {
    console.log("in manageRequest in online.js");

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

        if (filePath[3] === "winner") {
            request.on('end', async function () {
                const data = JSON.parse(body);

                try {
                    console.log("before connecting to mongo")
                    await client.connect();
                    console.log('Connected to MongoDB in gamification process');
                    const db = client.db('connect4');
                    const collection = db.collection('log');

                    const current = await collection.findOne({token : data.token});


                    if (current) {
                        console.log(current);
                        let winnerScore = current.score;
                        let newScore = (winnerScore + ((opponent.score / winnerScore) * 10)) ? winnerScore !== 0 : winnerScore + 10;
                        let newWins = current.wins + 1;
                        let newTotalGames = current.totalGames + 1;
                        let newValues = {$set: {score: newScore, wins: newWins, totalGames: newTotalGames}};
                        const result = await collection.updateOne({token: data.token}, newValues);


                        if (result) {
                            console.log('Updated score for winner');
                            response.writeHead(200, {'Content-Type': 'application/json'});
                            response.end(JSON.stringify({status: 'success'}));
                        } else {
                            console.log('Something went wrong in the GAMIFICATION update..');

                        }

                    } else {
                        console.log('current or opponent not found..');
                    }
                } catch (err) {
                    console.error('Failed to connect to db', err);
                }
            });
        }
        if(filePath[3] === "data"){
            request.on('end', async function () {
                const data = JSON.parse(body);
                try {
                    console.log("before connecting to mongo")
                    await client.connect();
                    console.log('Connected to MongoDB in gamification process');
                    const db = client.db('connect4');
                    const collection = db.collection('log');

                    const current = await collection.findOne({token : data.token});
                    if(current){
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({status: 'success', data: current}));
                    }
                    else {
                    console.log('Something went wrong in the GAMIFICATION update..');

                    }

               
            
        } catch (err) {
            console.error('Failed to connect to db', err);
        }
    });
        }

        if(filePath[3] === "updateScore"){
            request.on('end', async function () {
                const data = JSON.parse(body);

                try {
                    console.log("before connecting to mongo")
                    await client.connect();
                    console.log('Connected to MongoDB in gamification process');
                    const db = client.db('connect4');
                    const collection = db.collection('log');

                    const current = await collection.findOne({token : data.winner});
                    const opponent = await collection.findOne({token : data.loser});


                    if (current && opponent) {
                        console.log(current);
                        let winnerScore = current.score;
                        // let newScore = winnerScore !== 0 ? ( winnerScore + ((opponent.score / winnerScore)*10) ) : winnerScore + 10;
                         let newScore =  winnerScore + 10;

                        newScore = newScore < 0 ? 0 : newScore;

                        let newWins = current.wins + 1;
                        let newTotalGames = current.totalGames + 1;
                        let newValues = { $set: { score: newScore, wins: newWins, totalGames: newTotalGames } };
                        const result = await collection.updateOne({token : data.winner}, newValues);

                        let loserScore = opponent.score;
                        // let newLoserScore =  loserScore !== 0 ? ( loserScore - ((loserScore / current.score)*10) ) : loserScore - 5;
                        let newLoserScore =   loserScore - 5;

                        newLoserScore = newLoserScore < 0 ? 0 : newLoserScore;
                        let newLoses = opponent.loses + 1;
                        let newTotalGamesOp = opponent.totalGames + 1;
                        let newLoserValues = { $set: { score: newLoserScore, loses : newLoses, totalGames : newTotalGamesOp } };
                        const result2 = await collection.updateOne({token : data.loser}, newLoserValues);


                        if(result && result2){
                            console.log('Updated score for winner');
                        }
                        else{
                            console.log('Something went wrong in the GAMIFICATION update..');
                        }

                    }
                    else{
                        console.log('current or opponent not found..');
                    }
                } catch (err) {
                    console.error('Failed to connect to db', err);
                }
            });

        }
    }
}
exports.manage = manageRequest;
