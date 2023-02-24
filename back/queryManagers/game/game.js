const mongoDBConnection = require('../mongoConnection');

function manageRequest(request, response) {
    console.log("in manageRequest in game.js")

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
            request.on('end', function () {
                mongoDBConnection.createInDataBase(response, JSON.parse(body), "games");
            });
        } else if (filePath[3] === "retrieve") {
            request.on('end', function () {
                let currentUser = JSON.parse(body);
                let userInfo = {
                    userToken: currentUser.token,
                }
                mongoDBConnection.findEverythingInDataBase(response, userInfo, "games");

            });
        }
        else if ( filePath[3] === "load"){
            request.on('end', function () {
                let currentUser = JSON.parse(body);
                let userInfo = {
                    userToken: currentUser.token,
                }
                mongoDBConnection.findEverythingInDataBase(response, userInfo, "games");
                response.end(currentUser.tab);

            });

        }

    } 
    /**
    else if (request.method === 'GET') {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        response.end("Hello zebi");
        if (filePath[3] === "retrieve") {
            request.on('end', function () {
                let currentUser = JSON.parse(body);
                let userInfo = {
                    userToken: currentUser.token,
                }
                mongoDBConnection.findEverythingInDataBase(response, userInfo, "games");
                response.end(currentUser.tab);
            });
        }
    }
    */
}

exports.manage = manageRequest;
