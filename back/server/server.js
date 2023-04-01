const { response } = require("express");
const http = require("http");
const app = require("express")();


const filePath =  require("path").join(__dirname, '..' , '..' , 'front' , 'playOneVsOne' , 'index.html');
app.get("/", (req, res) => res.sendFile(filePath));

app.listen(9091, () => console.log("Listening on port 9091 ..."));
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Server is running ..."));

// Hashmap to store all the clients connected to the server
const clients = { }
// Hashmap to store all the created games
let games = { }
let referee = { }
let tokenAndClientId = {}
let usernameAndClientId = {}


var playerRed = "RED";
var playerYellow = "YELLOW";

const wsServer = new websocketServer({
    "httpServer": httpServer
});

var rows = 6;
var columns = 7;
// Function to create an empty board
function emptyBoard() {
    const board = [];
    for (let i = 0; i  < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] = ' ';
        }
    }
    return board;
}

let availableGames = {};

function updateAvailableRooms() {
    for (const g of Object.keys(games)) {
        const game = games[g];
        if (game.clients.length <= 1) {
            availableGames[games[g].id] = {
                "gameId": games[g].id,
            };
        } 
        else {
        }
    }
}


wsServer.on("request", request => {
    // Connect event : When a client connects to the server
    const connection = request.accept(null, request.origin);
    // Once connected what to do depending to the following
    connection.on("open", () => console.log("Opened"));
    
    connection.on("close", () => {
        // Display the number of clients connected to the server
        console.log(" -> ", usernameAndClientId[clientId], " has been disconnected !!");
        // Remove the client from the clients hashmap
        delete clients[clientId];
        console.log(" ");
        console.log("▲ Number of Online clients : " + Object.keys(clients).length);
        console.log(" ");
    
        // Remove client from all games they are connected to
        for (const gameId of Object.keys(games)) {
            const game = games[gameId];
            const index = game.clients.findIndex(c => c.clientId === clientId);
            if (index >= 0) {
                // Remove client from the game
                game.clients.splice(index, 1);
                // console.log(`Client ${clientId} removed from game ${gameId}`);
                // If game has no clients left, remove it from the games object
                if (game.clients.length === 0) {
                    // console.log(`Game ${gameId} has no clients left, removing from games`);
                    delete games[gameId];
                }
            }
        }
        // delete the client from the referee
        delete referee[clientId];
    });    
    
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data);
        // I, the server, have received a message from the client
        // A user wants to create a new game

        if ( result.method === "connect" ) {
            // Check if tokenAndClientId contains already the token
            if ( !tokenAndClientId[result.token] ) {
                let clientId = result.oldClientId;
                tokenAndClientId[clientId] = result.token;
                usernameAndClientId[clientId] = result.username;
                console.log(" -> With username : " + result.username);
            }
        }

        if (result.method === "createGame") {
            const clientId = result.clientId;
            let gameId = null;

            updateAvailableRooms();

            if ( Object.keys(availableGames).length === 0 ) {
                gameId = generateId();
                let gameBoard = emptyBoard();
                games[gameId] = {
                    "id": gameId,
                    "gameState": gameBoard,
                    "clients": [],
                    "over": false,
                }
            }

            else {
                // retrieve the first available game
                let firstValue = Object.values(availableGames)[0];
                gameId = firstValue.gameId;

                // remove it from the available games

                games[gameId] = {
                    "id": gameId,
                    "gameState": games[gameId].gameState,
                    "clients": games[gameId].clients,
                    "over": false,
                }               
            }

            // Send back the payLoad to the client
            const payLoad = {
                "method": "createGame",
                "game": games[gameId],
                "clients": games[gameId].clients,
            }

            // si le nombre de clients est 1
            if ( games[gameId].clients.length === 0 ) {
                console.log(" ° ", usernameAndClientId[clientId], "is opening the room : " + gameId);
            }
            else {
                console.log(" ° ", usernameAndClientId[clientId], "is joining the room : " + gameId);
                console.log(" ");
            }

            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));

            // display the game clients number
            // console.log("Game ID : " + gameId + " has " + games[gameId].clients.length + " clients");
        }

        // recuve YOYO from the client
        if (result.method === "chat") {
            const clientId = result.clientId;
            const gameId = result.gameId;
            const message = result.text;

            // Send this message to the other client
            const game = games[gameId];
            const otherClient = game.clients.find(c => c.clientId !== clientId);
            const con = clients[otherClient.clientId].connection;

            const payLoad = {
                "method": "chat",
                "text": message,
                "clientId": clientId,
                "gameId": gameId,
            }
            con.send(JSON.stringify(payLoad));
        }
        
        // A client want to join a game
        if ( result.method === "joinGame" ) {
            const clientId = result.clientId;
            const gameId = result.gameId;
            // Extract the game state from the games hashmap
            const game = games[gameId];
 
            //The first player to join will be RED
            if (game.clients.length === 0) {
                game.clients.push({
                    "clientId": clientId,
                    "color": playerRed,
                });
            }

            //The second player to join will be YELLOW
            else if (game.clients.length === 1) {
                // Check if the player is not already in the game
                if (game.clients[0].clientId === clientId) {
                    return;
                }
                game.clients.push({
                    "clientId": clientId,
                    "color": playerYellow,
                });
            }

            // Start the game when we have 2 players
            if (game.clients.length === 2 && game.over != true) {
                updateGameState();
            }
            

            // console.log("");
            // console.log("Game :", gameId, "has", games[gameId].clients.length, "clients");
            // console.log("");

            games[gameId] =  { 
                "id": gameId,
                "gameState": games[gameId].gameState,
                "clients": games[gameId].clients,
                "over": false,
            }
            
            for (const g of Object.keys(availableGames)) {
                if ( availableGames[g].gameId === gameId && game.clients.length === 2 ) {
                    delete availableGames[g];
                }
            }

            const payLoad = {
                "method": "joinGame",
                "game": game,
                "state": game.gameState,
                "clients": game.clients,
            }

            // Add the client with it turn set to false to the referee
            // check the length of the clients in the gameId
            if ( games[gameId].clients.length < 2 ) {
                // Send the game state to the referee
                referee[clientId] = {
                    "clientId": clientId,
                    "turn": false,
                }
            }
            else {
                referee[clientId] = {
                    "clientId": clientId,
                    "turn": true,
                }
            }

            // Tell the player who already exits in the room that another one has just joined
            game.clients.forEach(client => {
                clients[client.clientId].connection.send(JSON.stringify(payLoad));
            });
        }
 
        // A client wants to play 
        if (result.method === "play") {
            // check if the client's turn is true
            if ( referee[clientId].turn === true ) {
                const gameId = result.gameId;
                const row = result.row;
                const column = result.column;
                const color = result.color;
                const clientId = result.clientId;
                let oldState = games[gameId].gameState; 
                if ( !oldState ) oldState = emptyBoard();
                // Update the game State
                oldState[row][column] = color;
                // Send back the new state to the clients
                games[gameId].gameState = oldState;
                console.log(" ⬪ ", usernameAndClientId[clientId], " wants to play : [", row, " , ", column, "] | color : ", color);
                // He played so it's not his turn anymore
                referee[clientId].turn = false;
                // Set the other player turn to true
                for (const client of games[gameId].clients) {
                    if ( client.clientId !== clientId ) {
                        referee[client.clientId].turn = true;
                    }
                }
            }
            else {
                // send back a message to the client
                const payLoad = {
                    "method": "illegalMove",
                    "message": "Illegal move",
                }
                clients[clientId].connection.send(JSON.stringify(payLoad));
            }
            updateGameState();
        }

    });

    console.log(" ");
    let clientId = generateId();
    clients[clientId] = {
        "connection": connection
    }
    console.log(" -> A New client with ID : " + clientId + " has been connected !");
    const payLoad = {
        "method": "connect",
        "clientId": clientId,
        "games": games,
    };

    connection.send(JSON.stringify(payLoad));
    
});


function updateGameState() {
    for (const g of Object.keys(games)) {
        if ( games[g].over !== true ) {
            const game = games[g];
            let winner = null;

            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 7; j++) {
                    if (game.gameState[i][j] === playerRed) {
                        if (j < 4) {
                            if (game.gameState[i][j + 1] === playerRed && game.gameState[i][j + 2] === playerRed && game.gameState[i][j + 3] === playerRed) {
                                winner = playerRed;
                            }
                        }
                        if (i < 3) {
                            if (game.gameState[i + 1][j] === playerRed && game.gameState[i + 2][j] === playerRed && game.gameState[i + 3][j] === playerRed) {
                                winner = playerRed;
                            }
                            if (j < 4) {
                                if (game.gameState[i + 1][j + 1] === playerRed && game.gameState[i + 2][j + 2] === playerRed && game.gameState[i + 3][j + 3] === playerRed) {
                                    winner = playerRed;
                                }
                            }
                            if (j > 2) {
                                if (game.gameState[i + 1][j - 1] === playerRed && game.gameState[i + 2][j - 2] === playerRed && game.gameState[i + 3][j - 3] === playerRed) {
                                    winner = playerRed;
                                }
                            }
                        }
                    }
                    if (game.gameState[i][j] === playerYellow) {
                        if (j < 4) {
                            if (game.gameState[i][j + 1] === playerYellow && game.gameState[i][j + 2] === playerYellow && game.gameState[i][j + 3] === playerYellow) {
                                winner = playerYellow;
                            }
                        }
                        if (i < 3) {
                            if (game.gameState[i + 1][j] === playerYellow && game.gameState[i + 2][j] === playerYellow && game.gameState[i + 3][j] === playerYellow) {
                                winner = playerYellow;
                            }
                            if (j < 4) {
        
                                if (game.gameState[i + 1][j + 1] === playerYellow && game.gameState[i + 2][j + 2] === playerYellow && game.gameState[i + 3][j + 3] === playerYellow) {
                                    winner = playerYellow;
                                }
                            }
                            if (j > 2) {
                                if (game.gameState[i + 1][j - 1] === playerYellow && game.gameState[i + 2][j - 2] === playerYellow && game.gameState[i + 3][j - 3] === playerYellow) {
                                    winner = playerYellow;
                                }
                            }
                        }
                    }
                }
            }

            if ( winner === playerRed ) {
                winner = game.clients[0].clientId;
            }
            else if ( winner === playerYellow ) {
                winner = game.clients[1].clientId;
            }

            if ( winner != null ) {
                console.log(" ");
                console.log(" ♣ The winner is : ", usernameAndClientId[winner]);
                console.log(" ");
                //retreive the token of the loser
                let loser = null;
                for (const client of game.clients) {
                    if ( client.clientId !== winner ) {
                        loser = client.clientId;
                    }
                }
                // gamification.updateScore(tokenAndClientId[winner], tokenAndClientId[loser])
                //             .then(() => console.log("Score updated !"));

                // Reset the game state
                // Reset the referee
                for (const client of game.clients) {
                    referee[client.clientId].turn = false;
                }
                // Set the over attribute to true
                games[g].over = true;
            }

            //get the loser token
            let loser = null;
            for (const client of game.clients) {
                if ( client.clientId !== winner ) {
                    loser = client.clientId;
                }

            }
            const payLoad = {
                "method": "updateGameState",
                "winnerToken": tokenAndClientId[winner],
                "loserToken": tokenAndClientId[loser],
                "game": game,
                "winner": winner,
            }

            game.clients.forEach(client => {
                clients[client.clientId].connection.send(JSON.stringify(payLoad))
            });

        }
    }
    setTimeout(updateGameState, 300);
}


function generateId() { 
    let result = '';
    const characters = 'XUV';
    for (let i = 0; i < 3; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    // check if the id already exists
    if (games[result]) return generateId();
    return result + Math.floor(Math.random() * 1000);
}