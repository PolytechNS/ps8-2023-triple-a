const localHost = 'lohalhost';
const url = '15.236.164.81';
let name = localStorage.getItem('username');

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