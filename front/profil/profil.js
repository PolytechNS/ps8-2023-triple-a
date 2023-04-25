const localHost = 'localhost';
const url = '44.201.141.34';
let localHostOrUrl = url;

let name = localStorage.getItem('username');
console.log("score is :", localStorage.getItem('score'));

console.log(localStorage.getItem('username'));
const zebi = "John";
document.getElementById("name").textContent = zebi;

async function getUsername(event) {
  event.preventDefault();
  const token = localStorage.getItem('token').toString();
  const response = await fetch('http://' + localHostOrUrl + ':8000/api/game/user/${token}', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({token: token}),
  });

  if (response.status === 200) {
    const data = await response.json();
    name = data.name;
    console.log("the user name is :", data.name);
    // document.getElementById('username').innerHTML = data.name;
  }
  else{
    console.log('Error');
  }

}                          

async function getData(event) {
  event.preventDefault();
  const token = localStorage.getItem('token');
  const response = await fetch('http://' + localHostOrUrl + ':8000/api/online/data/${token}', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({token: token}),
  });

  if (response.status === 200) {
    const data = await response.json();
    console.log(data);
    console.log("the user name is :", data.data.username);
    // document.getElementById('username').innerHTML = data.name;
    console.log("his score is :", data.data.score);
    console.log("his wins is :", data.data.wins);
    console.log("his total games is :", data.data.totalGames);
    document.getElementById("score").innerText = score;
    document.getElementById("wins").innerText = wins;
    document.getElementById("losses").innerText = losses;
    document.getElementById("winrate").innerText = winrate;
    }
  else{
    console.log('Error');
  }
}

async function getPlayers2() {
  console.log('loading players');
  const token = localStorage.getItem('token').toString();

  const response = await fetch('http://' + localHostOrUrl + ':8000/api/game/user', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
  });

  if (response.ok) {
      const players = await response.json();
      console.log("players : ", players);
      const playerList = [];

      for (let i = 0; i < players.length; i++) {
          const player = players[i];
          playerList.push(player);
      }
      console.log("playerList : ", playerList)

      return playerList;
  } else {
      console.log('Failed to retrieve players');
      return [];
  }
}

async function displayPlayersRanking() {
  const players = await getPlayers2();
  players.sort((a, b) => b.score - a.score); // Tri des joueurs par score décroissant
  const playerList = document.createElement('ol'); // Création d'une liste ordonnée pour afficher les joueurs

  players.map((player, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${index + 1}. ${player.username} - ${player.score} points`;
      playerList.appendChild(listItem);
  });

  const rankingContainer = document.getElementById('ranking-container'); // Remplacer 'ranking-container' avec l'ID de l'élément HTML où le classement des joueurs doit être affiché
  rankingContainer.appendChild(playerList);
}

displayPlayersRanking();
