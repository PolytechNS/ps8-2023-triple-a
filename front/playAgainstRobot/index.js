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

// Stoque la matrice du jeu dont les éléments sont, 
// si remplis, sont les tiles du DOM
var boardGame;

var rows = 6;
var columns = 7;
var currColumns = []; //keeps track of which row each column is at.

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

    currColumns = [5, 5, 5, 5, 5, 5, 5];

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

function getAvailableCoordinates(gameState) {
    let availableCoordinates = [];
    for (let i = 0; i < gameState.length - 1 ; i++) {
        for (let j = 0; j < gameState[i].length; j++) {
            if (gameState[i][j] == ' ' && gameState[i + 1][j] != ' ') {
                availableCoordinates.push([i, j]);
            }
        }
    }
    for (let j = 0; j < gameState[rows - 1].length; j++) {
        if (gameState[rows - 1][j] == ' ') {
            availableCoordinates.push([rows - 1, j]);
        }
    }
    return availableCoordinates;
}

function fillTheClickedTile() {

    if (gameOver) {
        return;
    }

    let coords = this.id.split("-");
    let oldR = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    // r = currColumns[c]; 

    let adjustedCoords = adjustCoordinates(oldR, c);

    let r = adjustedCoords[0];
    c = adjustedCoords[1];
    
    if ( r == 0 && oldR == 0 ) {
        window.alert("This column is full");
        fillTheClickedTile();
    }

    console.log("adjusted coords", adjustedCoords);

    let tile = document.getElementById(r.toString() + "-" + c.toString());
    
    fillTile(tile);

    // r -= 1;
    // currColumns[c] = r;

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
        console.log("current player", currentPlayer);
    }
    else if (currentPlayer == playerYellow) {
        getTile(i, j).classList.add("yellow-piece");
        previousPlayer = currentPlayer;
        currentPlayer = playerRed;
        console.log("current player", currentPlayer);
    }

    boardMatrix[i][j] = previousPlayer;

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

function IAfillsATile() {
    if (gameOver) {
        return;
    }
    const move = computeMove(boardMatrix);
    console.log("L'IA a choisi de remplir :", move);

    setTimeout(() => {
        fillTileOfCoords(move[0], move[1]);
        checkWinner();
    }, 1000);

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
                        console.log(winner + " wins !");
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

/////////////////////////////// IA /////////////////////////////////////

// // function computeMove(gameState) {
// //     while(true) {
// //         // Get a random column (integer between 0 and 6)
// //         let i = Math.floor(Math.random() * 7);
// //         for (let j=0 ; j<=5 ; j++) {
// //             if (gameState.board[i][j] === 0) {
// //                 return [i, j];
// //             }
// //         }
// //     }
// // }

//a node class for the tree to use in the monte carlo tree search
class Node {

    constructor(parent, gameState, move) {
        this.parent = parent;
        this.gameState = gameState;
        this.move = move;
        this.children = [];
        this.visits = 0;
        this.wins = 0;
    }

    getNewState(move) {
        let newState = copyOfBoard();
        newState[move[0]][move[1]] = currentPlayer;
        return newState;
    }

    // add a child to the node
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }

    // get the child with the highest UCT value
    getBestChild() {
        let bestChild = this.children[0];
        for (let child of this.children) {
            if (child.getUCT() > bestChild.getUCT()) {
                bestChild = child;
            }
        }
        return bestChild;
    }

    // get the UCT value of the node
    getUCT() {
        if (this.visits === 0) {
            return 0;
        }
        return this.wins / this.visits + Math.sqrt(2) * Math.sqrt(Math.log(this.parent.visits) / this.visits);
    }

    // get the child with the highest number of visits
    getMostVisitedChild() {
        let bestChild = this.children[0];
        for (let child of this.children) {
            if (child.visits > bestChild.visits) {
                bestChild = child;
            }
        }
        return bestChild;
    }

    // get the child with the highest number of wins
    getMostWinningChild() {
        let bestChild = this.children[0];
        for (let child of this.children) {
            if (child.wins > bestChild.wins) {
                bestChild = child;
            }
        }
        return bestChild;
    }

    // get the child with the highest win rate
    getHighestWinRateChild() {
        let bestChild = this.children[0];
        for (let child of this.children) {
            if (child.wins / child.visits > bestChild.wins / bestChild.visits) {
                bestChild = child;
            }
        }
        return bestChild;
    }
    
    getPossibleMoves(gameState) {
        return getAvailableCoordinates(gameState);
    }

}

//a MCTS class to use in the Monte Carlo tree search
class MCTS {

    constructor() {
        this.root = null;
    }

    // get the best move for the current state
    getBestMove(gameState) {
        // if the root is null, create a new root
        if (this.root === null) {
            this.root = new Node(null, gameState, null);
        }
        // if the root is not null, find the child with the same state as the current state
        else {
            for (let child of this.root.children) {
                if (child.gameState === gameState) {
                    this.root = child;
                    break;
                }
            }
        }
        // run the monte carlo tree search 100 times
        for (let i = 0; i < 100; i++) {
            this.monteCarloTreeSearch();
        }
        // return the best move
        return this.root.getBestChild().move;
    }

    // run the monte carlo tree search
    monteCarloTreeSearch() {
        // select a leaf node
        let leaf = this.selectLeaf(this.root);
        // expand the leaf node
        let expandedLeaf = this.expandLeaf(leaf);
        // simulate the game from the expanded leaf node
        let result = this.simulateGame(expandedLeaf);
        // backpropagate the result
        this.backpropagate(expandedLeaf, result);
    }

    // select a leaf node
    selectLeaf(node) {
        // if the node is a leaf node, return the node
        if (node.children.length === 0) {
            return node;
        }
        // if the node is not a leaf node, get the best child and return the result of the selectLeaf function with the best child as the argument
        else {
            return this.selectLeaf(node.getBestChild());
        }
    }

    // expand the leaf node
    expandLeaf(node) {
        // get the possible moves from the state of the node
        let possibleMoves = node.getPossibleMoves(boardMatrix);
        // if there are no possible moves, return the node
        if (possibleMoves.length === 0) {
            return node;
        }
        // if there are possible moves, get a random move
        let randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        // create a new state from the state of the node and the random move
        let newState = node.getNewState(randomMove);
        // create a new child node from the new state and the random move
        let child = new Node(node, newState, randomMove);
        // add the child to the node
        node.addChild(child);
        // return the child
        return child;
    }

    // simulate the game from the expanded leaf node
    simulateGame(node) {
        // create a new state from the state of the node
        let newState = node.gameState;
        // while the game is not over
        for ( let i = 0; i < 42; i++ ) {
            // get the possible moves from the new state
            let possibleMoves = node.getPossibleMoves(newState);
            // if there are no possible moves, break
            if (possibleMoves.length === 0) {
                break;
            }
            // if there are possible moves, get a random move
            let randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            // create a new state from the new state and the random move
            newState = node.getNewState(randomMove);
        }
        // return the winner of the game
        return checkWinner();
    }
    
    // backpropagate the result
    backpropagate(node, result) {
        result = 1;
        // if the node is not null
        if (node !== null) {
            // if the result is 1, add 1 to the wins of the node
            if (result === 1) {
                node.wins++;
            }
            // add 1 to the visits of the node
            node.visits++;
            // run the backpropagate function with the parent of the node as the argument
            this.backpropagate(node.parent, result);
        }
    }
}

function computeMove(gameState) {
    let mcts = new MCTS();
    let bestMove = mcts.getBestMove(gameState);
    return bestMove;
}

