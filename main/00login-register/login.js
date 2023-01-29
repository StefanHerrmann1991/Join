
document.querySelector('form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    // Your code to handle the form submission
  });


async function initAuthentification() { await renderAuth('login') }


function renderAuth(status) {
    let auth = document.getElementById('authentification');
    if (status === 'login') auth.innerHTML = renderLogin()
    if (status === 'forgetPassword') auth.innerHTML = renderForgetPassword()
    if (status === 'resetPassword') auth.innerHTML = renderResetPassword()
    if (status === 'signUp') auth.innerHTML = renderSignUp()
}

function renderSignUp() {
    return `
<div class="register">
<img src="/assets/img/login/logo.png">
<div class="sign-up-container">
    <div class="sign-up">
        <h2>Sign up</h2>
        <form onsubmit="createUser(event)">
            <input type="text" id="name" name="name" required placeholder="Name">
            <input type="email" id="email" name="email" required placeholder="Email">
            <input type="password" id="Password" name="Password" required placeholder="Password">
            <div class="menu-btn">
                <button type="submit">Sign up</button>
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
<button onclick="renderAuth('signUp')">Sign Up</button>
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

function renderForgetPassword() {
    return `
<div class="register">
<img src="/assets/img/login/logo.png">
</div>
<div class="sign-up-container">
    <div class="sign-up">
    <h2>I forgot my password</h2>
    <div> Don't worry! We will send you an email with the instructions to reset your password. 
    </div>
        <form onsubmit="createUser(event)">  
            <input type="email" id="email" name="email" required placeholder="Email">
            <nobr>Forgot my password</nobr></a>
            </div>
            <div class="menu-btn">
                <button type="submit">Send me the email</button>          
            </div>            
        </form>
    </div>
</div>
</div>
</div>
` }
function renderResetPassword() {
    return `
<div>

</div>` }

function cretateUser() { };