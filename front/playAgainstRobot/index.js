var playerRed = "RED";
var playerYellow = "YELLOW";

var playerToStart;

var currentPlayer = playerToStart;
var previousPlayer = null;

var gameOver = false;
var winner = null;

const localHost = 'localhost';
const url = '44.201.141.34';
let localHostOrUrl = url;

// Stoque la matrice du jeu dont les éléments sont, 
// si remplis, soit 'RED' soit 'YELLOW'
var boardMatrix = boardMatrix;

// Stoque la matrice du jeu dont les éléments sont, 
// si remplis, sont les tiles du DOM
var boardGame;

var rows = 6;
var columns = 7;

var durationLimit = 1000;
let IAStartFirst = false;

window.onload = function() {

    setup(2);

    if (IAStartFirst) {
        main();
    }
    else {
        main();
        IAfillsATile();
    }

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

            tile.addEventListener("click", IAfillsATile);
            document.getElementById("board").append(tile);

        }

    }
    return boardGame;
}

function getTile(i, j) {
    let target = document.getElementById(i.toString() + "-" + j.toString());
    return target;
}

let lastMove = [];

function updateLastMove(move) {
    if (move == []) {
    }
    else {
        lastMove = move;
    }
}

function fillTheClickedTile() {

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

    updateLastMove(humanLastMove);

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

function fromBoardMatrixToBoardGame() {
    let board = [];
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            if (boardMatrix[i][j] == ' ') {
                board[i][j] = emptyCercle;
            }
            else if (boardMatrix[i][j] == playerRed) {
                board[i][j] = redCercle;
            }
            else if (boardMatrix[i][j] == playerYellow) {
                board[i][j] = yellowCercle;
            }
        }
    }
    return board;
}

let round = 0;
let adjustedCoordinates;

function IAfillsATile() {

    console.log("------------- Tour n° ------------- ", ++round);
    if (gameOver) {
        return;
    }

    nextMove(lastMove)
        .then((nextMove) => {
            let IAmove = nextMove;
            console.log("IA next move", IAmove);
            fillTileOfCoords(IAmove[1], IAmove[0]);
            checkWinner();
        })
        .catch((error) => {
            console.error("An error occurred: ", error);
        });

}

function nextMove(lastMove) {
    return new Promise((resolve, reject) => {
        let start = performance.now();
        console.log("Human last move was :", lastMove);

        let whosTurn;
        if (currentPlayer == playerRed) whosTurn = redCercle;
        else if (currentPlayer == playerYellow) whosTurn = yellowCercle;

        let moveColumn = suggestMove(fromBoardMatrixToBoardGame(), whosTurn, durationLimit);
        let moveRow = rows - 1;

        adjustedCoordinates = adjustCoordinates(moveRow, moveColumn);

        let end = performance.now() - start;
        console.log("IA thinking .........  ");
        console.log("The process of choosing the next move took ", end, " ms.");

        let nextMove = [ adjustedCoordinates[1], adjustedCoordinates[0] ];
        resolve(nextMove);
    });
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
                        const url = `../playAgainstRobot/goodLuck.html?winnerColor=${winner}`;
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

//////////////////////////////// START OUR IA //////////////////////////////////////

var invalidCercle = -1;
var emptyCercle = 0;
var yellowCercle = 1;
var redCercle = 2;
var drawCercle = 3;

// Tested
function get(board, row, col) {
    if ( row < 0 || row >= rows || col < 0 || col >= columns ) {
        return invalidCercle;
    }
    return board[row][col];
}

// Tested
function colIsFull(board, col) {
    return get(board, 0, col) != emptyCercle;
}

// Tested
function generateCopyOfBoard(boardToCopy) {
    let newBoard = [];
    for ( let r = 0 ; r < rows ; r++ ) {
        newBoard[r] = [];
        for ( let c = 0 ; c < columns ; c++ ) {
            newBoard[r][c] = boardToCopy[r][c];
        }
    }
    return newBoard;
}

// Tested
function fillIndex(board, col, value) {
    if ( colIsFull(board, col) ) {
        return 0;
    }
    for ( let r = rows - 1 ; r >= 0 ; r-- ) {
        if ( board[r][col] == emptyCercle ) {
            board[r][col] = value;
            break;
        }
    }
    return 1;
}

// Tested
function checkDiagonalInBoard(board, r, c) {
    if (r < 3 && c < 4) {
        if (board[r][c] === board[r+1][c+1] && board[r][c] === board[r+2][c+2] && board[r][c] === board[r+3][c+3]) {
            return true;
        }
    }
    if (r < 3 && c > 2) {
        if (board[r][c] === board[r+1][c-1] && board[r][c] === board[r+2][c-2] && board[r][c] === board[r+3][c-3]) {
            return true;
        }
    }
    return false;
}

// Tested
function checkHorizontalInBoard(board, r, c) {
    if (c < 4) {
        if (board[r][c] == board[r][c+1] && board[r][c] == board[r][c+2] && board[r][c] == board[r][c+3]) {
            return true;
        }
    }
    return false;
}

// Tested
function checkVerticalInBoard(board, r, c) {
    if (r < 3) {
        if (board[r][c] === board[r+1][c] && board[r][c] === board[r+2][c] && board[r][c] === board[r+3][c]) {
            return true;
        }
    }
    return false;
}

// Tested
function getWinner(board) {
    let empty = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let color = get(board, r, c);
            if ( color == emptyCercle ) {
                empty++;
                continue;
            }
            if ( checkHorizontalInBoard(board, r, c) || checkVerticalInBoard(board, r, c) || checkDiagonalInBoard(board, r, c) ) {
                return color;
            }
        }
    }
    if ( empty == 0 ) {
        return drawCercle;
    }
    return emptyCercle;
}

// Tested
function suggestMove(board, whosTurn, durationLimit) {

    let endTime;
    let bestMove = -1;
    let bestRatio = 0;
    let gamesPerMove = 100;
    for ( let c = 0 ; c < columns ; c++ ) {
        let startTime = performance.now();
        if (colIsFull(board, c)) {
            continue;
        }
        let wins = 0;
        let losts = 0;
        let i = 0;

        let duration;
        while (  i < gamesPerMove ) {
            let copy = generateCopyOfBoard(board);
            fillIndex(copy, c, whosTurn);
            if (getWinner(copy) == whosTurn) {
                return c;
            }
            let next = ( whosTurn == yellowCercle ) ? redCercle : yellowCercle;
            let winner = randomGame(copy, next);
            if (winner == yellowCercle || winner == redCercle) {
                if (winner == whosTurn) {
                    wins++;
                } else {
                    losts++;
                }
            }
            endTime = performance.now();
            duration = endTime - startTime;
            i += 1;
            // if ( duration >= ( ( durationLimit / 7 ) - 2 ) ) {
            //     break;
            // }
        }
        let ratio = wins / losts;
        // console.log("Move : ", c, " has ratio ", (Math.round(ratio * 100) / 100), " took : ", Math.floor(duration), " ms ", i, " parties simulées !");
        if (ratio > bestRatio || bestMove == -1) {
            bestRatio = ratio;
            bestMove = c;
        }
    }
    return bestMove;
}

// Tested
function randomGame(board, whosTurn) {
    while ( true ) {
        var col = Math.floor(Math.random() * 7)
        if ( fillIndex(board, col, whosTurn ) ) {
            whosTurn = ( whosTurn == yellowCercle ) ? redCercle : yellowCercle;
        }
        let winner = getWinner(board);
        if ( winner != emptyCercle ) {
            return winner;
        }
    }
}

function setup(AIplays) {
    if (AIplays === 2){
        IAStartFirst = true;
    }
    else if (AIplays === 1) {
        IAStartFirst = false;
    }
    return true;
}

// exports.setup = setup;
// exports.nextMove = nextMove;

////////////////////////////////// END IA //////////////////////////////////////
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
            window.location.href = '../../modeGamePage/selectMode.html'
        }
        else{
            console.log("error");
        }
    } catch (err) {
        console.log(err);
    }
}
document.getElementById("saveButton2").addEventListener("click",function(){saveGame(event, "IA")});

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
                                            <button data-game="${game._id}" class="game-button"><IA></IA> - ${game.date}</button>
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
