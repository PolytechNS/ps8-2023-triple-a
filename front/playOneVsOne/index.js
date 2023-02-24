/// trace de sockets

/**
 * 
const log = (text) => {
  const parent = document.querySelector('#chat');
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
  parent.scrollTop = parent.scrollHeight;
};

const onChatSubmitted = (sock) => (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';
  // Send to all connected users
  sock.emit('message', text);
};

(() => {
  const sock = io();
  sock.on('message', (text) => log(text));

  document
    .querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted(sock));
})();

*/

var playerRed = "RED";
var playerYellow = "YELLOW";
var playerToStart;
playerToStart = playerRed;
var currentPlayer = playerToStart;
var previousPlayer = null;

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

window.onload = function() {
    main();
}

function main() {
    setBoard();
    fillTheClickedTile();
    let a = getAvailableCoordinates();
    console.log("available", a);
    if ( resume ) {
        resumeGame();
    }
}

function resumeGame() {
    //let tab = retrieveSavedGame();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (tab[i][j] == "RED") {
                getTile(i, j).classList.add("red-piece");
            }
            if (tab[i][j] == "YELLOW") {
                getTile(i, j).classList.add("yellow-piece");
            }
        }
    }
}

function playOneVsOne() {
    fillTheClickedTile();    
}

function playOneVsIA() {
    fillTheClickedTile();
    fillRandomTile();
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
        }
    }
    return boardGame;
}

function getTile(i, j) {
    let target = document.getElementById(i.toString() + "-" + j.toString());;
    return target;
}

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

function fillTheClickedTile() {
    boardGame.addEventListener("click", function(event) {
        let target = event.target;
        if (target.classList.contains("tile")) {

            let coords = target.id.split("-");
            let row = parseInt(coords[0]);
            let column = parseInt(coords[1]);

            let adjustedCoords = adjustCoordinates(row, column);

            row = adjustedCoords[0];
            column = adjustedCoords[1];

            fillTile(row, column);
        }
    });
}

function fillTile(i, j) {
    if (gameOver) {
        return;
    }
    if ( currentPlayer == playerRed ) {
        boardMatrix[i][j] = playerRed;
        getTile(i, j).classList.add("red-piece");
        currentPlayer = playerYellow;
    }
    else {
        boardMatrix[i][j] = playerYellow;
        getTile(i, j).classList.add("yellow-piece");
        currentPlayer = playerRed;
    }
    console.log('Tile',  [i, j], "has been filled with", boardMatrix[i][j]);
    checkWinner();
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
                    if ( currentPlayer == "RED" ) {
                        currentPlayer = "YELLOW";
                    }
                    if ( currentPlayer == "YELLOW" ) {
                        currentPlayer = "RED";
                    }
                    gameOver = true; 
                    winner = currentPlayer;

                    console.log(currentPlayer + " wins !");

                }
            }
        }
    }
    console.log('this is    ' ,boardMatrixCopy());


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

async function saveGame(gameType) {
    console.log("in saveGame")
    let token = localStorage.getItem("token");
    console.log(token);
    const tab = {
        gameType: gameType,
        tab: boardMatrixCopy(),
        userToken: token
    };
    console.log(tab)

    const response = await fetch('http://localhost:8000/api/game', {
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

}

