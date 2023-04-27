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

        response.writeHead(200);
        response.end();


    }

    
    else {
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }

}


exports.manage = manageRequest;
