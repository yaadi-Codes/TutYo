const express = require('express');
const app = express();
const morgan = require('morgan');
const passportSetup = require('./config/passport-setup');
const authRoutes = require('./routes/auth-routes');
const loginAndRegisterRoutes = require('./routes/regular-login-routes');
const session = require('express-session');
const { connectToDb, getDb, closeConnection } = require('./databaseFiles/db');
const passport = require('passport');

//environmental variables configured
require('dotenv').config();

/**
 * App attempts to connect to the database first thing
 * should it succeed, the app starts to listen to server request
 * an instance of the db is retrieved and stored in db variable
 * this instance is of the Users collection in mongoDb;
 */
let db;
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

app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

app.use(session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 24 * 3600 * 1000,
        secure: false
    }
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//authentication routes configured
app.use('/auth', authRoutes);

//login And Registration Routes
app.use(loginAndRegisterRoutes);

//index page (placeholder)
app.get('/', (req, res)=>{
    res.render('./pages/index', {title: 'Home', stylesheets: ['index.css']});
})

app.get('/loggedIn', (req, res) =>{
    res.redirect('/dashboard');
});

app.get('/dashboard', (req, res)=>{
    res.render('./pages/Dashboard', {title: 'Dashboard', stylesheets: []});
})

process.on('SIGINT', async () => {
    console.log('\nSIGINT received, closing DB connection...');
    await closeConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nSIGTERM received, closing DB connection...');
    await closeConnection();
    process.exit(0);
});