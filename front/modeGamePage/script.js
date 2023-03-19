// import { mode } from './selectMode.html.js';

console.log("Hey i'm mode", "DDD");

let playerOnePseudo = localStorage.getItem('playerOnePseudo');
let playerTwoPseudo = localStorage.getItem('playerTwoPseudo');
document.getElementById('player1Color').placeholder = `Choose ${playerOnePseudo}'s color`;