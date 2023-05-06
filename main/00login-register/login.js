
async function initAuthentification() {
    await initLogin();
    await loadRegisterdUsers();
    await renderAuth('login');
}


async function initLogin() {
    await setURL('https://stefan-herrmann.developerakademie.net/smallest_backend_ever');
    await downloadFromServer();
}


function renderAuth(status) {
    let auth = document.getElementById('authentification');
    if (status === 'login') auth.innerHTML = renderLogin()
    if (status === 'forgetPassword') auth.innerHTML = renderForgotPassword()
    if (status === 'resetPassword') auth.innerHTML = renderResetPassword()
    if (status === 'signUp') auth.innerHTML = renderSignUp()
}


function renderSignUp() {
    return `
<div class="register">
<img class="logo" src="../../assets/img/logo2.png">
<div class="sign-up-container">
<img onclick="initAuthentification('login')" class="arrow-back" src="../../assets/img/backArrow.png">
    <div class="sign-up">
        <h2>Sign up</h2>
        <form onsubmit="registerUser();">
            <input type="text" id="name" name="name" required placeholder="Name">
            <input type="email" id="email" name="email" required placeholder="Email">
            <input minlength="6" maxlength="20" type="password" id="password" name="Password" required placeholder="Password">
                       <div class="menu-btn">
                <button class="btn-1" type="submit"><nobr>Sign up</nobr></button>
                <button class="btn-2" onclick="renderAuth('login')">Back</button>
            </div>
        </form>
    </div>
</div>
</div>
</div>` }


function renderLogin() {
    return `
<div class="register">
<img class="logo" src="../../assets/img/logo2.png">
<div class="to-register">Not a Join user?
<button class="btn-1" onclick="renderAuth('signUp')"><nobr>Sign up</nobr></button>
</div>
<div class="sign-up-container">
    <div class="sign-up">
        <h2>Log in</h2>
        <form onsubmit="usersLogin()">  
            <input type="email" id="email" name="email" required placeholder="Email">
            <input type="password" minlength="6" maxlength="20"  id="password" name="password" required placeholder="Password">
            <div class="login-option">
            <div class="remember-me">
            <input type="checkbox" >
            <nobr class="mgn-l">Remember me</nobr>
            </div>
            <a class="highlight-blue" onclick="renderAuth('forgetPassword')">
            <nobr>Forgot my password</nobr></a>
            </div>
            <div class="menu-btn">
                <button class="btn-1" type="submit">Log in</button>
                <button class="btn-2" type="button" onclick="loginAsGuest()"><nobr>Guest Log in</nobr></button>
            </div>            
        </form>
    </div>
</div>
</div>
</div>` }


function renderForgotPassword() {
    return `
    <div class="register">
    <img class="logo" src="../../assets/img/logo2.png">
    <div class="forgot-password-container">
        <img onclick="initAuthentification('login')" class="arrow-back" src="../../assets/img/backArrow.png">
        <div class="forgot-password">
            <h2>I forgot my password</h2>
            <div> Don't worry! We will send you an email with the instructions to reset your password.
            </div>
            <form onsubmit="forgotPassword(event)">
                <input type="email" id="email" name="email" required placeholder="Email">
                <div class="menu-btn color-white">
                    <button class="btn-1" type="submit"><nobr>Send me the email</nobr></button>
                </div>
            </form>
        </div>
    </div>
</div>
` }


function renderResetPassword() {
    return `
    <div class="register">
    <img class="logo" src="../../assets/img/login/logo.png">
    <div class="forgot-password-container">
        <img onclick="initAuthentification('login')" class="arrow-back" src="../../assets/img/backArrow.png">
        <div class="reset-password">
            <h2>Reset your password</h2>
            <div> Change your account password
            </div>
            <form onsubmit="createUser(event)">
                <input type="password" minlength="6" maxlength="20" id="password" name="Password" required placeholder="Password">
                <input type="password" id="passwordValidation" name="passwordValidaton" required
                    placeholder="Confirm password">
                <div class="menu-btn color-white">
                    <button type="submit">
                        <nobr>Continue</nobr>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
` }


function loginAsGuest() {
    window.open('/../../main/01summary/summary.html');       
}


function registerUser() {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    passwordValidation();
    registeredUsers.push({ 'name': name, 'email': email, 'password': password });
    addUsers();
    renderAuth('login');
};


function passwordValidation() {
    for (let i = 0; i < registeredUsers.length; i++) {
        if (registerUser.value == registeredUsers[i]['email']) {
            alert('That username already exists please choose another one');
            return;
        }
    }
}


/**
 * Saves tasks in the backend in form of an JSON string */
async function addUsers() { //check async: no diff
    if (event) event.preventDefault();
    let registerdUsersAsText = JSON.stringify(registeredUsers);
    await backend.setItem('registeredUsers', registerdUsersAsText);
}

function loadRegisterdUsers() {
    if (event) event.preventDefault();
    let registeredUsersAsText = backend.getItem('registeredUsers');
    if (registeredUsersAsText) registeredUsers = JSON.parse(registeredUsersAsText);
}


function usersLogin() {
    event.preventDefault();
    checkLogin();
}


function checkLogin() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    for (let i = 0; i < registeredUsers.length; i++) {
        let element = registeredUsers[i];
        if (email.value == element['email'] &&
            password.value == element['password']) {
            loggedInUser = element // create loggedInUser object
            let url = '../01summary/summary.html?loggedInUser=' + encodeURIComponent(JSON.stringify(loggedInUser));
            window.open(url);
            email.value = '';
            password.value = '';
            return;
        }
    }
    alert('Username or Password is not correct!');
}



async function forgotPassword(event) {
    event.preventDefault();
    const email = getId('email').value;
    const user = registeredUsers.find(user => user.email === email);
    if (user) {
        const token = generateRandomToken();
        user.resetToken = token;
        try {
            await sendForgotPasswordEmail(email, token);
            alert('Password reset link has been sent to your email');
        } catch (error) {
            console.error(error);
            alert('Error sending the email. Please try again later.');
        }
    } else {
        alert('No user found with this email');
    }
};


async function sendForgotPasswordEmail(email, token) {
    const resetUrl = window.location.origin + '/Join/main/00login-register/resetPassword.html?token=' + token;
    const message = `Click the following link to reset your password: ${resetUrl}`;
    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', 'Password Reset');
    formData.append('message', message);
    const response = await fetch('https://stefan-herrmann.developerakademie.net/send_mail/send_mail.php', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to send email');
    }
}


function generateRandomToken() {
    const tokenLength = 20;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < tokenLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}




