document.getElementById("loginButton").addEventListener('click', login);
async function login() {
    const values = {
        username: document.getElementsByName("log_name")[0].value,
        password: await hash(document.getElementsByName("log_pswd")[0].value),
    };

    fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.token) {
                document.cookie = "token=" + data.token + ";path=/";
                document.cookie = "username=" + data.username + ";path=/";
                console.log(document.cookie);
                window.location.href = '/home/home.html';
            } else {
                window.alert("Wrong username or password");
            }
        })
        .catch(error => {
            console.error(error);
        });
}

document.getElementById("registerButton").addEventListener('click', register);
async function register() {
    const clearPassword = document.getElementsByName("reg_pswd")[0].value;
    const confirmClearPassword = document.getElementsByName("reg_pswd2")[0].value;

    if (await confirmPassword(clearPassword, confirmClearPassword)) {
        console.log("passwords are the same");
        const values = {
            username: document.getElementsByName("reg_name")[0].value,
            password: await hash(clearPassword),
            email: document.getElementsByName("reg_email")[0].value,
        };

        fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status==="failure") {
                    window.alert("Username already taken");
                } else {
                    window.alert("Registration successful");
                }
            })
    }

    else

        document.getElementById("errorMessage").style.display = "block";
}

function hash(data) {
    const encoder = new TextEncoder();
    const message = encoder.encode(data);
    return crypto.subtle.digest('SHA-256', message)
        .then(hash => {
            return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
        })
        .catch(err => {
            console.error(err);
        });
}

async function confirmPassword(clearPassword, confirmClearPassword) {
    const hashedPassword = await hash(clearPassword);
    const confirmedHashedPassword = await hash(confirmClearPassword);
    return (hashedPassword === confirmedHashedPassword);
}