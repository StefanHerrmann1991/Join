// users moved to data.js

/**
 * this function schowPassword() is used to show the password when clicking on the eye symbol
 */
function showPassword() {
    var x = document.getElementById('password');
    var y = document.getElementById('hide1');
    var z = document.getElementById('hide2');

    if (x.type == 'password') {
        x.type = "text";
        y.style.display = 'block';
        z.style.display = 'none';
    } else {
        x.type = "password";
        y.style.display = 'none';
        z.style.display = 'block';
    }
}
/**
 * this function showPasswordRegister() is used to show the password when clicking on the eye symbol on the register card
 */

function showPasswordRegister() {
    var x = document.getElementById('new-password');
    var y = document.getElementById('hide3');
    var z = document.getElementById('hide4');

    if (x.type == 'password') {
        x.type = "text";
        y.style.display = 'block';
        z.style.display = 'none';
    } else {
        x.type = "password";
        y.style.display = 'none';
        z.style.display = 'block';
    }
}
/**
 * this function checkLogin() checks the data of the inout fields with the users in the JSON and if it is correct you will get to the mainpage
 */

function checkLogin() {
    let username = document.getElementById('user');
    let password = document.getElementById('password');

    for (let i = 0; i < users.length; i++) {
        let element = users[i];

        if (username.value == element['email'] &&
            password.value == element['password']) {
            window.open('index.html');
            username.value = '';
            password.value = '';
            return
        }
    }
    alert('Username or Password is not correct!');
}
/**
 * this function openRegisterWindow() opens the window to register a new user
 */

function openRegisterWindow() {
    document.getElementById('body-login2').classList.remove('display-none');
    document.getElementById('body-login1').classList.add('display-none');
}
/**
 * this function closeRegisterWindow() closes the window to get to the login page
 */

function closeRegisterWindow() {
    document.getElementById('body-login2').classList.add('display-none');
    document.getElementById('body-login1').classList.remove('display-none');
}
/**
 * this function is used to register a new user
 */

function registerNewUser() {
    let registerUser = document.getElementById('new-user');
    let registerPassword = document.getElementById('new-password');
    let newName = document.getElementById('new-name');
    let newUser = {
        //'name' :
        'name': newName.value,
        'email': registerUser.value,
        'password': registerPassword.value,
        'color': randomHexColor(),
        'status': false,
    }

    for (let i = 0; i < users.length; i++) {
        if (registerUser.value == users[i]['email']) {
            alert('that username already exists please choose another');
            return;
        } else if (registerPassword.value.length < 3) {
            alert('that password is too short, include more than 3 characters');
            return;
        }

    }
    users.push(newUser);
    console.log(users);
    saveNewUser();
}
/**
 * this function saves the new user in the local storage
 */
function saveNewUser() {
    let usersAsText = JSON.stringify(users);

    localStorage.setItem('users', usersAsText);
}

/**
 * this function is used to load the users from the local storage
 */

function loadNewUser() {
    let usersAsText = localStorage.getItem('users');
    if (usersAsText) {
        users = JSON.parse(usersAsText);
    }
}