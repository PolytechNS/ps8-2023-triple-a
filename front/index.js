

var playerRed = "red";
var playerYellow = "yloow";
var playerToStart;
playerToStart = playerRed;
var currentPlayer = playerToStart;

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
            // JS
            row.push(' ');
            // HTML
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            //tile.addEventListener("click", setPiece);
            console.log(tile.classList);
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}

/**
function setPiece() {
    if (gameOver) {
        return;
    }

    //get coords of that tile clicked
    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    // figure out which row the current column should be on
    r = currColumns[c]; 

    if (r < 0) { // board[r][c] != ' '
        return;
    }

    board[r][c] = currentPlayer; //update JS board
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currentPlayer == playerRed) {
        tile.classList.add("red-piece");
        currentPlayer = playerYellow;
    }
    else {
        tile.classList.add("yellow-piece");
        currentPlayer = playerRed;
    }

    r -= 1; //update the row height for that column
    currColumns[c] = r; //update the array

    checkWinner();
}*/