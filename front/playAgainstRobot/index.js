var playerRed = "RED";
var playerYellow = "YELLOW";

var playerToStart;

var currentPlayer = playerToStart;
var previousPlayer = null;

var gameOver = false;
var winner = null;

// Stoque la matrice du jeu dont les éléments sont, 
// si remplis, soit 'RED' soit 'YELLOW'
var boardMatrix;

var boardMatrix = boardMatrix;

// Stoque la matrice du jeu dont les éléments sont, 
// si remplis, sont les tiles du DOM
var boardGame;

var rows = 6;
var columns = 7;

var durationLimit = 1000;

window.onload = function() {
    main();
}

function main() {
    setPlayerToStart(playerYellow);
    setBoard();
}      

function copyOfBoard() {
    let copy = [];
    for (let r = 0; r < rows; r++) {
        copy[r] = [];
        for (let c = 0; c < columns; c++) {
            copy[r][c] = boardMatrix[r][c];
        }
    }
    return copy;
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
    for (let i = 0; i < boardMatrix.length - 1 ; i++) {
        for (let j = 0; j < boardMatrix[i].length; j++) {
            if (boardMatrix[i][j] == ' ' && boardMatrix[i + 1][j] != ' ') {
                availableCoordinates.push([i, j]);
            }
        }
    }
    for (let j = 0; j < boardMatrix[rows - 1].length; j++) {
        if (boardMatrix[rows - 1][j] == ' ') {
            availableCoordinates.push([rows - 1, j]);
        }
    }
    return availableCoordinates;
}

let lastMove;

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
    lastMove = [r, c];

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

function IAfillsATile() {

    console.log("------------- Tour n° ------------- ", ++round);
    if (gameOver) {
        return;
    }
    
    // let move = getAvailableCoordinates();
    // console.log("Thinking ....");
    // move = move[Math.floor(Math.random() * move.length)];

    let whosTurn;
    if (currentPlayer == playerRed) {
        whosTurn = redCercle;
    }
    else if (currentPlayer == playerYellow) {
        whosTurn = yellowCercle;
    }

    let start = performance.now();

    let moveColumn = suggestMove(fromBoardMatrixToBoardGame(), whosTurn, durationLimit);
    let moveRow = rows - 1;

    let adjustedCoordinates = adjustCoordinates(moveRow, moveColumn);

    console.log("L'IA a choisi de remplir :", adjustedCoordinates[0], adjustedCoordinates[1]);

    fillTileOfCoords(adjustedCoordinates[0], adjustedCoordinates[1]);

    let end = performance.now() - start;
    console.log("The process of choosing the best move took ", end, " ms.");
    checkWinner();
  
}

function randomAvailableCoordinates() {

    let intermediate = [];

    for ( let j = 0; j < columns; ++j ) {
        if ( boardMatrix[rows - 1][j] == ' ' ) {
            intermediate.push([rows - 1, j]);
        }
    }

    for ( let j = 0; j < columns; ++j ) {
        for (let i = rows - 2; i >= 0; --i) {
            if (boardMatrix[i][j] == ' ' && boardMatrix[i + 1][j] != ' ') {
                intermediate.push([i, j]);
            }
        }
    }

    let index = Math.floor(Math.random() * (intermediate.length - 1));

    return intermediate[index];
}

function isBoardFull(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === ' ') {
                return false;
            }
        }
    }
    return true;
}

function checkWinner() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (boardMatrix[r][c] != ' ') {
                if (checkHorizontal(r, c) || checkVertical(r, c) || checkDiagonal(r, c)) {
                    gameOver = true; 
                    winner = previousPlayer;
                    setTimeout(() => {
                        // console.log(winner + " wins !");
                        window.alert(winner + " wins !");
                        }, 1000);
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

//////////////////// Début : Save and Restore Game  //////////////////////

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

async function restoreSavedGame(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8000/api/game/resume`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    });
    if (response.ok) {
        const gameData = await response.json();
        if (gameData && gameData.tab) {
            // set boardMatrix to gameData.tab
            boardMatrix = gameData.tab;
            console.log("before for  :",gameData.tab);

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    console.log('this is tile : '  ,getTile(i, j));
                    if (boardMatrix[i][j] === playerRed) {
                        getTile(i, j).classList.add("red-piece");
                    }
                    if (boardMatrix[i][j] === playerYellow) {
                        getTile(i, j).classList.add("yellow-piece");
                    }
                }
            }
            console.log("game resumed :",boardMatrix);
        } else {
            console.log('No game data found for user');
        }
    } else {
        console.log('Failed to retrieve game data');
    }
}

//////////////////// Fin : Save and Restore Game  //////////////////////

// // function computeMove(boardMatrix) {
// //     while(true) {
// //         // Get a random column (integer between 0 and 6)
// //         let i = Math.floor(Math.random() * 7);
// //         for (let j=0 ; j<=5 ; j++) {
// //             if (boardMatrix.board[i][j] === 0) {
// //                 return [i, j];
// //             }
// //         }
// //     }
// // }

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
function printBoard(board) {
    console.log("The BOARD Game:", board);
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
function generateEmptyBoard() {
    let newBoard = [];
    for ( let r = 0 ; r < rows ; r++ ) {
        newBoard[r] = [];
        for ( let c = 0 ; c < columns ; c++ ) {
            newBoard[r][c] = emptyCercle;
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

    let startTime = performance.now();
    let endTime;
    let bestMove = -1;
    let bestRatio = 0;
    let gamesPerMove = 2000;
    for ( let c = 0 ; c < columns ; c++ ) {
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
            if ( duration >= ( ( durationLimit / 7 ) - 2 ) ) {
                break;
            }
        }
        console.log("L'analyse de la colonne ", c, " a pris ", Math.floor(duration), " ms ==> ", i, " parties simulées !");

        let ratio = wins / losts;
        // console.log("Move : ", c, " has ratio ", ratio);
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

////////////////////////////////// END IA //////////////////////////////////////

// function getBestMoveOddEven(boardMatrix) {
//     // get the available coordinates
//     let availableCoordinates = getAvailableCoordinates(boardMatrix);
//     // if there are no available coordinates, return null
//     if (availableCoordinates.length === 0) {
//         return null;
//     }
//     // find the first odd coordinate
//     let firstOdd = availableCoordinates.find(coord => coord[0] % 2 === 1);
//     // find the last even coordinate
//     let lastEven = availableCoordinates.slice().reverse().find(coord => coord[0] % 2 === 0);
//     // if there are no odd coordinates, set the best move to the last even coordinate
//     if (!firstOdd) {
//         return lastEven;
//     }
//     // if there are no even coordinates, set the best move to the first odd coordinate
//     if (!lastEven) {
//         return firstOdd;
//     }
//     // if the first odd coordinate comes before the last even coordinate, set the best move to the first odd coordinate
//     if (firstOdd[1] < lastEven[1]) {
//         return firstOdd;
//     }
//     // otherwise, set the best move to the last even coordinate
//     else {
//         return lastEven;
//     }
// }

// function combineLastMovewithGameState(lastMove, boardMatrix) {
//     console.log("lastMove", lastMove[0], lastMove[1]);
//     console.log("boardMatrix", boardMatrix);
//     boardMatrix[lastMove[0]][lastMove[1]] = ( currentPlayer === playerRed ) ? playerYellow : playerRed;
// }
