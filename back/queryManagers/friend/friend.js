const mongoDBConnection = require('../mongoConnection');
const {MongoClient, ObjectId} = require("mongodb");


async function manageRequest(request, response) {
    console.log("in friend manageRequest");

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
        if (filePath[3] === 'request'){
            console.log("im in request api")
            request.on('end', async function () {
                let currentUser = JSON.parse(body);
                let userInfo = {
                    userId: currentUser._id,
                    userAdderName : currentUser.username
                }
                const friend = await findOneInDataBase(userInfo, "log");
                if (friend != null) {

                    console.log("Friend request already exists for user");
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({status: 'failure'}));
                } else {
                    try {
                        await client.connect();
                        console.log('Connected to MongoDB');
                        const db = client.db("connect4");
                        const collection = db.collection("log");
                        //insert the username of the adder into field "friendRequests"
                        console.log("im about to send req")
                        console.log("current user ",currentUser._id);
                        console.log("username" ,currentUser.username);
                        const result = await collection.updateOne({_id: new ObjectId(currentUser._id)},
                            {$push: {
                                friendRequests: { name : currentUser.username,
                                                  token : currentUser.token
                                }}});

                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({status: 'success'}));
                    } catch (err) {
                        console.error('Failed to insert document', err);
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({status: 'failure'}));
                    } finally {
                        await client.close();
                    }
                }
            });

        }
        else if (filePath[3] === "requestList"){
            request.on('end', async function () {
                let currentUser = JSON.parse(body);
                await client.connect();
                console.log('Connected to MongoDB');
                const db = client.db("connect4");
                const collection = db.collection("log");

                // Find the user by token and retrieve their friend requests
                const user = await collection.findOne({token: currentUser.token});
                const friendRequests = user.friendRequests;
                if (friendRequests) {
                    console.log("im in the if for ok ,the name : ",friendRequests[0].name);
                    console.log("im in the if for ok ,the username : ",friendRequests[0].username);


                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(friendRequests));
                } else {
                    response.writeHead(404, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({status: 'failure', message: 'No games found for user'}));
                }
                request.removeAllListeners();
            })
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