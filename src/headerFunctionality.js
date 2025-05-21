// This file contains the JavaScript code for the 
// frontend functionality of the header section of the website.

//This section of the file is for the hamburger menu functionality
const hamburgerBar = document.getElementById("hamburgerBar");
const navigationMenu = document.getElementById("navMenu");

// Function to toggle the hamburger menu
hamburgerBar.addEventListener("click", showHamburgerMenu);

// Function to show the hamburger menu
function showHamburgerMenu(){
        hamburgerBar.classList.toggle('close');
        navigationMenu.classList.toggle('show');
}

//Section for header page navigation functionality
const headerPageLinks = document.querySelectorAll(".headerNavLinks");

//Until user has logged in, all header page links will be disabled except for 
//home and about us links
headerPageLinks.forEach(item => {
    item.addEventListener("click", event => {
        if (item.id !== "homeLink" && item.id !== "aboutUsLink") {
            event.preventDefault();
            item.classList.add("disabled");
        }
    });
});

//import isLogin from "src/login.js and store in a variable
//let isLogin = import("src/login.js");
//This should be stored in the browsers local storage and reset when the user logs out or closes the browser
//This will be done in the login.js file

//For now, we will assume that the user is not logged in
//and set isLogin to false. This will be replaced with the
//actual login check later

let isLogin = false;
updateHeaderLinks(isLogin);
//Let's create a fucntion what will be called to update the isLogin variable
//this function will be called from the login.js file when the user logs in and out

function updateHeaderLinks(isLogin){
    this.isLogin = isLogin;
    if(!isLogin){
        document.getElementById("profileLink").classList.add("disabled");
        document.getElementById("dashboardLink").classList.add("disabled");
    }else{
        document.getElementById("profileLink").classList.remove("disabled");
        document.getElementById("dashboardLink").classList.remove("disabled");
    }
}

//Section to handle logo click functionality
const logo = document.getElementById("logo");
// Function to redirect to the home page when the logo is clicked
logo.addEventListener("click", () => {
    window.location.href = "index.html";
});



