const loginForm = document.querySelector(".container-form");
const registerFields = document.querySelectorAll(".registerInput");
const loginFields = document.querySelectorAll(".loginInput");
const submissionButton = document.getElementById("submitBtn");
const switchModeLink = document.querySelector(".switchModeLink");
const switchModeText = document.getElementById("switchModeText")
const formTitle = document.getElementById("formTitle");
const userType = document.getElementById("userType");

switchModeText.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("switchModeLink")) {
        e.preventDefault();
        toggleForm();
    }
});
//function to toggle the login and register forms
function toggleForm(){
    //Switch to mode
    loginForm.classList.toggle("loginMode");
    loginForm.classList.toggle("registerMode");
    
    //all elements with the class of loginInput will add the class of hideInputOptions
    //and all elements with the class of registerInput will remove the class of hideInputOptions
    //vice versa
    loginFields.forEach((input) => {
        input.classList.toggle("hideInputOptions");
    })
    registerFields.forEach((input) => {
        input.classList.toggle("hideInputOptions");
    })
    userType.classList.toggle("hideInputOptions");

    if(loginForm.classList.contains("loginMode")){
        //Change the title of the form and button to say "Login"
        formTitle.innerText = "Login";
        submissionButton.innerText = "Login";
        //Change the text of the link to say "Don't have an account? Register"
        switchModeText.textContent = "Don't have an account? ";
        const registerLink = document.createElement("a");
        registerLink.className = "switchModeLink";
        registerLink.href = "#";
        registerLink.textContent = "Sign up";
        switchModeText.appendChild(registerLink);
    } else {
        //Change the title of the form and button to say "Register"
        formTitle.innerText = "Register";
        submissionButton.innerText = "Register";
        //Change the text of the link to say "Already have an account? Sign in"
        switchModeText.textContent = "Already have an account? ";
        const signInLink = document.createElement("a");
        signInLink.className = "switchModeLink";
        signInLink.href = "#";
        signInLink.textContent = "Sign in";
        switchModeText.appendChild(signInLink);  
    }
}


