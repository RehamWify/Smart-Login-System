// Selectors
const userNameInput = document.querySelector("#userName");
const userEmailInput = document.querySelector("#userEmail");
const userPassInput = document.querySelector("#userPass");
const signEmailInput = document.querySelector("#signEmail");
const signPassInput = document.querySelector("#signPass");

const signupBtn = document.querySelector("#signupBtn");
const signinBtn = document.querySelector("#signinBtn");

// Users array from localStorage
let users = [];
if (localStorage.getItem("usersList")) {
    users = JSON.parse(localStorage.getItem("usersList"));
}

// Event listeners
if (signupBtn) {
    signupBtn.addEventListener("click", function (e) {
        e.preventDefault();
        handleSignup();
    });
}

if (signinBtn) {
    signinBtn.addEventListener("click", function (e) {
        e.preventDefault();
        handleSignin();
    });
}

// Signup handler
function handleSignup() {
    clearMessages();
    if (checkIsEmpty()) {
        displayRequired();
        return;
    }
    if (!validateName(userNameInput.value)) {
        displayCustom("#required", "Invalid name format", "danger");
        return;
    }
    if (!validateEmail(userEmailInput.value)) {
        displayCustom("#required", "Invalid email format", "danger");
        return;
    }
    if (!validatePassword(userPassInput.value)) {
        displayCustom("#required", "Password must be at least 6 characters", "danger");
        return;
    }
    if (exist(userEmailInput.value)) {
        displayExist();
        return;
    }
    const user = {
        name: userNameInput.value.trim().toLowerCase(),
        email: userEmailInput.value.trim().toLowerCase(),
        password: userPassInput.value.trim().toLowerCase(),
    };
    users.push(user);
    localStorage.setItem("usersList", JSON.stringify(users));
    displaySucess();
    clearForm();
    // Store email and password for transfer to index.html
    setTimeout(() => {
        location.replace("index.html");
    }, 2000);

}

// Signin handler
function handleSignin() {
    clearMessages();
    if (checkIsEmptySign()) {
        displayRequiredSign();
        return;
    }
    const user = users.find(
        u => u.email === signEmailInput.value.trim().toLowerCase() && u.password === signPassInput.value.trim().toLowerCase()
    );
    if (user) {
        localStorage.setItem("homeList", JSON.stringify(user.name));
        location.replace("home.html");
    } else {
        displayIncorrect();
    }
}

// Utility functions
function exist(email) {
    return users.some(u => u.email === email);
}

function checkIsEmpty() {
    return !userNameInput.value || !userEmailInput.value || !userPassInput.value;
}

function checkIsEmptySign() {
    return !signEmailInput.value || !signPassInput.value;
}

function clearForm() {
    userNameInput.value = "";
    userEmailInput.value = "";
    userPassInput.value = "";
}

function clearMessages() {
    const required = document.querySelector("#required");
    const resultSign = document.querySelector("#result-sign");
    if (required) required.innerHTML = "";
    if (resultSign) resultSign.innerHTML = "";
}

// Display functions
function displayRequired() {
    displayCustom("#required", "All inputs are required", "danger");
}
function displayExist() {
    displayCustom("#required", "Email already exists", "danger");
}
function displayIncorrect() {
    displayCustom("#result-sign", "Incorrect email or password", "danger");
}
function displayRequiredSign() {
    displayCustom("#result-sign", "All inputs are required", "danger");
}
function displaySucess() {
    displayCustom("#required", "Success", "success");
}
function displayCustom(selector, message, type) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = `<span class='text-${type}'>${message}</span>`;
}

// Validation functions
function validateName(name){
    // Name must be 3-20 characters, letters and spaces only
    const nameRegex = /^[A-Za-z ]{3,10}[0-9]{0,4}$/;
    return nameRegex.test(name);
}

function validateEmail(email) {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
}
function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        return false;
    }
    return password.length >= 6;
}

// Welcome message (for home.html)
function welcome() {
    const name = JSON.parse(localStorage.getItem("homeList"));
    document.querySelector("#welcome").innerHTML = `Welcome ${name}`;
}

if (window.location.pathname.endsWith("home.html")) {
    window.onload = welcome;
}
