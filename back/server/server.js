const { Console } = require("console");
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
    for (let i = 0; i < rows; i++) {
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
            console.log("No available rooms !!");
        }
    }
    for (const g of Object.keys(availableGames)) {
        console.log("Game ID : " + availableGames[g].gameId + " available to join !!");
    }
}

wsServer.on("request", request => {
    // Connect event : When a client connects to the server
    const connection = request.accept(null, request.origin);
    // Once connected what to do depending to the following
    connection.on("open", () => console.log("Opened"));
    connection.on("close", () => console.log("Closed"));
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data);
        // I, the server, have received a message from the client
        // A user wants to create a new game
        if (result.method === "createGame") {
            const clientId = result.clientId;
            let gameId = null;

            updateAvailableRooms();
            console.log(" TEST : ", Object.keys(availableGames).length)

            if ( Object.keys(availableGames).length === 0 ) {
                gameId = generateId();
                let gameBoard = emptyBoard();
                games[gameId] = {
                    "id": gameId,
                    "gameState": gameBoard,
                    "clients": [],
                }
            }

            else {
                // retrive the first available game
                let firstValue = Object.values(availableGames)[0];
                gameId = firstValue.gameId;

                // remove it from the available games

                games[gameId] = {
                    "id": gameId,
                    "gameState": games[gameId].gameState,
                    "clients": games[gameId].clients,
                }               
            }

            // Send back the payLoad to the client
            const payLoad = {
                "method": "createGame",
                "game": games[gameId]
            }

            console.log("Game created with ID : " + gameId);

            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));

            // display the game clients number
            console.log("Game ID : " + gameId + " has " + games[gameId].clients.length + " clients");

        }

        // A client want to join a game
        if ( result.method === "joinGame" ) {
            const clientId = result.clientId;
            const gameId = result.gameId;
            // Extract the game state from the games hashmap
            const game = games[gameId];
            const color = null;
 
            //The first player to join will be RED
            if (game.clients.length === 0) {
                game.clients.push({
                    "clientId": clientId,
                    "color": playerRed,
                });
            }

            //The second player to join will be YELLOW
            else if (game.clients.length === 1) {
                game.clients.push({
                    "clientId": clientId,
                    "color": playerYellow,
                });
            }

            // Start the game when we have 2 players
            if (game.clients.length === 2) updateGameState();
            // updateGameState();

            // let firstValue = Object.values(availableGames)[0];

            console.log("");
            console.log("Game :", gameId, "has", games[gameId].clients.length, "clients");
            console.log("");

            games[gameId] = {
                "id": gameId,
                "gameState": games[gameId].gameState,
                "clients": games[gameId].clients,
            }
            
            // iterate 
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

            // Tell the player who already exits in the room that another one has just joined
            game.clients.forEach(client => {
                clients[client.clientId].connection.send(JSON.stringify(payLoad));
            });
        }

        // A client wants to play
        if (result.method === "play") {
            console.log("A client wants to play");
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
        // console.log("FROM Server : game state : ", game.gameState[0])
        game.clients.forEach(client => {
            clients[client.clientId].connection.send(JSON.stringify(payLoad))
        });
    }

    setTimeout(updateGameState, 300);
}

function gamesDetails() {
    let i = 0;
    for ( let key in games ) {
        console.log("--- Game Number : " + (i + 1) + " ---");
        console.log("--- Game ID : ", games[key].id);
        // console.log("Game State : ", games[key].gameState);
        console.log("Clients : ", games[key].clients);
    }
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

function displayAll() {
    let i = 0;
    console.log(" ");
    console.log("number of games     : ", Object.keys(games).length);
    for (const g of Object.keys(games)) {
        console.log("--- Game Number : " + i++ + " ---");
        console.log("Game ID : " + games[g].id);
        console.log("Game State : ");
        console.table(games[g].gameState);
        console.log("Clients : ");
        console.table(games[g].clients);
    }
}

// setInterval(displayAll, 7000);
