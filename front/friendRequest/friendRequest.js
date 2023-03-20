const localHost = 'localhost';
let persons = [];
async function getFriendRequests() {

    console.log('loading req');
    const token = localStorage.getItem('token');

    const response = await fetch('http://' + localHost + ':8000/api/friend/requestList', {
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
                                            <button data-player="${player._id}" class="game-button">${player.name}</button>
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
window.onload = function() {
    getFriendRequests().then(r => console.log('players loaded'));
}