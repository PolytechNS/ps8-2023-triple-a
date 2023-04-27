const mongoDBConnection = require('../mongoConnection');
const jwt = require('jsonwebtoken');


function generate_token(values){
    //edit the token allowed characters
    // var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    // var b = [];
    // for (var i=0; i<length; i++) {
    //     var j = (Math.random() * (a.length-1)).toFixed(0);
    //     b[i] = a[j];
    // }
    // return b.join("");
    //return a jwt token
    return  jwt.sign(values, 'secret_key', { expiresIn: '1h' });


}

function manageRequest(request, response) {
    if (request.method==='POST'){
        let body='';
        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
            const values = JSON.parse(body);
            const valueToInsert={username:values.username,
                password:values.password,
                email:values.email,
                token:generate_token({ username: values.username }),
                friends:[],
                friendRequests:[],
                totalGames:0,
                score:0,
                wins:0,
                loses:0,
                draws:0
            };
            const valueToCheck = {
                username:values.username,
                password:values.password,
                }
            mongoDBConnection.createInDataBase(response,valueToInsert,"log",valueToCheck);
        });
    }
    else if (request.method === 'OPTIONS') {

        response.writeHead(200);
        response.end();

    }
    else {
        response.statusCode = 400;
        response.end("Something in your request (${request.url}) is strange...");
    }
}

exports.manage = manageRequest;