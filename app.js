const express = require('express');
const app = express();
const morgan = require('morgan');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.listen(3000, ()=>{
    console.log('Listening to request on port 3000....')
});

app.use(express.json());
app.use(express.static('public folder'));
app.use(morgan('dev'));

app.get('/', (req, res)=>{
    res.render('./pages/index', {title: 'Home', stylesheets: ['index.css']});
})
app.get('/loginOrRegister', (req, res)=>{
    res.render('./pages/loginPage', {title : 'Login', stylesheets : ['loginPage.css']})
})
//Logic to handle the login or registration form submission
//This is a placeholder for the actual logic that will handle the login or registration
app.post('/loginOrRegister', (req, res)=>{
    //ToDo: Handle the login or registration logic here
    //Note the content of the req is the action stating if it is a login or registration
    //and the data that was submitted in the form
    //We will need to check the action, based on that we will do verification checks on the data

    const action = req.body.action; //This will be either 'login' or 'register'
    switch(action) {
        case 'login':
            //Code to handle login logic
            //For example, check if the user exists in the database and if the password is correct
            break;
        case 'register':
            //Code to handle registration logic
            //For example, check if the user already exists, validate the data, and then save the user to the database

            break;
        default:
            return res.status(400).json({error: 'Invalid action'});
    }
/*     console.log(req.body);
    res.json({
        message: 'Data received successfully',
        data: req.body
    }); */
})