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
const url = '15.236.164.81';
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
    getTile(i, j).classList.add(colorPalette[4]);
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

// document.getElementById("saveButton").addEventListener("click",function(){saveGame("local")});

async function saveGame(event, gameType) {

event.preventDefault();

console.log("in saveGame")
let token = localStorage.getItem("token");
const savingDate = new Date();

console.log(token);
const tab = {
  gameType: gameType,
  tab: boardMatrixCopy(),
  playerToPlay: currentPlayer,
  userToken: token,
  date : savingDate.toLocaleDateString()+ " " +  savingDate.toLocaleTimeString()
};
console.log(tab)

try {
  const response = await fetch('http://' + localHostOrUrl + ':8000/api/game', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(tab)
  });

  if(response.ok) {
      console.log("im in" , response.data);
      console.log("tab ", response.tab);
      console.log("tab ", tab);
      window.location.href = '../../modeGamePage/playersChooseColors.html'

  }
  else{
      console.log("error");
  }
} catch (err) {
  console.log(err);
}
}

async function resumeGame() {
    let redirect = document.getElementById("resume-link");
    redirect.href ="../playOneVsOne/index.html" ;
  }

  async function getSavedGames() {

  const token = localStorage.getItem("token");
  const response = await fetch('http://' + localHostOrUrl + ':8000/api/game/list', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token })
  });
  if (response.ok) {
    const games = await response.json();
    const gamesList = document.getElementById('games-list');
    gamesList.innerHTML = '';
    if (games.length === 0) {
        gamesList.innerHTML = '<li>No saved games found.</li>';
    } else {
        for (let i = 0; i < games.length; i++) {
            const game = games[i];
            const gameItem = document.createElement('li');
            // gameItem.innerHTML = `<button data-game="${game._id}" class="game-button">local - ${game.date}</button>`;
            gameItem.innerHTML = `
                                    <div class="game-container">
                                        <button data-game="${game._id}" class="game-button">local - ${game.date}</button>
                                        <i class="gg-trash" data-game="${game._id}"></i>
                                    </div>
  `;
            gamesList.appendChild(gameItem);
        }
        document.querySelectorAll('.game-button').forEach(button => button.addEventListener('click', restoreSavedGame));
        document.querySelectorAll('.gg-trash').forEach(icon => icon.addEventListener('click', deleteSavedGame));

    }
  } else {
    console.log('Failed to retrieve saved games');
  }
}

async function restoreSavedGame(event) {
  event.preventDefault();
  const gameId = event.target.dataset.game;
  console.log("this is the game id : ", gameId);
  const token = localStorage.getItem("token");
  const response = await fetch('http://' + localHostOrUrl + ':8000/api/game/retrieve/${gameId}', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ _id: gameId })
  });
  if (response.ok) {
    const gameData = await response.json();
    if (gameData && gameData.tab) {
        // Clear the board
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                getTile(i, j).classList.remove("red-piece", "yellow-piece");
            }
        }
        // Set boardMatrix to gameData.tab
        boardMatrix = gameData.tab;
        console.log("current player : ", currentPlayer);


        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (boardMatrix[i][j] === playerRed) {
                    getTile(i, j).classList.add("red-piece");
                }
                if (boardMatrix[i][j] === playerYellow) {
                    getTile(i, j).classList.add("yellow-piece");
                }
            }
        }
        // Set currentPlayer to gameData.playerToPlay
        currentPlayer = gameData.playerToPlay;
        console.log("Game resumed:", boardMatrix);
    } else {
        console.log('No game data found for user');
        console.log('gameData:', gameData);
        console.log('gameData state:', gameData.gameState);
        console.log('gameData tab:', gameData.tab);
        console.log('gameData tab:', gameData._id);
    }
  } else {
    console.log('Failed to retrieve game data');
  }
}

async function deleteSavedGame(event) {

  event.preventDefault();

  const gameId = event.target.getAttribute('data-game');
  console.log("this is the game id : ", gameId);
  const token = localStorage.getItem("token");
  const response = await fetch('http://' + localHostOrUrl + ':8000/api/game/delete/${gameId}', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ _id: gameId })
  });
  if (response.ok) {
    // If the game was successfully deleted, remove the corresponding HTML element
    event.target.parentElement.remove();
    console.log("this is the game id : ", gameId);


  } else {
    console.log('Failed to delete saved game');
  }
}

// Call getSavedGames when the page loads
getSavedGames();

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

newGame.addEventListener('click', () => {

  const payLoad = {
    "method": "createGame",
    "clientId": clientId
  }

  ws.send(JSON.stringify(payLoad));
  
  waiting.style.display = "block";
  newGame.style.display = "none";

  // listen for opponent variable changes
  let opponentInterval = setInterval(() => {
    if (opponent !== null) {
      console.log("Opponent found !", opponent);
      let board = document.getElementById('board');

      waiting.style.display = "none";

      // The oponent is found, we can start the game
      countdown.style.display = "block";

      setTimeout(() => {
          countdown.style.display = "none";
          board.style.visibility = "visible";
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

        // Challnger play
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
                  console.log("I sent this payload : ", payLoad)
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
    const response = await fetch('http://localhost:8000/api/online/updateScore/%{winner}/%{loser}', {
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
  let YOYO = document.getElementById("input-text").value;
  document.getElementById("text-display").textContent = YOYO;

  const paylaod = {
    "method": "chat",
    "text": YOYO,
    "clientId": clientId,
    "gameId": gameId,
  }

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
var messageInput = document.getElementById("messageInput");
var sendButton = document.getElementById("sendButton");

sendButton.addEventListener("click", function () {

    // Display the message locally
    var messageText = messageInput.value;
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

            setTimeout(() => {
                countdown.style.display = "none";
                board.style.visibility = "visible";
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
  // display ide.html for 3 seconds
  setTimeout(() => {
    countdown.style.display = "block";
  }, 3000);
  setTimeout(() => {
    countdown.style.display = "none";
    board.style.visibility = "visible";
    chatBox.style.display = "block";
  }, 6000);
  notification.style.display = "none";
});

// call the function respondToChallenge() every 2 seconds