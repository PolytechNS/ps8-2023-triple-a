const http = require("http");
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Server is running ..."));
// Hashmap to store all the clients connected to the server
const clients = { }
const wsServer = new websocketServer({
    "httpServer": httpServer
});

wsServer.on("request", request => {
    // Connect event : When a client connects to the server
    const connection = request.accept(null, request.origin);
    // Once connected what to do depending to the following
    connection.on("open", () => console.log("Opened"));
    connection.on("close", () => console.log("Closed"));
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data);
        // I the server received a message from the client
        console.log("Message received from client: " + result);
    });

    // Generate a new clientID
    const clientId = generateId();
    console.log("New client connected: " + clientId + " | Connection : " + connection);
    clients[clientId] = {
        "connection": connection
    };

    // Send back this info to the client
    const payLoad = {
        "method": "connect",
        "clientId": clientId
    };

    connection.send(JSON.stringify(payLoad));
});

function generateId() {
    return ((1+Math.random())*100).toString(36).substr(2, 9);
};