const mongoDBConnection = require('../mongoConnection');

function manageRequest(request, response) {

    if (request.method === 'POST') {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
            let currentUser = JSON.parse(body);
            let userInfo = {
                username: currentUser.username,
                password: currentUser.password,
            };
            mongoDBConnection.findInDataBase(response, userInfo, "log");
        });
    }
    else if (request.method === 'OPTIONS') {
        response.setHeader('Access-Control-Allow-Origin', '*');
        // Request methods you wish to allow.
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow.
        response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // Set to true if you need the website to include cookies in the requests sent to the API.
        response.setHeader('Access-Control-Allow-Credentials', true);
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        response.setHeader("Access-Control-Allow-Headers", "authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

        response.writeHead(200);
        response.end();


    }

    
    else {
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }

}


exports.manage = manageRequest;
