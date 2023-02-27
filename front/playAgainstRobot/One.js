import { getBestMoveOddEven, combineLastMovewithGameState } from "./index.js";

export function nextMove(lastMove) {
    let bestMove = getBestMoveOddEven(combineLastMovewithGameState(lastMove, boardMatrix));
    return bestMove;
}

function setup(AIplays){
    AIplays = 2;
    return true;
}
