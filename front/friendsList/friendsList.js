
const localHost = 'localhost';
let persons = [];
async function getPlayers() {

    console.log('loading players');
    const token = localStorage.getItem('token').toString();

    const response = await fetch('http://' + localHost + ':8000/api/game/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    });
    if (response.ok) {
        const players = await response.json();
        console.log("players : ", players);
        const playerList = document.getElementById('players-list');
        playerList.innerHTML = '';
        if (players.length === 0) {
            playerList.innerHTML = '<li>No players registered yet.</li>';
        } else {
            for (let i = 0; i < players.length; i++) {
                const player = players[i];
                persons = players[i];
                const playerItem = document.createElement('li');
                // gameItem.innerHTML = `<button data-player="${player._id}" class="player-button">local - ${player.date}</button>`;
                playerItem.innerHTML = `
                                        <div class="game-container">
                                            <button data-player="${player._id}" class="game-button">${player.username}</button>
                                            <i class="gg-trash" data-player="${player._id}"></i>
                                            
                                        </div>
    `;
                playerList.appendChild(playerItem);
            }
            document.querySelectorAll('.game-button').forEach(button => button.addEventListener('click',  sendInvite));

        }
    } else {
        console.log('Failed to retrieve players');
    }
}



async function sendInvite(event) {
    event.preventDefault();

    const playerId = event.target.getAttribute('data-player');
    const name = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    console.log("player name : ", name);
    console.log("this is the player id : ", playerId);

    const response = await fetch('http://' + localHost + ':8000/api/friend/request/${playerId}/${name}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            _id: playerId,
            username: name,
            token: token
        })

    });
    if (response.ok) {
        const data = await response.json();
        console.log("data : ", data);
        if (data.error) {
            alert(data.error);
        } else {
            alert("send request successfully");
        }
    }
}





window.onload = function() {
    getPlayers().then(r => console.log('players loaded'));
}
// const searchinput = document.getElementById('searchinput');
// searchinput.addEventListener('click', function(){
//     const input = searchinput.value;
//     const result = persons.filter(item=>item.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()));
//     let suggestion = '';
//     if(input!==''){
//         result.forEach(resultItem =>
//             suggestion +='<div class = "suggestion">'+resultItem.name+'</div>'
//                 // <div class ="suggestion">${resultItem.name}</div>
//         )
//     }
//     document.getElementById("suggestions").innerHTML = suggestion;
// })