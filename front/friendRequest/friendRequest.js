const localHost = 'localhost';
const url = '15.236.164.81';
let localHostOrUrl = localHost;

let persons = [];
async function getFriendRequests() {

    console.log('loading req');
    const token = localStorage.getItem('token');

    const response = await fetch('http://' + localHostOrUrl + ':8000/api/friend/requestList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    });
    if (response.ok) {
        const players = await response.json();
        const playerList = document.getElementById('players-list');
        playerList.innerHTML = '';
        if (players.length === 0) {
            playerList.innerHTML = '<li>You have 0 friend request.</li>';
        } else {
            for (let i = 0; i < players.length; i++) {
                const player = players[i];
                const playerItem = document.createElement('li');



                console.log("player token : ", player.token);
                console.log("storage token :",localStorage.getItem('token'));


                // gameItem.innerHTML = `<button data-player="${player._id}" class="player-button">local - ${player.date}</button>`;
                playerItem.innerHTML = `
                                        <div class="game-container">
                                            <button data-player="${player.token}" class="game-button2">${player.name}</button>
                                            <i class="gg-trash" data-player="${player.token}"></i>
                                            
                                        </div>
    `;
                playerList.appendChild(playerItem);

            }
            document.querySelectorAll('.game-button').forEach(button => button.addEventListener('click',  acceptRequest));

            for (const icon of document.querySelectorAll('.gg-trash')) {
                icon.addEventListener('click', await rejectRequest);
            }

        }
    } else {
        console.log('Failed to retrieve players');
    }
}

async function acceptRequest(event) {
    event.preventDefault();

    const requestToken = event.target.getAttribute('data-player');
    const playerToken = localStorage.getItem('token');
    console.log("this is the player id : ", playerToken);
    console.log("user name to be added : ", event.target.innerHTML);

    const response = await fetch('http://' + localHostOrUrl + ':8000/api/friend/accept/${playerToken}/%{requestToken}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playerToken: playerToken,
            thisUsername : localStorage.getItem('username'),
            userNameToBeAdded : event.target.innerHTML,
            requestToken: requestToken,


        })

    });
    if (response.ok) {
        console.log('friend request accepted and request deleted');
        event.target.parentElement.remove();
    } else {
        console.log('Failed to accept friend request');
    }
}
async function rejectRequest(event) {
    event.preventDefault();

        const requestToken = event.target.getAttribute('data-player');
        const playerToken = localStorage.getItem('token');
        console.log("this is the player id : ", playerToken);
        console.log("this is the requester token: ", requestToken);

        const response = await fetch('http://' + localHostOrUrl + ':8000/api/friend/reject/£{playerToken}/${requestToken}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playerToken: playerToken,
                requestToken: requestToken,

            })
        });
        if (response.ok) {
            console.log('friend request deleted');
            event.target.parentElement.remove();
        }
        else {
            console.log('Failed to delete friend request');
        }


}
window.onload = function() {
    getFriendRequests().then(r => console.log('players loaded'));
}