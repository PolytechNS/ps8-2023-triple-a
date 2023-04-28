var playerRed = "RED";
var playerYellow = "YELLOW";
var playerToStart;
playerToStart = playerRed;

var currentPlayer = playerToStart;
var nextPlayer = null;

var gameOver = false;
var winner = null;
window.resume = false;

// Stoque la matrice du jeu dont les éléments sont, 
// si remplis, soit 'RED' soit 'YELLOW'
var boardMatrix;

// Stoque la matrice du jeu dont les éléments sont, 
// si remplis, sont les tiles du DOM
var boardGame;

var rows = 6;
var columns = 7;

const localHost = 'localhost';
const url = '44.201.141.34';
let localHostOrUrl = url;

function chooselocalHostOrUrl(l) {
if ( l == 2 ) {
  localHostOrUrl = localHost;
}
else if ( l == 1 ) {
  localHostOrUrl = url;
}
}

// 1 : URL | 2 : Localhost
chooselocalHostOrUrl(1);

window.onload = function() {
  setBoard();
}

let chatBox = document.getElementById("chat-box");

function setBoard() {
  boardGame = document.getElementById("board");
  boardMatrix = [];
  for (let r = 0; r < rows; r++) {
    boardMatrix[r] = [];
    for (let c = 0; c < columns; c++) {
      boardMatrix[r][c] = ' ';
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.classList.add("tile");
      boardGame.appendChild(tile);
      divv.style.visibility = "hidden";
    }
  }
  return boardGame;
}

function getTile(i, j) {
let target = document.getElementById(i.toString() + "-" + j.toString());;
return target;
}

const divv = document.getElementById("board");

function getAvailableCoordinates() {
  let availableCoordinates = [];
  for (let i = 0; i < boardGame.length; i++) {
    for (let j = 0; j < boardGame[i].length; j++) {
        if (boardGame[i][j] == ' ') {
            availableCoordinates.push([i, j]);
        }
    }
  }
  return availableCoordinates;
}


let colorPalette = {
  1: "red-piece",
  2: "yellow-piece",
  3: "green-piece",
  4: "purple-piece",
  5: "orange-piece",
  6: "black-piece",
}

function fillTile(i, j, color) {
  if (gameOver) {
    return;
  }
  if ( color == playerYellow ) {
    getTile(i, j).classList.add(colorPalette[1])
    boardMatrix[i][j] = playerYellow;
  }
  else {
    getTile(i, j).classList.add(colorPalette[2]);
    boardMatrix[i][j] = playerRed;
  }
  updateTurn();
  checkWinner();
}

function updateTurn() {
  if ( currentPlayer == playerRed ) {
    currentPlayer = playerYellow;
  }
  else {
    currentPlayer = playerRed;
  }
}

function adjustCoordinates(row, column) {
let adjustedRow = row;
let adjustedColumn = column;
let columnIsFull = false;

for ( let i = rows - 1; i >= 0; i-- ) {
  if ( boardMatrix[i][adjustedColumn] == ' ' ) {
      adjustedRow = i;
      break;
  }
}

if ( adjustedRow < 0 ) {
  columnIsFull = true;
  console.log(columnIsFull);
  return;
}

return [adjustedRow, adjustedColumn];
}

function iterateOverTiles() {
  let tiles = boardGame.getElementsByClassName("tile");
  for (let i = 0; i < tiles.length; i++) {
    console.log(tiles[i]);
  }
}

function checkWinner() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
        if (boardMatrix[r][c] != ' ') {
            if (checkHorizontal(r, c) || checkVertical(r, c) || checkDiagonal(r, c)) {
              // Iterate over the four winners indexes and set the background color to yellow
              for (let i = 0; i < fourWinners.length; i++) {
                let winnerIndex = fourWinners[i];
                let winnerRow = winnerIndex[0];
                let winnerColumn = winnerIndex[1];
                // set the background image of this tile to the specified URL
                getTile(winnerRow, winnerColumn).style.backgroundImage = "url('../images/star.png')";
              }
              gameOver = true; 
              winner = currentPlayer;
              console.log(currentPlayer + " wins !");
            }
            updateTurn();
        }
    }
  }
  return winner;
}

let fourWinners = [];

function checkDiagonal(r, c) {
  if (r < 3 && c < 4) {
    if (boardMatrix[r][c] === boardMatrix[r+1][c+1] && boardMatrix[r][c] === boardMatrix[r+2][c+2] && boardMatrix[r][c] === boardMatrix[r+3][c+3]) {
      // Add the four winner indexes to the array
      fourWinners.push([r, c]);
      fourWinners.push([r+1, c+1]);
      fourWinners.push([r+2, c+2]);
      fourWinners.push([r+3, c+3]);
      return true;
    }
  }
  if (r < 3 && c > 2) {
    if (boardMatrix[r][c] === boardMatrix[r+1][c-1] && boardMatrix[r][c] === boardMatrix[r+2][c-2] && boardMatrix[r][c] === boardMatrix[r+3][c-3]) {
      fourWinners.push([r, c]);
      fourWinners.push([r+1, c-1]);
      fourWinners.push([r+2, c-2]);
      fourWinners.push([r+3, c-3]);
      return true;
    }
  }
  return false;
}

function checkHorizontal(r, c) {
  if (c < 4) {
    if (boardMatrix[r][c] == boardMatrix[r][c+1] && boardMatrix[r][c] == boardMatrix[r][c+2] && boardMatrix[r][c] == boardMatrix[r][c+3]) {
      fourWinners.push([r, c]);
      fourWinners.push([r, c+1]);
      fourWinners.push([r, c+2]);
      fourWinners.push([r, c+3]);
      return true;
    }
  }
  return false;
}

function checkVertical(r, c) {
  if (r < 3) {
    if (boardMatrix[r][c] === boardMatrix[r+1][c] && boardMatrix[r][c] === boardMatrix[r+2][c] && boardMatrix[r][c] === boardMatrix[r+3][c]) {
      fourWinners.push([r, c]);
      fourWinners.push([r+1, c]);
      fourWinners.push([r+2, c]);
      fourWinners.push([r+3, c]);
      return true;
    }
  }
  return false;
}

function boardMatrixCopy(){
let copy = [];
for (let i = 0; i < rows ; i++) {
  copy[i] = [];
  for(let j = 0; j < columns ; j++) {
      copy[i][j] = boardMatrix[i][j];
  }
}
return copy;
}

//////////////////// Server Connection Manager ////////////////////

let clientId = null;
let gameId = null;
let clientColor = null;
let chat = null;
let opponent = null;
let canClick = false;
let yourTurn = false;

let waiting = document.getElementById('component');
let countdown = document.getElementById('countdown');

let chatHistory = { };
let ws = new WebSocket('ws://' + localHostOrUrl + ':9090');

const newGame = document.getElementById('newGame');
const joinGame = document.getElementById('joinGame');
const startCh = document.getElementById('startCh');

joinGame.style.display = "none";

// wiring events
joinGame.addEventListener('click', () => {

    if ( gameId === null ) {
      console.error("No game id found");
    }

    const payLoad = {
      "method": "joinGame",
      "clientId": clientId,
      "gameId": gameId
    }

    ws.send(JSON.stringify(payLoad));

})

let startChallenge = false;

startCh.addEventListener('click', () => {

  if ( gameId === null ) {
    console.log("No game id found");
  }

  const payLoad = {
    "method": "challengerPlay",
    "clientId": clientId,
    "gameId": gameId
  }
  ws.send(JSON.stringify(payLoad));

})

const intervalId22 = setInterval(() => {
  if (startChallenge) {
    const intervalId2 = setInterval(() => {
      if (opponent) {
        console.log("Now I can play");
        startCh.click();
        clearInterval(intervalId2);
      }
      else {
        startCh.click();
      }
    }, 100);

  clearInterval(intervalId22);
  }
  else {
  }
}, 100);

let opp = document.getElementById('acceptChallenge');

newGame.addEventListener('click', () => {

  const payLoad = {
    "method": "createGame",
    "clientId": clientId
  }

  ws.send(JSON.stringify(payLoad));
  
  waiting.style.display = "block";
  newGame.style.display = "none";
  opp.style.display = "none";
  let photo = document.getElementById('too');
  photo.style.display = "none";

  // listen for opponent variable changes
  let opponentInterval = setInterval(() => {
    if (opponent !== null) {
      console.log("Opponent found !", opponent);
      let board = document.getElementById('board');

      waiting.style.display = "none";

      // The oponent is found, we can start the game
      countdown.style.display = "block";
      board.style.visibility = "hidden";

      setTimeout(() => {
          countdown.style.display = "none";
          board.style.visibility = "visible";
          const startChat = document.getElementById("open");
          startChat.style.visibility = "visible";
          const image1 = document.getElementById('open');
          image1.style.visibility = "visible";
          let chrono = document.getElementById("chrono");
          chrono.style.visibility = "visible";
          let chatBox = document.getElementById("chat-box");
          chatBox.style.display = "block";
      }, 3000);

      clearInterval(opponentInterval);
    }
    else {
      console.log("Looking for an oponent...");
    }
  }, 1000);

  canClick = true;
})

const intervalId = setInterval(() => {
  if (canClick) {
    const intervalId2 = setInterval(() => {
      if (opponent) {
        joinGame.click();
        clearInterval(intervalId2);
      }
      else {
        joinGame.click();
      }
    }, 100);

  clearInterval(intervalId);
  }
  else {
  }
}, 100);
            
let turn = true;
let privateRoomId = null;
let playFirst = 0;

ws.onmessage = message => {
        // I the client receive a message from the server !
        const response = JSON.parse(message.data);

        // A new connection to the server
        if ( response.method === "connect" ) {
            clientId = response.clientId;
            console.log("Welcome Client ID : ", clientId, " !!");
            const payLoad = {
              "method": "connect",
              "token": localStorage.token,
              "oldClientId": clientId,
              "username": localStorage.getItem("username")
            }
            // console.log("I sent payload ,", payLoad)
            // send it to the server
            ws.send(JSON.stringify(payLoad));
        }

        // create a new game
        if ( response.method === "createGame" ) {
          gameId = response.game.id;
          // console.log("game succesfully created with id : ", gameId + " | by client : " + clientId);
          // itearte over the clients array and check if it has two clients : the one with clientId from clientId goes to opponent
          let c = response.clients;
          // console.log("clients array : ", c);
          for (let i = 0; i < c.length; i++) {
            if ( c[i].clientId !== clientId ) {
                opponent = c[i].clientId;
                break;
            }
          }
        }

        // Create a private challenge room
        if ( response.method === "createChallenge" ) {
          gameId = response.game.id;
          // console.log("game succesfully created with id : ", gameId + " | by client : " + clientId);
          // itearte over the clients array and check if it has two clients : the one with clientId from clientId goes to opponent
          let c = response.clients;
          // console.log("clients array : ", c);
          for (let i = 0; i < c.length; i++) {
            if ( c[i].clientId !== clientId ) {
                opponent = c[i].clientId;
                break;
            }
          }
          const payLoad = {
            "method": "createChallenge",
            "clientId": clientId,
            "gameId": generateId(),
            "room": "private",
          }
          console.log("I create this challenge : ", payLoad)
          ws.send(JSON.stringify(payLoad));
        }

        // Join a private challenge room
        if ( response.method === "respondChallenge" ) {

            clientColor = null;
            let c = response.clients;
            for (let i = 0; i < c.length; i++) {
              if ( c[i].clientId === clientId ) {
                  clientColor = c[i].color;
                  break;
              }
            }
            console.log("Yes you have a challenge to join : ", response.gameId, " against : ", response.opponent);

            let board = document.getElementById('board');
            board.style.visibility = "visible";
            const startChat = document.getElementById("open");
            startChat.style.visibility = "visible";
            const image1 = document.getElementById('open');
            image1.style.visibility = "visible";
            let chrono = document.getElementById("chrono");
            chrono.style.visibility = "visible";

            boardGame.addEventListener("click", function(event) {
              let target = event.target;
              if (target.classList.contains("tile")) {
    
                  let coords = target.id.split("-");
                  let row = parseInt(coords[0]);
                  let column = parseInt(coords[1]);
                  let adjustedCoords = adjustCoordinates(row, column);
    
                  row = adjustedCoords[0];
                  column = adjustedCoords[1];
    
                  const payLoad = {
                      "method": "play",
                      "clientId": clientId,
                      "gameId": response.gameId,
                      "row": row,
                      "column": column,
                      "color": clientColor
                  }
                  decrementRed();
                  if ( playFirst == 0 ) {
                      decrementRed();
                      playFirst++;
                  }
                  else if ( playFirst == 1 ) {
                      decrementYellow();
                      playFirst--;
                  }

                  ws.send(JSON.stringify(payLoad));
                }
              });

        }

        // The challenger play
        if ( response.method === "challengerPlay" ) {

            clientColor = null;
            let c = response.clients;
            for (let i = 0; i < c.length; i++) {
              if ( c[i].clientId === clientId ) {
                  clientColor = c[i].color;
                  break;
              }
            }
            console.log("Your opponent is here you can play");

            let board = document.getElementById('board');
            board.style.visibility = "visible";
            const startChat = document.getElementById("open");
            startChat.style.visibility = "visible";
            const image1 = document.getElementById('open');
            image1.style.visibility = "visible";
            let chrono = document.getElementById("chrono");
            chrono.style.visibility = "visible";

            boardGame.addEventListener("click", function(event) {
              let target = event.target;
              if (target.classList.contains("tile")) {
    
                  let coords = target.id.split("-");
                  let row = parseInt(coords[0]);
                  let column = parseInt(coords[1]);
                  let adjustedCoords = adjustCoordinates(row, column);
    
                  row = adjustedCoords[0];
                  column = adjustedCoords[1];
    
                  const payLoad = {
                      "method": "play",
                      "clientId": clientId,
                      "gameId": response.gameId,
                      "row": row,
                      "column": column,
                      "color": clientColor
                  }
                  ws.send(JSON.stringify(payLoad));
                }
              });

        }

        // join a game
        if ( response.method === "joinGame" ) {

          clientColor = null;
          let c = response.clients;
          for (let i = 0; i < c.length; i++) {
            if ( c[i].clientId === clientId ) {
                clientColor = c[i].color;
                break;
            }
          }
          
          boardGame.addEventListener("click", function(event) {
            let target = event.target;
            if (target.classList.contains("tile")) {
  
                let coords = target.id.split("-");
                let row = parseInt(coords[0]);
                let column = parseInt(coords[1]);
                let adjustedCoords = adjustCoordinates(row, column);
  
                row = adjustedCoords[0];
                column = adjustedCoords[1];
  
                const payLoad = {
                    "method": "play",
                    "clientId": clientId,
                    "gameId": response.game.id,
                    "row": row,
                    "column": column,
                    "color": clientColor
                }
                ws.send(JSON.stringify(payLoad));
              }
            });

          console.log("ROOM Number : ", gameId);
        }

        // Receive a message from the opponent
        if ( response.method === "chat" ) {
          console.log("MESSAGE From the opponent : ", response.text);
          addMessage("Opponent :", response.text);
        }

        // Receive challenge notification
        if ( response.method === "notifyChallenge" ) { 
          console.log("You have a challenge from : ", response.challenger);
          let nott = document.getElementById("notification");
          // set its display to block
          nott.style.display = "block";
        }

        // upadate the game state
        if ( response.method === "updateGameState" ) {


          if ( response.winner ) {

            // waits for 3 seconds before displaying the winner
            setTimeout(() => {
              // console.log("WINNER IS : ", response.winner);
              if ( response.winner === clientId ) {
                  //log the winner token and username from the payload
                  console.log("You won token : ",response.winnerToken);
                  console.log("You Lost username : ",response.loserToken);
                  updateScore(response.winnerToken, response.loserToken).then(r => console.log("updated score",r));
                  window.location.href = "winner.html";

              }
              else {
                // console.log("You lost !");
                window.location.href = "goodLuck.html";
              }
            }, 1000)
          }


          if (!response.game.gameState) return;
              const state = response.game.gameState;
              for ( let i = 0; i < rows; i++ ) {
                for ( let j = 0; j < columns; j++ ) {
                  if ( state[i][j] != ' ' ) {
                    fillTile(i, j, state[i][j]);
                  }
                }
              }

              let game = response.game;
              game.clients.forEach(client => {
                if (client.clientId !== clientId) {
                    opponent = client.clientId;
                }
              });

              const paylaod = {
                "method": "updateGameState",
                "text": chat,
                "clientId": clientId,
                "gameId": gameId,
              }

              ws.send(JSON.stringify(paylaod));

              // stop the game updating if the winer is found
              if ( response.winner ) {
                clearInterval(intervalId);
              }

        }

}

async function updateScore(winner,loser){
    const response = await fetch('http://' + localHostOrUrl + ':8000/api/online/updateScore/%{winner}/%{loser}', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        winner: winner,
        loser: loser
        })
    });
    const data = await response.json();
    console.log(data);
    if(response.ok){
        console.log('score updated');
    }
    else{
        console.log('score not updated');
    }
}


function storeText() {
  let YOYO = document.getElementById("messageInput").value;
  // document.getElementById("text-display").textContent = YOYO;
  console.log("YOYO : ", YOYO);
  const paylaod = {
    "method": "chat",
    "text": YOYO,
    "clientId": clientId,
    "gameId": gameId,
  }

  console.log("I sent this payload : ", paylaod)

  ws.send(JSON.stringify(paylaod));
}

function generateId() {
    let result = '';
    const characters = 'XUV';
    for (let i = 0; i < 3; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result + Math.floor(Math.random() * 1000);
}

var messages = document.getElementById("messages");
var sendButton = document.getElementById("sendButton");

sendButton.addEventListener("click", function () {

    // Display the message locally
    let messageText = messageInput.value;
    if (messageText.trim() !== "") {
        addMessage("You", messageText);
        messageInput.value = "";
    }

    // Send the message to the server
    const paylaod = {
      "method": "chat",
      "text": messageText,
      "clientId": clientId,
      "gameId": gameId,
    }

    ws.send(JSON.stringify(paylaod));

});

function addMessage(user, message) {
    var li = document.createElement("li");
    li.className = "chat-message";
    li.innerHTML =
        '<span class="user" id="user">' + user + ':</span><span class="message">' + message + "</span>";
    messages.appendChild(li);
}

window.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const triggerFunction = urlParams.get('trigger');
    const opponentUsername = urlParams.get('opponentUsername');
    let acceptChallenge1 = document.getElementById("acceptChallenge");
    acceptChallenge1.style.display = "none";
    let photo = document.getElementById("too");
    photo.style.display = "none";
    
    if (triggerFunction === 'challengeFriend') {

      console.log("I'm challenging ", opponentUsername);

      setTimeout(() => {

        // create a challenge
        const payLoad = {
          "method": "createChallenge",
          "clientId": clientId,
          "opponentUsername": opponentUsername,
          "room": "private",
          "gameId": generateId(),
        }
        
        ws.send(JSON.stringify(payLoad));
  
        waiting.style.display = "block";
        newGame.style.display = "none";

        // listen for opponent variable changes
        let opponentInterval = setInterval(() => {
          if (opponent !== null) {
            console.log("Opponent found !", opponent);
            console.log("GAME ID IS : ", gameId);
            startChallenge = true;

            let board = document.getElementById('board');

            waiting.style.display = "none";

            // The oponent is found, we can start the game
            countdown.style.display = "block";
            board.style.visibility = "hidden";

            setTimeout(() => {
                let photo = document.getElementById("too");
                photo.style.display = "none";
                countdown.style.display = "none";
                board.style.visibility = "visible";
                const startChat = document.getElementById("open");
                startChat.style.visibility = "visible";
                const image1 = document.getElementById('open');
                image1.style.visibility = "visible";
                let chrono = document.getElementById("chrono");
                chrono.style.visibility = "visible";
                let chatBox = document.getElementById("chat-box");
                chatBox.style.display = "block";
            }, 3000);

            clearInterval(opponentInterval);
          }
          else {
            console.log("Looking for an oponent...");
          }
        }, 1000);

      }, 1000);

    }
});

// let acceptFriendChallenge = document.getElementById("acceptChallenge");
// acceptFriendChallenge.addEventListener("click", respondToChallenge);

// Check in database if the client has received a friend request
function respondToChallenge() {
  setTimeout(() => {
    if ( gameId === null ) {
      console.log("Ask the server if I have a friend challenge to respond to !");
    }

    const payLoad = {
      "method": "respondChallenge",
      "clientId": clientId,
      "username": localStorage.getItem("username"),
      "token": localStorage.getItem("token"),
    }

    ws.send(JSON.stringify(payLoad));
  }, 1000);

}

const acceptBtn = document.getElementById("accept-btn");
const notification = document.querySelector(".notification");

acceptBtn.addEventListener("click", function() {
  let acceptChallenge = document.getElementById("acceptChallenge");
  acceptChallenge.click();
  acceptChallenge.style.display = "none";
  joinGame.style.display = "none";
  let photo = document.getElementById("too");
  photo.style.display = "none";
  let neww = document.getElementById("newGame");
  neww.style.display = "none";
  // display countwodn.html for 3 seconds then display ide.html
  countdown.style.display = "block";
  board.style.visibility = "hidden";
  setTimeout(() => {
    countdown.style.display = "none";
    board.style.visibility = "visible";
    const startChat = document.getElementById("open");
    startChat.style.visibility = "visible";
    const image1 = document.getElementById('open');
    image1.style.visibility = "visible";
    let chrono = document.getElementById("chrono");
    chrono.style.visibility = "visible";
    let chatBox = document.getElementById("chat-box");
    chatBox.style.display = "block";
  }, 3000);
  notification.style.display = "none";
});

// call the function respondToChallenge() every 2 seconds
//////// decrement timer ////////

const redTimer = document.querySelector('.red .timer');
const yellowTimer = document.querySelector('.yellow .timer');

let redTime = 60;
let yellowTime = 60;

// const yellowCountdown = setInterval(decrementYellow, 1000);
// const redCountdown = setInterval(decrementRed, 1000);

function decrementYellow() {
    let timer = document.getElementById("tr");
    timer.style.display = "none";

    let timer2 = document.getElementById("tl");
    timer2.style.display = "none";

    let im1 = document.getElementById("right");
    im1.style.display = "none";

    let im = document.getElementById("left");
    im.style.display = "none";
    yellowTime--;

    if (yellowTime >= 0) {
        yellowTimer.textContent = yellowTime;
    } else {
        clearInterval(yellowCountdown);
        yellowTimer.textContent = 'Please fill a tile !';
    }
}

function decrementRed() {
    let timer = document.getElementById("tl");
    timer.style.display = "none";

    let timer2 = document.getElementById("tr");
    timer2.style.display = "none";

    let im1 = document.getElementById("left");
    im1.style.display = "none";

    let im = document.getElementById("right");
    im.style.display = "none";

    redTime--;

    if (redTime >= 0) {
        redTimer.textContent = redTime;
    } else {
        clearInterval(redCountdown);
        redTimer.textContent = 'Time\'s up!';
    }
}

function closeChat() {
  chatBox2.style.display = "none";
  // get the image chat and make it visible
  let image = document.getElementById("open");
  image.style.display = "inline-block";
}

// chat query
var messages = document.getElementById("messages");
var messageInput = document.getElementById("messageInput");
var sendButton = document.getElementById("sendButton");

sendButton.addEventListener("click", function () {
var messageText = messageInput.value;
if (messageText.trim() !== "") {
    addMessage("You", messageText);
    messageInput.value = "";
}
});

function addMessage(user, message) {
var li = document.createElement("li");
li.className = "chat-message";
li.innerHTML =
    '<span class="user">' + user + ':</span><span class="message">' + message + "</span>";
messages.appendChild(li);
}

var openCloseButton = document.getElementById("openCloseButton");
var chatBox2 = document.querySelector(".chat-box");

        // openCloseButton.addEventListener("click", function () {
        //   if (chatBox2.style.display === "none") {
        //     chatBox2.style.display = "block";
        //     openCloseButton.innerText = "Close Chat";
        //   } else {
        //     chatBox2.style.display = "none";
        //     openCloseButton.innerText = "Open Chat";
        //   }
        // });

        function closeChat() {
          chatBox2.style.display = "none";
          // get the image chat and make it visible
          let image = document.getElementById("open");
          image.style.display = "inline-block";
        }

        function mute() {
          document.querySelector(".chat-box img:nth-child(2)").style.display = "none";
          document.querySelector(".chat-box img:nth-child(3)").style.display = "inline-block";
        }

        function unmute() {
          document.querySelector(".chat-box img:nth-child(2)").style.display = "inline-block";
          document.querySelector(".chat-box img:nth-child(3)").style.display = "none";
        }

        function openChat() {
          chatBox2.style.display = "block";
          // get the image chat and make it visible
          let image = document.getElementById("open");
          image.style.display = "none";
        }