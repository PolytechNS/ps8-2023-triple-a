window.player1Name;
window.player2Name;

window.player1Color;
window.player2Color;

const playerName = document.getElementById("player1Name").value;

function get1pseudo() {
    //const playerName = document.getElementById("player1Name").value; 
    window.player1Name = playerName;
    console.log(window.player1Name);
}

const divPlayersNames = document.querySelector('#divNames');
//const divPlayersColors = document.querySelector('#divColors');
let divPlayersColors = document.getElementById('divColors');

function playersChooseTheirColors() {
    const player1Color = document.getElementById("player1Color").value;
    window.player1Color = player1Color;
    const player2Color = document.getElementById("player2Color").value;
    window.player2Color = player2Color;
    console.log(window.player1Color, window.player2Color);
}
