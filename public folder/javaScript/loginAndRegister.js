"use strict";
const form = document.querySelector(".container-form");
const actionInput = document.getElementById("formAction");
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
    form.classList.toggle("loginMode");
    form.classList.toggle("registerMode");
    
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

    if(form.classList.contains("loginMode")){
        actionInput.value = "login";//Set the value of the action input to "login"
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
        actionInput.value = "register";//Set the value of the action input to "register"
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
};

//ToDo: Handle the form submission and send the data to the server for backend processing
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const loggingIn = form.classList.contains("loginMode");
    const mode = loggingIn ? "login" : "register";

    //Based on the mode, enable and disable the appropriate fields
    const toDisable = loggingIn ? registerFields : loginFields;
    const toEnable = loggingIn ? loginFields : registerFields;

    toDisable.forEach((input) => {
        input.disabled = true; //Disable the fields that are not needed
    });
    toEnable.forEach((input) =>{
        input.disabled = false; //Enable the fields that are needed
    })

    //collect the data from the form manually
    const formData = new FormData(form);
    formData.append("action", mode); //Append the mode value to the form data
    
    //Store the data in an object so that it can be converted to JSON
    const formDataObject = {};

    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });
    const jsonFormData = JSON.stringify(formDataObject); //Convert the object to JSON
    //Send the data to the server using fetch API where 
    //the server will handle the login or registration after receiving the data
    //ToDo: Make the following code into an async function awaiting the response from the server before proceeding
    fetch('/loginOrRegister', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonFormData
    })
    //This was experimental, but it works, just fix up the logic later
    .then(res => {
        //if the response is okay, were going to store the response in a variable
        //we will then check if the user chose to be remembered, if they were we will store the user data in localStorage
        //and redirect the user to the home page
        //the response should also be stored in localStorage until the user logs out or close their browser/tab if they chose not to be remembered
        //furthermore, I need to send a module to another js file for headerFunctionality, so allow the user to navigate to homepage and dashboard since they logged in
        //we can make this module be a boolean variable called isLoggedIn and store it into the localStorage too

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    })
    .then(data => {
        console.log('Success:', data);
        //You can handle the response data here, like redirecting the user or showing a success message
        if (data.message) {
            alert(data.message); //Show a success message
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

//TODO:
//1. Add validation to the form fields before submission
//2. Handle the response from the server and show appropriate messages to the user
//3. Implement the backend logic to handle login and registration
//4. Store the user data in localStorage if the user chose to be remembered
//5. Redirect the user to the home page or dashboard after successful login or registration
//6. Implement the logout functionality to clear the user data from localStorage and redirect to the login page
//7. Add error handling for the form submission
//8. Implement the logic to check if the user is already logged in and redirect them to the dashboard or home page
//9. If user chose to use google, microsoft or apple to login, we will need to implement the OAuth2.0 flow