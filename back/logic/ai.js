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

    // add a child to the node
    addChild(child) {
        this.children.push(child);
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
        let possibleMoves = node.gameState.getPossibleMoves();
        // if there are no possible moves, return the node
        if (possibleMoves.length === 0) {
            return node;
        }
        // if there are possible moves, get a random move
        let randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        // create a new state from the state of the node and the random move
        let newState = node.gameState.getNewState(randomMove);
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
        let newState = new State(node.gameState);
        // while the game is not over
        while (!newState.isGameOver()) {
            // get the possible moves from the new state
            let possibleMoves = newState.getPossibleMoves();
            // if there are no possible moves, break
            if (possibleMoves.length === 0) {
                break;
            }
            // if there are possible moves, get a random move
            let randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            // create a new state from the new state and the random move
            newState = newState.getNewState(randomMove);
        }
        // return the winner of the game
        return newState.getWinner();
    }
    
    // backpropagate the result
    backpropagate(node, result) {
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

