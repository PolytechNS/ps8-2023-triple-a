var playerRed = "RED";
var playerYellow = "YELLOW";
var playerToStart;
playerToStart = playerRed;
var currentPlayer = playerToStart;
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
        console.log(board);
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

    let c = Math.floor(Math.random() * columns);
    let r = rows - 1;

    for (let i = rows - 1; i >= 0; i--) {
        if (board[i][c] == ' ') {
            r = i;
            break;
        }
    }

    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currentPlayer == playerRed) {
        tile.classList.add("red-piece");
        currentPlayer = playerYellow;
    }
    else {
        tile.classList.add("yellow-piece");
        currentPlayer = playerRed;
    }
    checkWinner();
}

function fillCercle() {

    if (gameOver) {
        return;
    }

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currColumns[c]; 

    board[r][c] = currentPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currentPlayer == playerRed) {
        tile.classList.add("red-piece");
        currentPlayer = playerYellow;
    }
    else {
        tile.classList.add("yellow-piece");
        currentPlayer = playerRed;
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
                    if ( currentPlayer == "RED" ) {
                        currentPlayer = "YELLOW";
                    }
                    if ( currentPlayer == "YELLOW" ) {
                        currentPlayer = "RED";
                    }
                    gameOver = true; 
                    console.log(currentPlayer + " wins !");
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

