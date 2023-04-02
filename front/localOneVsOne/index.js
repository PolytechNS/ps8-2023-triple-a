var playerRed = "RED";
var playerYellow = "YELLOW";

var playerToStart;

var currentPlayer = playerToStart;
var previousPlayer = null;

var gameOver = false;
var winner = null;

// Stoque la matrice du jeu dont les éléments sont, 
// si remplis, soit 'RED' soit 'YELLOW'
var boardMatrix = boardMatrix;

// Stoque la matrice du jeu dont les éléments sont, 
// si remplis, sont les tiles du DOM
var boardGame;

var rows = 6;
var columns = 7;

window.onload = function() {
    main();
}

function main() {
    setPlayerToStart(playerYellow);
    setBoard();
}      

function setPlayerToStart(player) {
    playerToStart = player;
    currentPlayer = playerToStart;
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

            tile.addEventListener("click", fillTheClickedTile);
            document.getElementById("board").append(tile);

        }

    }
    return boardGame;
}

function getTile(i, j) {
    let target = document.getElementById(i.toString() + "-" + j.toString());
    return target;
}

let i = 0;

function fillTheClickedTile() {

    if ( i == 0 ) {
        decrementRed();
        i++;
    }
    else if ( i == 1 ) {
        decrementYellow();
        i--;
    }

    if (gameOver) {
        return;
    }

    let coords = this.id.split("-");
    let oldR = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    let adjustedCoords = adjustCoordinates(oldR, c);

    let r = adjustedCoords[0];
    c = adjustedCoords[1];

    let humanLastMove = [c, r];

    let tile = document.getElementById(r.toString() + "-" + c.toString());
    
    fillTile(tile);

    checkWinner();
}

function fillTile(tile) {
    
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    fillTileOfCoords(r, c);

}

function fillTileOfCoords(i, j) {
    if (gameOver) {
        return;
    }
    if (currentPlayer == playerRed) {
        getTile(i, j).classList.add("red-piece");
        previousPlayer = currentPlayer;
        currentPlayer = playerYellow;
    }
    else if (currentPlayer == playerYellow) {
        getTile(i, j).classList.add("yellow-piece");
        previousPlayer = currentPlayer;
        currentPlayer = playerRed;
    }

    boardMatrix[i][j] = previousPlayer;
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

function checkWinner() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (boardMatrix[r][c] != ' ') {
                if (checkHorizontal(r, c) || checkVertical(r, c) || checkDiagonal(r, c)) {
                    gameOver = true; 
                    winner = previousPlayer;
                    setTimeout(() => {
                        console.log("GMAE OVER ! ", winner + " wins !");
                        window.alert(winner + " wins !");
                        const url = `../localOneVsOne/winner.html?winnerColor=${winner}`;
                        window.location.href = url;
                        }, 500);
                }
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
        userToken: token,
        date : savingDate.toLocaleDateString()+ " " +  savingDate.toLocaleTimeString()
    };
    console.log(tab)

    try {
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
            window.location.href = '../../modeGamePage/selectMode.html'
        }
        else{
            console.log("error");
        }
    } catch (err) {
        console.log(err);
    }
}
document.getElementById("saveButton").addEventListener("click",function(){saveGame(event, "local")});

async function resumeGame() {
    let redirect = document.getElementById("resume-link");
    redirect.href ="../playOneVsOne/index.html" ;
}

async function getSavedGames() {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8000/api/game/list`, {
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
    const response = await fetch(`http://localhost:8000/api/game/retrieve/${gameId}`, {
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
            //if the game is finished delete the saved game from the database
            // if (winner === playerRed || winner === playerYellow) {
            //
            // }
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
    const response = await fetch(`http://localhost:8000/api/game/delete/${gameId}`, {
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
    im1.style.display = "block";

    let im = document.getElementById("left");
    im.style.display = "none";
    yellowTime--;

    if (yellowTime >= 0) {
        yellowTimer.textContent = yellowTime;
    } else {
        clearInterval(yellowCountdown);
        yellowTimer.textContent = 'Time\'s up!';
    }
}

function decrementRed() {
    let timer = document.getElementById("tl");
    timer.style.display = "none";

    let timer2 = document.getElementById("tr");
    timer2.style.display = "none";

    let im1 = document.getElementById("left");
    im1.style.display = "block";

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