/**
 * Initializes the authentication process.
 * @returns {Promise<void>} A Promise that resolves when authentication initialization is complete.
 */
async function initAuthentification() {
    await initLogin();
    await loadRegisterdUsers();
    await renderAuth('login');
}


/**
 * Initializes the login process.
 * @returns {Promise<void>} A Promise that resolves when login initialization is complete.
 */
async function initLogin() {
    await setURL('https://stefan-herrmann.developerakademie.net/smallest_backend_ever');
    await downloadFromServer();
}


/**
 * Renders the authentication UI based on the given status.
 * @param {string} status - The status of authentication ('login', 'forgetPassword', 'resetPassword', 'signUp').
 */
function renderAuth(status) {
    let auth = document.getElementById('authentification');
    if (status === 'login') auth.innerHTML = renderLogin()
    if (status === 'forgetPassword') auth.innerHTML = renderForgotPassword()
    if (status === 'resetPassword') auth.innerHTML = renderResetPassword()
    if (status === 'signUp') auth.innerHTML = renderSignUp()
}


/**
 * Renders the sign-up form.
 * @returns {string} The HTML string for the sign-up form.
 */
function renderSignUp() {
    return `
<div class="register">
<div class="logo-container">
<img class="logo" src="../../assets/img/logo2.png">
</div>
<div class="sign-up-container">
<img onclick="initAuthentification('login')" class="arrow-back" src="../../assets/img/backArrow.png">
    <div class="sign-up">
        <h2>Sign up</h2>
        <form onsubmit="registerUser();">
            <input minlength="3" type="text" id="name" name="name" required placeholder="Name">
            <input minlength="3" type="email" id="email" name="email" required placeholder="Email">
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


/**
 * Renders the login form.
 * @returns {string} The HTML string for the login form.
 */
function renderLogin() {
    return `
<div class="register">
<div class="logo-container">
<img class="logo" src="../../assets/img/logo2.png">
</div>
<div class="to-register"><div class="desktop">Not a Join user?</div>
<button class="btn-1" onclick="renderAuth('signUp')"><nobr>Sign up</nobr></button>
</div>
<div class="sign-up-container">
    <div class="sign-up">
        <h2>Log in</h2>
        <form onsubmit="usersLogin(); savePassword()">  
            <input minlength="3" type="email" id="email" name="email" required placeholder="Email">
            <div class="password-btn">
            <input class="password-input" minlength="3"  type="password" oninput="changeImage()" minlength="6" maxlength="20"  id="password" name="password" required placeholder="Password">
            <button type="button" onclick="togglePasswordVisibility()" id="toggleButton"><img src="../../assets/img/lock.png"></button>
            </div>
            <div class="login-option">
            <div class="remember-me">
            <input id="rememberMe" type="checkbox">
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
</div>`}


/**
 * Toggles the password field, when its empty a lock will displayed if not the hidden password is present.
 */
function changeImage() {
    let passwordInput = getId('password');
    if (passwordInput.value.length === 0) {
        toggleButton.disabled = true;
        toggleButton.innerHTML = '<img src="../../assets/img/lock.png">';
    }
    else {
        toggleButton.disabled = false;
        passwordInput.type = "password";
        toggleButton.innerHTML = '<img src="../../assets/img/passwordHide.png">'
    }
}


/**
 * Toggles the visibility of the password input field. When the visibility is toggled on, the password input's type is changed to 'text', 
 * and when it is toggled off, the type is changed back to 'password'. This also updates the image on the toggleButton to reflect the current state.
 */
function togglePasswordVisibility() {
    let passwordInput = document.getElementById("password");
    let toggleButton = document.getElementById("toggleButton");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.innerHTML = '<img src="../../assets/img/passwordShow.png">'
    } else {
        passwordInput.type = "password";
        toggleButton.innerHTML = '<img src="../../assets/img/passwordHide.png">'
    }
}


/**
 * If the 'Remember Me' checkbox is checked, this function saves the password currently entered in the password input field to local storage.
 */
function savePassword() {
    let rememberMeCheckbox = document.getElementById("rememberMe");
    if (rememberMeCheckbox.checked) {
        let passwordInput = document.getElementById("password");
        let password = passwordInput.value;
        localStorage.setItem("savedPassword", password);
    }
}


/**
 * Renders the forget password form.
 * @returns {string} The HTML string for the forget password form.
 */
function renderForgotPassword() {
    return `
    <div class="forget-password-popup d-none" id="forgetPasswordPopup">
    <div class="forget-password-message">
    <img src="../../assets/img/sendCheck.png">
    <div>An E-Mail has been sent to you</div>    
    </div>
    </div>
    <div class="register">
    <div class="logo-container">
    <img class="logo" src="../../assets/img/logo2.png">
    </div>
    <div class="forgot-password-container">
        <img onclick="initAuthentification('login')" class="arrow-back" src="../../assets/img/backArrow.png">
        <div class="forgot-password">
            <h2>I forgot my password</h2>
            <div class="be-happy"> Don't worry! We will send you an email with the instructions to reset your password.
            </div>
            <form onsubmit="forgotPassword(event)">
                <input minlength="3" type="email" id="email" name="email" required placeholder="Email">
                <div class="menu-btn color-white">
                    <button class="btn-1" type="submit"><nobr>Send me the email</nobr></button>
                </div>
            </form>
        </div>
    </div>
</div>
` }


/**
 * Renders the reset password form.
 * @returns {string} The HTML string for the reset password form.
 */
function renderResetPassword() {
    return `
    <div class="register">
    <div>
    <div class="logo-container">
    <img class="logo" src="../../assets/img/login/logo.png">
    </div>
    <div class="forgot-password-container">
        <img onclick="initAuthentification('login')" class="arrow-back" src="../../assets/img/backArrow.png">
        <div class="reset-password">
            <h2>Reset your password</h2>
            <div> Change your account password
            </div>
            <form onsubmit="createUser(event)">
                <input type="password" minlength="6" maxlength="20" id="password" name="Password" required placeholder="Password">
                <input type="password" minlength="6" id="passwordValidation" name="passwordValidaton" required
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


/**
 * Opens the send mail popup for password recovery.
 */
function openSendMail() {
    let sendMail = getId('forgetPasswordPopup')
    sendMail.classList.remove('d-none')
    setTimeout(() => {
        sendMail.classList.add('d-none')
    }, 2000);
}


/**
 * Opens the summary when a not registerd user wants to test the website.
 */
function loginAsGuest() {
    window.open('/../../main/01summary/summary.html');
}


/**
 * Registers a new user.
 * @param {Event} event - The event object from the form submission.
 */
function registerUser() {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    passwordValidation();
    if (!isUserRegistered(email, registeredUsers)) {
        registeredUsers.push({ 'name': name, 'email': email, 'password': password });
        addUsers();
        renderAuth('login');
    }
    else {closeContainerInTime(2500, 'alreadyRegistered');}
};


/**
 * Checks if a user is already registered.
 * @param {String} email - The email address of the user.
 * @param {Array} registeredUsers - The array of registered users.
 * @returns {Boolean} - Returns true if the user is registered, false otherwise.
 */
function isUserRegistered(email, registeredUsers) {
    return registeredUsers.some(user => user.email === email);
}


/**
 * Validates the username during user registration.
 */
function passwordValidation() {
    for (let i = 0; i < registeredUsers.length; i++) {
        if (registerUser.value == registeredUsers[i]['email']) {
            closeContainerInTime(2500, 'alreadyExist');
            return;
        }
    }
}


/**
 * Adds the registered users to the backend storage.
 * @param {Event} event - The event object from the form submission.
 * @returns {Promise<void>} A Promise that resolves when the users are added to the backend.
 */
async function addUsers() { //check async: no diff
    if (event) event.preventDefault();
    let registerdUsersAsText = JSON.stringify(registeredUsers);
    await backend.setItem('registeredUsers', registerdUsersAsText);
}


/**
 * Loads the registered users from the backend storage.
 * @param {Event} event - The event object from the form submission.
 */
function loadRegisterdUsers() {
    if (event) event.preventDefault();
    let registeredUsersAsText = backend.getItem('registeredUsers');
    if (registeredUsersAsText) registeredUsers = JSON.parse(registeredUsersAsText);
}


/**
 * Logs in the user.
 */
function usersLogin() {
    event.preventDefault();
    checkLogin();
}


/**
 * Checks the login credentials like password and email and fowards to the summary side of the user.
 */
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
    closeContainerInTime(2500, 'passwordIncorrect');     
}


/**
 * Sends a forgot password request.
 * @param {Event} event - The event object from the form submission.
 */
async function forgotPassword(event) {
    event.preventDefault();
    const email = getId('email').value;
    const user = registeredUsers.find(user => user.email === email);
    if (isUserRegistered(email, registeredUsers)) {
        const token = generateRandomToken();
        user.resetToken = token;
        try {
            await sendForgotPasswordEmail(email, token);
            openSendMail();
        } catch (error) {           
            closeContainerInTime(2500, 'tryLater');           
        }
    } else closeContainerInTime(2500, 'notRegistered');        
};


/**
 * Sends a forgot password email.
 * @param {string} email - The email address of the user.
 * @param {string} token - The reset token for password recovery.
 * @returns {Promise<void>} A Promise that resolves when the email is sent successfully.
 */
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


/**
 * Generates a random token for password recovery.
 * @returns {string} The generated random token.
 */
function generateRandomToken() {
    const tokenLength = 20;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < tokenLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}




