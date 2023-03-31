
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
                                            
                                            
                                        </div>
    `;
                playerList.appendChild(playerItem);
                //don't show the current user
                if (player.username === localStorage.getItem('username')) {
                    playerItem.style.display = "none";
                }
            }
            document.querySelectorAll('.game-button').forEach(button => button.addEventListener('click',  sendInvite));

        }
    } else {
        console.log('Failed to retrieve players');
    }
}
async function getFriends() {
    console.log('loading friends');
    const token = localStorage.getItem('token').toString();

    const response = await fetch('http://' + localHost + ':8000/api/friend/friends', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    });

    if (response.ok) {
        const friends = await response.json();
        console.log("friends : ", friends);
        const friendList = document.getElementById('friend-list');
        friendList.innerHTML = '';
        if (friends.length === 0) {
            friendList.innerHTML = '<li>You have no friends yet.</li>';
        } else {
            for (let i = 0; i < friends.length; i++) {
                const friend = friends[i];
                const friendName = friend.name;
                const friendItem = document.createElement('li');
                friendItem.classList.add('friend-li');
                friendItem.textContent = friendName;

                // Create the delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Supprimer';
                deleteButton.setAttribute('data-player', friend.token);
                deleteButton.addEventListener('click', deleteFriend);
                friendItem.appendChild(deleteButton);

                // Create the challenge button
                const challengeButton = document.createElement('button');
                challengeButton.textContent = 'Nouveau défi';
                challengeButton.addEventListener('click', () => {
                    window.location.href ="../playOneVsOne/index.html";
                    // handle the click event to invite the friend to a game
                });
                friendItem.appendChild(challengeButton);



                const trashIcon = document.createElement('i');
                trashIcon.classList.add('gg-trash', 'trash-icon');
                trashIcon.setAttribute('data-player', friend.token);
                trashIcon.addEventListener('click', () => {
                    // handle the click event to delete the friend
                });
                friendItem.appendChild(trashIcon);
                friendList.appendChild(friendItem);
            }
        }
    } else {
        console.log('Failed to retrieve friends');
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

        // event.target.parentElement.remove();
        if (data.error) {
            alert(data.error);
        } else {
            alert("send request successfully");
        }
    }
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


async function getPlayers2() {
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
        const playerList = [];

        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            playerList.push(player);
        }

        return playerList;
    } else {
        console.log('Failed to retrieve players');
        return [];
    }
}

async function deleteFriend(event) {
    event.preventDefault();

        const requestToken = event.target.getAttribute('data-player');
        const playerToken = localStorage.getItem('token');
        console.log("this is the player id : ", playerToken);
        console.log("this is the requester token: ", requestToken);

        const response = await fetch('http://' + localHost + ':8000/api/friend/removeFriend/£{playerToken}/${requestToken}', {
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
            console.log('friend  deleted');
            event.target.parentElement.remove();
        }
        else {
            console.log('Failed to delete friend request');
        }


}

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
                                            <button data-player="${player.token}" class="game-button">${player.name}</button>
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

    const response = await fetch('http://' + localHost + ':8000/api/friend/accept/${playerToken}/%{requestToken}', {
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

        const response = await fetch('http://' + localHost + ':8000/api/friend/reject/£{playerToken}/${requestToken}', {
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
    getPlayers().then(r => console.log('players loaded'));
    getFriends().then(r => console.log('friends loaded'));
    getFriendRequests().then(r => console.log('players loaded'));

}

