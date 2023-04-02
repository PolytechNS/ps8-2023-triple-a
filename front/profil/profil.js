const localHost = 'localhost';
const url = '15.236.164.81';
let name = localStorage.getItem('username');
console.log("score is :", localStorage.getItem('score'));

console.log(localStorage.getItem('username'));
const zebi = "John";
document.getElementById("name").textContent = zebi;

async function getUsername(event) {
  event.preventDefault();
  const token = localStorage.getItem('token').toString();
  const response = await fetch('http://' + localHost + ':8000/api/game/user/${token}', {
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
  const response = await fetch('http://' + localHost + ':8000/api/online/data/${token}', {
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