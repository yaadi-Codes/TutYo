const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const morgan = require('morgan');
const { connectToDb, getDb } = require('./db');
const jwt = require('jsonwebtoken');
/* const cookieParser = require('cookie-parser'); */
require('dotenv').config();

let db;
//connect to the database
(async () => {
    try {
        await connectToDb();
        db = getDb();
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
        console.log('Connected to the database');//Debugger
    }catch (err) {
        console.error('Failed to connect to the database', err);
        process.exit(1); 
    }
})();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/', (req, res)=>{
    res.render('./pages/index', {title: 'Home', stylesheets: ['index.css']});
})
app.get('/auto-login', (req, res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Extract token from the Authorization header
    if (!token) {
        return res.status(401).json({ result: 'fail', message: 'No token provided' });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({
            result: 'success',
            message: 'Auto-login successful',
            user: decoded
        });

    }catch(err){
        console.error('Error during auto-login:', err);
        return res.status(500).json({ result: 'fail', message: 'Internal server error' });
    }
});
app.get('/loginOrRegister', (req, res)=>{
    res.render('./pages/loginPage', {title : 'Login', stylesheets : ['loginPage.css']})
})
//Logic to handle the login or registration form submission
//This is a placeholder for the actual logic that will handle the login or registration
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
app.post('/loginOrRegister', async (req, res)=>{
    const MAX_ATTEMPTS = 5;

    try{
        const action = req.body.action; //This will be either 'login' or 'register'
        let collection = db.collection('login_data');

        switch(action.toLowerCase()){
            case 'login':
                const identifier = req.body.userOrEmail.toLowerCase().trim();
                const identifierType = emailPattern.test(identifier) ? 'email' : 'username';
                console.log(`Identifier Type: ${identifierType}, Identifier: ${identifier}`);//Debugger
                const password = req.body.password;

                const user = await collection.findOne({[identifierType]: identifier});
                
                if(!user) {
                    return res.status(404).json({ result: 'fail', message: 'User not found' });
                }
                console.log(user);//Debugger
                //check to see if user account is locked 
                if(user.isLocked)return res.status(403).json({result: 'fail', message: 'Account is locked.'});
                
                //if account is not locked we'll proceed to verify password
                //should the password be incorrect we'll track the errors 
                //should an incorrect password be entered 5 times in succession 
                //the account will be closed. Else if password is correct we'll 
                //set the counter to 0
                let loginAttempt = parseInt(user.failedLoginAttempt);//store current amount of failed attempts

                try {
                    const ispasswordValid = await bcrypt.compare(password, user.password);
                    //If the password is valid, we will return a success response
                    //If the password is invalid, we will return an error response
                    if(!ispasswordValid){
                        loginAttempt++;
                        if(loginAttempt >= MAX_ATTEMPTS){
                            await collection.updateOne({[identifierType]: identifier}, {$set: {isLocked: true}});
                            return res.status(403).json({result: 'fail', message: 'Account is locked.'});
                        }
                        await collection.updateOne({[identifierType]: identifier}, {$set: {failedLoginAttempt: loginAttempt}});
                        return res.status(401).json({ result: 'fail', message: 'Invalid password' });

                    }
                    //else
                    loginAttempt = 0;
                    await collection.updateOne({[identifierType]: identifier}, {$set: {failedLoginAttempt: loginAttempt}});
                    const token = jwt.sign(
                        {
                            id: user._id,
                            username: user.username,
                            firstName: user.firstName,
                            lastName: user.lastName,         
                            email: user.email                
                        },
                        process.env.JWT_SECRET,
                    )
                    /* res.cookie('auth_token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                        sameSite: 'Strict', // Prevent CSRF attacks
                    }) */
                   console.log(user);//Debugger
                    return res.status(200).json({
                        result: 'success',
                        message: 'Login Successful',
                        token: token,
                        user: {
                            id: user._id,
                            username: user.username,
                        }    
                    });
                } catch (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).json({ result: 'fail', message: 'Internal server error' });
                }
                break;
            case 'register':
                //Code to handle registration logic
                const data = req.body;
                let registeredPassword = data.setPassword;
                //deleting the keys that won't be stored in the database
                ['setPassword', 'confirmPassword', 'action'].forEach(key => delete data[key]);

                //check if the user already exists in db
                const userExists = await collection.findOne({ email:data.email.toLowerCase().trim() });
                if(userExists) {
                    return res.status(409).json({ result: 'fail', message: 'User already exists' });
                }

                //hash the password before storing it if user does not exist
                try{
                    const hashedPassword = await bcrypt.hash(registeredPassword, 12);
                    data.password = hashedPassword; //Store the hashed password
                    data.failedLoginAttempt = 0;
                }catch(err){
                        console.error('Error hashing password:', err);
                        return res.status(500).json({ result: 'fail', message: 'Internal server error' });
                };
                try{
                    const result = await collection.insertOne(data);
                    console.log('User registered successfully:', result);
                    return res.status(201).json({
                        result: 'success',
                        message: 'User registered successfully',
                        user: {
                            name: data.name,
                            email: data.email,
                            id: result.insertedId
                        }
                    });
                }catch(err){
                    console.error('Error inserting user into database:', err);
                    return res.status(500).json({ result: 'fail', message: 'Internal server error' });
                }
        }
    }catch(err){
        console.error('Error processing login or registration:', err);
        return res.status(500).json({ result: 'fail', message: 'Internal server error' });  
    }
})
app.get('/loggedIn', (req, res) =>{
    res.redirect('/dashboard');
});
app.get('/dashboard', (req, res)=>{
    res.render('./pages/Dashboard', {title: 'Dashboard', stylesheets: []});
})
/* app.get('/erd', (req, res)=>{
    //This is a placeholder for the actual logic that will handle the dashboard
    //We will render the dashboard page with the user data
    res.render('./pages/dashboard', {title: 'Dashboard', stylesheets: ['dashboard.css']});
}) */
//ToDo: PW B3iOmNipONcIqRgr
