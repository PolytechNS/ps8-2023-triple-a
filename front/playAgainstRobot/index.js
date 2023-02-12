var playerRed = "RED";
var playerYellow = "YELLOW";
var winner;

var playerToStart;
playerToStart = playerRed;
var itsTheTurnOf = playerToStart;
var previousPlayer = null;

var gameOver = false;
var board;

var rows = 6;
var columns = 7;
var currColumns = []; //keeps track of which row each column is at.

window.onload = function() {
    setBoard();
}

function setBoard() {
    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5];

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(' ');

            let tile = document.createElement("div");

            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");

            tile.addEventListener("click", fillCercle);
            document.getElementById("board").append(tile);

            tile.addEventListener("click", IAFillsARandomCercle);
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}

function IAFillsARandomCercle() {
    setTimeout(fillRandomCercle, 500);
}

//function that fill random circle
function fillRandomCercle() {

    if (gameOver) {
        return;
    } 

    let [r, c] = randomAvailableCoordinates();

    r = currColumns[c]; 

    board[r][c] = itsTheTurnOf;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (itsTheTurnOf == playerRed) {
        tile.classList.add("red-piece");
        itsTheTurnOf = playerYellow;
    }
    else {
        tile.classList.add("yellow-piece");
        itsTheTurnOf = playerRed;
    }

    r -= 1;
    currColumns[c] = r;

    checkWinner();
}

function randomAvailableCoordinates() {

    let intermediate = [];

    for ( let j = 0; j < columns; ++j ) {
        if ( board[rows - 1][j] == ' ' ) {
            intermediate.push([rows - 1, j]);
        }
    }

    for ( let j = 0; j < columns; ++j ) {
        for (let i = rows - 2; i >= 0; --i) {
            if (board[i][j] == ' ' && board[i + 1][j] != ' ') {
                intermediate.push([i, j]);
            }
        }
    }

    let index = Math.floor(Math.random() * (intermediate.length - 1));

    return intermediate[index];
}

function fillCercle() {

    if (gameOver) {
        return;
    }

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currColumns[c]; 

    board[r][c] = itsTheTurnOf;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (itsTheTurnOf == playerRed) {
        tile.classList.add("red-piece");
        itsTheTurnOf = playerYellow;
    }
    else {
        tile.classList.add("yellow-piece");
        itsTheTurnOf = playerRed;
    }
    
    r -= 1;
    currColumns[c] = r;

    checkWinner();
}

function checkWinner() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] != ' ') {
                if (checkHorizontal(r, c) || checkVertical(r, c) || checkDiagonal(r, c)) {
                    if ( itsTheTurnOf == "RED" ) {
                        winner = "YELLOW";
                    }
                    if ( itsTheTurnOf == "YELLOW" ) {
                        winner = "RED";
                    }
                    gameOver = true; 
                    console.log(winner + " wins !");
                }
            }
        }
    }
}

function checkDiagonal(r, c) {
    if (r < 3 && c < 4) {
        if (board[r][c] == board[r+1][c+1] && board[r][c] == board[r+2][c+2] && board[r][c] == board[r+3][c+3]) {
            return true;
        }
    }
    if (r < 3 && c > 2) {
        if (board[r][c] == board[r+1][c-1] && board[r][c] == board[r+2][c-2] && board[r][c] == board[r+3][c-3]) {
            return true;
        }
    }
    return false;
}

function checkHorizontal(r, c) {
    if (c < 4) {
        if (board[r][c] == board[r][c+1] && board[r][c] == board[r][c+2] && board[r][c] == board[r][c+3]) {
            return true;
        }
    }
    return false;
}

function checkVertical(r, c) {
    if (r < 3) {
        if (board[r][c] == board[r+1][c] && board[r][c] == board[r+2][c] && board[r][c] == board[r+3][c]) {
            return true;
        }
    }
    return false;
}

