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
const games = { }

const wsServer = new websocketServer({
    "httpServer": httpServer
});

var rows = 6;
var columns = 7;
// Function to create an empty board
function emptyBoard() {
    const board = [];
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] = ' ';
        }
    }
    return board;
}

wsServer.on("request", request => {
    // Connect event : When a client connects to the server
    const connection = request.accept(null, request.origin);
    // Once connected what to do depending to the following
    connection.on("open", () => console.log("Opened"));
    connection.on("close", () => console.log("Closed"));
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data);
        // I the server received a message from the client
        // A user wants to create a new game
        if (result.method === "createGame") {
            const clientId = result.clientId;
            const gameId = generateId();
            let gameBoard = emptyBoard();
            games[gameId] = {
                "id": gameId,
                "gameState": gameBoard,
                "clients": []
            }
            // Send back the payLoad to the client
            const payLoad = {
                "method": "createGame",
                "game": games[gameId]
            }

            console.log("Game created with ID : " + gameId);

            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }

        // A client want to join a game
        if ( result.method === "joinGame" ) {
            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            // if (game.clients.length >= 2) {
            //     // Sorry max players reached
            //     return;
            // }
            const color = {"0": "Yellow", "1": "Red"}[game.clients.length]
            game.clients.push({
                "clientId": clientId,
                "color": color
            })

            // Start the game when we have 2 players
            // if (game.clients.length === 2) updateGameState();
            updateGameState();

            const payLoad = {
                "method": "joinGame",
                "game": game
            }

            // Tell the player that already exits in the room that some people joined has just joined
            game.clients.forEach(client => {
                clients[client.clientId].connection.send(JSON.stringify(payLoad));
            });
        }

        // A client wants to play
        if (result.method === "play") {
            const gameId = result.gameId;
            const row = result.row;
            const column = result.column;

            let oldState = games[gameId].gameState;
            if ( !oldState )  oldState = emptyBoard();

            // Update the game State
            oldState[row][column] = result.color;
            // Send back the new state to the clients
            games[gameId].gameState = oldState;
        }
    });

    // Generate a new clientID
    const clientId = generateId();
    clients[clientId] = {
        "connection": connection
    }
    console.log("A New client with ID : " + clientId + " has been connected !");

    // Send back this info to the client
    const payLoad = {
        "method": "connect",
        "clientId": clientId,
        "games": games,
    };

    connection.send(JSON.stringify(payLoad));
});

function updateGameState() {
    for (const g of Object.keys(games)) {
        const game = games[g];
        const payLoad = {
            "method": "updateGameState",
            "game": game,
        }
        game.clients.forEach(client => {
            clients[client.clientId].connection.send(JSON.stringify(payLoad))
        });
    }
    setTimeout(updateGameState, 300);
}

function generateId() {
    let result = '';
    const characters = 'XUV';
    for (let i = 0; i < 3; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result + Math.floor(Math.random() * 1000);
}

function displayAll() {
    let i = 0;
    for (const g of Object.keys(games)) {
        console.log("--- Game Number : " + i++ + " ---");
        console.log("Game ID : " + games[g].id);
        console.log("Game State : ");
        console.table(games[g].gameState);
        console.log("Clients : ");
        console.table(games[g].clients);
    }
}

// setInterval(displayAll, 5000);
