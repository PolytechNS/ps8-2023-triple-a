const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://admin:admin@mongodb/admin?directConnection=true';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });


async function updateScore(winner,loser) {
    try {
        await client.connect();
        console.log('Connected to MongoDB in gamification process');
        const db = client.db('connect4');
        const collection = db.collection('log');

        const current = await collection.findOne(winner);
        const opponent = await collection.findOne(loser);


        if (current && opponent) {
            console.log(current);
            let winnerScore = current.score;
            let newScore = ( winnerScore + ((opponent.score / winnerScore)*10) ) ? winnerScore !== 0 : winnerScore + 10;
            let newWins = current.wins + 1;
            let newTotalGames = current.totalGames + 1;
            let newValues = { $set: { score: newScore, wins: newWins, totalGames: newTotalGames } };
            const result = await collection.updateOne(winner, newValues);

            let loserScore = opponent.score;
            let newLoserScore = ( loserScore - ((loserScore / current.score)*10) ) ? loserScore !== 0 : loserScore - 10;
            let newLoses = opponent.loses + 1;
            let newTotalGamesOp = opponent.totalGames + 1;
            let newLoserValues = { $set: { score: newLoserScore, loses : newLoses, totalGames : newTotalGamesOp } };
            const result2 = await collection.updateOne(loser, newLoserValues);


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
}

exports.updateScore = updateScore;