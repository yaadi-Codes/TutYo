"use strict";

//Global Variable Declarations
const form = document.querySelector(".container-form");
const actionInput = document.getElementById("formAction");
const registerFields = document.querySelectorAll(".registerInput");
const loginFields = document.querySelectorAll(".loginInput");
const submissionButton = document.getElementById("submitBtn");
const switchModeLink = document.querySelector(".switchModeLink");
const switchModeText = document.getElementById("switchModeText")
const formTitle = document.getElementById("formTitle");
const userType = document.getElementById("userType");
let formMode = form.getAttribute("data-mode");


//function to toggle the login and register forms. Later called within an eventlistener to implement functionality
function toggleForm() {
    clearAllErrorMessages(); // Clear error messages when switching modes
    formMode = formMode  === "login" ? "register" : "login";
    form.setAttribute("data-mode", formMode);

    // Toggle visibility of login and register fields
    loginFields.forEach((input) => {
        input.classList.toggle("hideInputOptions");
    });
    registerFields.forEach((input) => {
        input.classList.toggle("hideInputOptions");
    });
    userType.classList.toggle("hideInputOptions");

    // Update action input and UI texts based on new mode
    if (formMode === "login") {
        actionInput.value = "login";

        formTitle.innerText = "Login";
        submissionButton.innerText = "Login";

        switchModeText.textContent = "Don't have an account? ";
        const registerLink = document.createElement("a");
        registerLink.className = "switchModeLink";
        registerLink.href = "#";
        registerLink.textContent = "Sign up";
        switchModeText.appendChild(registerLink);
    } else {
        actionInput.value = "register";

        formTitle.innerText = "Register";
        submissionButton.innerText = "Register";

        switchModeText.textContent = "Already have an account? ";
        const signInLink = document.createElement("a");
        signInLink.className = "switchModeLink";
        signInLink.href = "#";
        signInLink.textContent = "Sign in";
        switchModeText.appendChild(signInLink);
    }
}

//Event listener to switch the toggle the form mode between register and login(default)
switchModeText.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("switchModeLink")) {
        e.preventDefault();
        toggleForm();
        toggleActiveFields(); 
    }
});

//Form Validation Section 
//Variables used going forward'
const rememberMe = document.querySelector('input[name="rememberMe"]');
const errorMsg = document.getElementById('formError'); 
let errors = form.querySelectorAll(".error");

function hideAllErrorMessages() {
    errors.forEach((error) => {
        error.classList.add("hide"); //Hide all error messages initially
    });
};
function showAllErrorMessages() {
    errors.forEach((error) => {
        error.classList.remove("hide"); //Show all error messages
    });
};
function clearAllErrorMessages() {
    errors.forEach((error) => {
        error.textContent = ""; //Clear the text content of all error messages  
        error.classList.add("hide"); //Hide the error messages
    })
};
function setError(errorElement, message) {
    errorElement.textContent = message;
}

//if any input field is focused, hide the error messages
form.addEventListener("focusin", (e) => {
    const input = e.target;
    const textInputTypes = ["text", "email", "password"];
    if (
        input.tagName === "INPUT" &&
        textInputTypes.includes(input.type)
    ) {
        hideAllErrorMessages();
    }
});
/**
 * Function goes through the related input fields, ie. loginFields or registerFields based on formMode,
 * These are validated based on predefined logic 
 * should any fail the validation process an error will be triggered and displayed
 * 
 * Mainly used to validate before form submission
 * 
 * @global formMode - stores form current mode, whether 'login' or 'register'
 * @returns {boolean} isValid
 */
function validateForm() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernamePattern = /^[a-zA-Z0-9_-]{3,20}$/;
  const namePattern = /^[a-zA-Z]+(?:[-\s][a-zA-Z]+)*$/;
  const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  let isValid = true;
  clearAllErrorMessages();//Once this function is called, all error messages must be cleared to make space for possible new errors

  if (formMode === 'login') {
    const userOrEmail = document.querySelector('input[name="userOrEmail"]');
    const password = document.querySelector('input[name="password"]');

    const userOrEmailErrMsg = document.getElementById('usernameOrEmailError');
    const passwordErrMsg = document.getElementById('loginPasswordError');

    if (userOrEmail.value.trim() === "") {
      setError(userOrEmailErrMsg, "Username or Email is required.");
      isValid = false;
    }

    if (password.value.trim() === "") {
      setError(passwordErrMsg, "Password is required.");
      isValid = false;
    }

    if (!isValid) {
      errorMsg.textContent = "Some fields are missing or invalid. Please check your input.";
      showAllErrorMessages();
    }
    return isValid;
  }else if(formMode === 'register') {
    const firstName = document.querySelector('input[name="firstName"]');
    const lastName = document.querySelector('input[name="lastName"]');
    const username = document.querySelector('input[name="username"]');
    const email = document.querySelector('input[name="email"]');
    const setPassword = document.querySelector('input[name="setPassword"]');
    const confirmPassword = document.querySelector('input[name="confirmPassword"]');
    const userType = document.querySelector('input[name="userType"]:checked');

    // Errors
    const fNameError = document.getElementById('fNameError');
    const lNameError = document.getElementById('lNameError');
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('registerPasswordError');
    const userTypeError = document.getElementById('userTypeError');

    // First name
    if (firstName.value.trim() === "") {
      setError(fNameError, "First name is required.");
      isValid = false;
    } else if (!namePattern.test(firstName.value.trim())) {
      setError(fNameError, "Enter a valid first name.");
      isValid = false;
    }

    // Last name
    if (lastName.value.trim() === "") {
      setError(lNameError, "Last name is required.");
      isValid = false;
    } else if (!namePattern.test(lastName.value.trim())) {
      setError(lNameError, "Enter a valid last name.");
      isValid = false;
    }

    // Username
    if (username.value.trim() === "") {
      setError(usernameError, "Username is required.");
      isValid = false;
    } else if (!usernamePattern.test(username.value.trim())) {
      setError(usernameError, "Username must be 3–20 characters (letters, numbers, underscores).");
      isValid = false;
    }

    // Email
    //ToDo: Use HunterIo API to check if email is valid in the email registry. ie. if it actually exist
    if (email.value.trim() === "") {
      setError(emailError, "Email is required.");
      isValid = false;
    } else if (!emailPattern.test(email.value.trim())) {
      setError(emailError, "Enter a valid email address.");
      isValid = false;
    }

    // Password
    if (setPassword.value.trim() === "") {
      setError(setPassword, passwordError, "Password is required.");
      isValid = false;
    } else if (!strongPasswordPattern.test(setPassword.value)) {
      setError(passwordError, "Password must include uppercase, lowercase, number, and symbol.");
      isValid = false;
    }

    // Confirm password
    if (confirmPassword.value.trim() === "") {
      setError(confirmPassword, passwordError, "Please confirm your password.");
      isValid = false;
    } else if (setPassword.value !== confirmPassword.value) {
      setError(passwordError, "Passwords do not match.");
      isValid = false;
    }

    // User type
    if (!userType || userType.value === "none") {
      userTypeError.textContent = "Please select your user type.";
      isValid = false;
    }

    if (!isValid) {
      errorMsg.textContent = "Some fields are missing or invalid. Please check your input.";
      showAllErrorMessages();
    }

    return isValid;
  }
}
/**
 * Function to toggle the active fields based on the form mode
 * if the mode is in register mode, then the loginFields should be disabled
 * if the mode is in login mode, then the registerFields should be disabled
 * 
 * @global formMode -- is a variable that stores the current mode a form is in, whether 'login' or 'register'
 * @returns {Array} activeFields
*/
function toggleActiveFields() {
    const toDisable = formMode === 'login' ? registerFields : loginFields;
    const toEnable = formMode === 'register'?  registerFields : loginFields;

    toDisable.forEach((input) => {
        input.disabled = true; //Disable the fields that are not needed
    });
    toEnable.forEach((input) =>{
        input.disabled = false; //Enable the fields that are needed
    });

    //collect the data from the form manually
    const activeFields = [...toEnable];
    return activeFields;
}

/**  Function to handle the form submission
 * This function will collect the data from the form and send it to the server for processing 
 * If the user is verified to exist via backend logic then the response from the server will contain 
 * necessary information on the user along with a token
 * Should the user had selected to be remembered, then the token will be stored on the localStorage
 * which will be used in a later function to auto-log them in.
 * successful login will be redirected to the user dashboard.
*/
async function handleFormSubmission() {
    let activeFields = toggleActiveFields(); //Toggle the active fields based on the form mode
    const formDataObject = {};
    activeFields.forEach((input) => {
        formDataObject[input.name] = input.value;
    });
    const userType = document.querySelector('input[name="userType"]:checked');
    formDataObject['userType'] = userType?.value || "none"; //Get the user type if selected, otherwise default to "none"
    formDataObject["action"] = formMode;
    let isRememberMeChecked = rememberMe.checked
    let responseData;
    const jsonFormData = JSON.stringify(formDataObject); //Convert the object to JSON
    
    //Send the data to the server using fetch API where 
    //the server will handle the login or registration after receiving the data
    //ToDo: Make the following code into an async function awaiting the response from the server before proceeding
    console.log("Form Data to be sent:", jsonFormData); //For debugging purposes
    try{
      const response = await fetch('/loginOrRegister', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: jsonFormData
      })
      
      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }
      responseData = await response.json();
      //Expected responseData Structure:
        //result: success,
        //message: 'Login Successful',
        //token: token,
        //user: {
          //  id: user._id,
          //  username: user.username,
        //}  
      console.log("Response from server:", responseData); //For debugging purposes
        
      /*if the response is okay, were going to store the response in a variable
      **we will then check if the user chose to be remembered, if they were we will store the user data in localStorage
      **if not we store in the sessionStorage
      */
        if (isRememberMeChecked) {
          localStorage.setItem('auth_token', responseData.token);
          localStorage.setItem('username', responseData.user.username);
          localStorage.setItem('user_id', responseData.user.id);
        } else {
          sessionStorage.setItem('auth_token', responseData.token);
          sessionStorage.setItem('username', user.username);
          sessionStorage.setItem('user_id', responseData.user.id);
        }
        
        //furthermore, I need to send a module to another js file for headerFunctionality, so allow the user to navigate to homepage and dashboard since they logged in
        //we can make this module be a boolean variable called isLoggedIn and store it into the localStorage too

        //Update, instead of a module, we'll store a value in session storage that notes if user is logged in

  }catch(error) {
        console.error('There was a problem with the fetch operation:', error);
  };
  return responseData;
}

async function handleFailure() {
  // Clear both localStorage and sessionStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('username');
  localStorage.removeItem('user_id');

  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('user_id');
}
//ToDo: Handle the form submission and send the data to the server for backend processing
/**
 * This function listens for the form's submission, it runs the following commands:
 * -validateForm() - which returns a boolean value stating is validation checks were passed
 * - if validation checks were passed then asynchronous function handleFormSubmission() is called
 *   this returns an object which stores the server's response to a login/registration attempt
 * - if the responseData is not null then we set a session variable called isLoggedIn to 'yes', else 'no'
 */
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (validateForm()) {
      let responseData = await handleFormSubmission();
      if (responseData) {
        sessionStorage.setItem('isLoggedIn', 'yes');
        window.location.href = '/loggedIn';
      } else {
          handleFailure();
          sessionStorage.setItem('isLoggedIn', 'no');
      }
    }
});

/** 
 * The function below is used to automate a login process should the client had selected remember
 * me option upon lost login. If this is successful the user will be redirected to their dashboard
 * However, should this fail the localStorage and sessionStorage Variables will be cleared.
 * 
*
* @type {boolean} autoLoginAttempted-- tracks if auto-login attempt has already been made
*/
//let autoLoginAttempted = false;
if (window.location.pathname === '/loginOrRegister' /*&& !autoLoginAttempted*/){
  window.addEventListener('DOMContentLoaded', () => {
    //autoLoginAttempted = true;
    sessionStorage.setItem('isLoggedIn', 'no');
    (async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          await handleFailure();
          return;
        }

        const response = await fetch('/auto-login', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok && data.result === 'success') {
          console.log('Auto-login successful:', data);//Debugger
          sessionStorage.setItem('isLoggedIn', 'yes');
          window.location.href = '/loggedIn';
        } else {
          await handleFailure();
        }
      } catch (error) {
        console.error('Unhandled error in auto-login:', error);
        await handleFailure();
      }
    })();
});
}




//TODO:
//2. Handle the response from the server and show appropriate messages to the user --Halfway done
//6. Implement the logout functionality to clear the user data from localStorage and redirect to the login page
//9. If user choose to use google, microsoft or apple to login, we will need to implement the OAuth2.0 flow
