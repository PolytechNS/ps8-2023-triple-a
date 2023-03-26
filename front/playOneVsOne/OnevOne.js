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
let localHostOrUrl;

function chooselocalHostOrUrl(l) {
if ( l == 2 ) {
  localHostOrUrl = localHost;
}
else if ( l == 1 ) {
  localHostOrUrl = url;
}
}

// 1 : URL | 2 : Localhost
chooselocalHostOrUrl(2);

window.onload = function() {
main();
}

function main() {
setBoard();
}

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

function getTileId(i, j) {
return getTile(i, j).id;
}

function getCoordinatesOfTheClickedTile() {
return new Promise((resolve) => {
  boardGame.addEventListener("click", function(event) {
      let target = event.target;
      if (target.classList.contains("tile")) {
          let tileId = target.id;
          let row = tileId[0];
          let column = tileId[2];
          resolve([row, column]);
      }
  });
});
}

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
  getTile(i, j).classList.add(colorPalette[3])
  boardMatrix[i][j] = playerYellow;
}
else {
  getTile(i, j).classList.add(colorPalette[5]);
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

function getIdOfClickedTile() {
return new Promise((resolve) => {
  boardGame.addEventListener("click", function(event) {
      let target = event.target;
      if (target.classList.contains("tile")) {
          let tileId = target.id;
          resolve(tileId);
      }
  });
});
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

function checkDiagonal(r, c) {
if (r < 3 && c < 4) {
  if (boardMatrix[r][c] === boardMatrix[r+1][c+1] && boardMatrix[r][c] === boardMatrix[r+2][c+2] && boardMatrix[r][c] === boardMatrix[r+3][c+3]) {
      return true;
  }
}
if (r < 3 && c > 2) {
  if (boardMatrix[r][c] === boardMatrix[r+1][c-1] && boardMatrix[r][c] === boardMatrix[r+2][c-2] && boardMatrix[r][c] === boardMatrix[r+3][c-3]) {
      return true;
  }
}
return false;
}

function checkHorizontal(r, c) {
if (c < 4) {
  if (boardMatrix[r][c] == boardMatrix[r][c+1] && boardMatrix[r][c] == boardMatrix[r][c+2] && boardMatrix[r][c] == boardMatrix[r][c+3]) {
      return true;
  }
}
return false;
}

function checkVertical(r, c) {
if (r < 3) {
  if (boardMatrix[r][c] === boardMatrix[r+1][c] && boardMatrix[r][c] === boardMatrix[r+2][c] && boardMatrix[r][c] === boardMatrix[r+3][c]) {
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

let room = {}

let ws = new WebSocket('ws://' + localHostOrUrl + ':9090');
const newGame = document.getElementById('newGame');
const joinGame = document.getElementById('joinGame');
const textGameId = document.getElementById('textGameId');

joinGame.style.display = "none";
textGameId.style.display = "none";

// wiring events
joinGame.addEventListener('click', e => {

    if ( gameId === null ) {
    gameId = textGameId.value;
    }

    let board = document.getElementById('board');
    board.style.visibility = "visible";

    const payLoad = {
    "method": "joinGame",
    "clientId": clientId,
    "gameId": gameId
    }

    ws.send(JSON.stringify(payLoad));

})

let canPlay = false;

setTimeout(() => {
    canPlay = true;
  }, 4000);

let interval = setInterval(function() {
  if (canPlay) {
    console.log("Oponent found !");
    waiting.style.display = "none";
    joinGame.style.display = "block";
    clearInterval(interval);
  } else {
    console.log("Looking for an oponent...");
  }
}, 1000);

  

let waiting = document.getElementById('component');

newGame.addEventListener('click', e => {

    const payLoad = {
    "method": "createGame",
    "clientId": clientId
    }

    ws.send(JSON.stringify(payLoad));

    waiting.style.display = "block";
    newGame.style.display = "none";

})

var numberOfCreatedGames;

ws.onmessage = message => {
// I the client receive a message from the server !
const response = JSON.parse(message.data);

// A new connection to the server
if ( response.method === "connect" ) {
    clientId = response.clientId;
    console.log("Client ID : ", clientId, " set successfully !");
    numberOfCreatedGames = Object.keys(response.games).length;
    console.log("The number of created games is : ", numberOfCreatedGames);
}

// create a new game
if ( response.method === "createGame" ) {
  gameId = response.game.id;
  console.log("game succesfully created with id : ", gameId + " | by client : " + clientId);
}

// join a game
if ( response.method === "joinGame" ) {
  clientColor = null;
  let a = 0;
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
      console.log("Board Matrix : ", boardMatrix);
      ws.send(JSON.stringify(payLoad));
    }
  });
  console.log("game succesfully joined with id : ", gameId + " | by client : " + clientId);
}

// upadate the game state
if ( response.method === "updateGameState" ) {
if (!response.game.gameState) return;
let j = 1;
const state = response.game.gameState;
for ( let i = 0; i < rows; i++ ) {
  for ( let j = 0; j < columns; j++ ) {
    if ( state[i][j] != ' ' ) {
      fillTile(i, j, state[i][j]);
    }
  }
}
}
}

generateDivs();

function generateDivs() {
var numDivs = numberOfCreatedGames;
var divContainer = document.getElementById("divContainer");
console.log("ROOOM: ", numDivs);
for (var i = 1; i <= numDivs; i++) {
var newDiv = document.createElement("div");
newDiv.innerHTML = "Game ID : " + room[i].id;
divContainer.appendChild(newDiv);
}
}