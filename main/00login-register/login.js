
document.querySelector('form')?.addEventListener('submit', function (event) {
    event.preventDefault();

});


async function initAuthentification() { await renderAuth('login') }


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
<img src="/assets/img/login/logo.png">
<div class="sign-up-container">
<img onclick="initAuthentification('login')" class="arrow-back" src="/assets/img/login/arrow-left-line.png">
    <div class="sign-up">
        <h2>Sign up</h2>
        <form onsubmit="createUser(event)">
            <input type="text" id="name" name="name" required placeholder="Name">
            <input type="email" id="email" name="email" required placeholder="Email">
            <input type="password" id="password" name="Password" required placeholder="Password">
                       <div class="menu-btn">
                <button type="submit"><nobr>Sign up</nobr></button>
                <button onclick="renderAuth('login')">Back</button>
            </div>
        </form>
    </div>
</div>
</div>
</div>` }


function renderLogin() {
    return `
<div class="register">
<img src="/assets/img/login/logo.png">
<div class="to-register">Not a Join user?
<button onclick="renderAuth('signUp')"><nobr>Sign up</nobr></button>
</div>
<div class="sign-up-container">
    <div class="sign-up">
        <h2>Log in</h2>
        <form onsubmit="createUser(event)">  
            <input type="email" id="email" name="email" required placeholder="Email">
            <input type="password" id="Password" name="Password" required placeholder="Password">
            <div class="login-option">
            <div class="remember-me">
            <input type="checkbox">
            <nobr>Remember me</nobr>
            </div>
            <a class="highlight-blue" onclick="renderAuth('forgetPassword')">
            <nobr>Forgot my password</nobr></a>
            </div>
            <div class="menu-btn">
                <button type="submit">Log in</button>
                <button><nobr>Guest Log in</nobr></button>
            </div>            
        </form>
    </div>
</div>
</div>
</div>` }

function renderForgotPassword() {
    return `
    <div class="register">
    <img src="/assets/img/login/logo.png">
    <div class="forgot-password-container">
        <img onclick="initAuthentification('login')" class="arrow-back" src="/assets/img/login/arrow-left-line.png">
        <div class="forgot-password">
            <h2>I forgot my password</h2>
            <div> Don't worry! We will send you an email with the instructions to reset your password.
            </div>
            <form onsubmit="createUser(event)">
                <input type="email" id="email" name="email" required placeholder="Email">
                <div class="menu-btn color-white">
                    <button type="submit"><nobr>Send me the email</nobr></button>
                </div>
            </form>
        </div>
    </div>
</div>
` }

function renderResetPassword() {
    return `
    <div class="register">
    <img src="/assets/img/login/logo.png">
    <div class="forgot-password-container">
        <img onclick="initAuthentification('login')" class="arrow-back" src="/assets/img/login/arrow-left-line.png">
        <div class="reset-password">
            <h2>Reset your password</h2>
            <div> Change your account password
            </div>
            <form onsubmit="createUser(event)">
                <input type="password" id="password" name="Password" required placeholder="Password">
                <input type="password" id="passwordValidation" name="PasswordValidaton" required
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



function cretateUser() { };
function rememberUser() { };
function forgetPassword() { };
function registerUser() { };
function resetPassword() { };
function guestLogin() { };