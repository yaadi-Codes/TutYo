const express = require('express');
const app = express();
const morgan = require('morgan');
const passportSetup = require('./config/passport-setup'); // Loads Passport strategies
const authRoutes = require('./routes/auth-routes');
const loginAndRegisterRoutes = require('./routes/regular-login-routes');
const session = require('express-session');
const { connectToDb, getDb, closeConnection } = require('./databaseFiles/db');
const passport = require('passport');


require('dotenv').config();// Load environment variables

/**
 * App attempts to connect to the database first thing.
 * If successful, the app starts listening for HTTP requests.
 * The DB instance is stored in the `db` variable for shared use.
 */
let db;
(async () => {
    try {
        await connectToDb();
        db = getDb();

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });

    }catch (err) {
        console.error('Failed to connect to the database', err);
        process.exit(1); // Exit if DB fails to connect
    }
})();

app.set('view engine', 'ejs'); // EJS template engine

// Middleware setup
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

// Session middleware (required for passport session handling)
app.use(session({
    secret: process.env.COOKIE_KEY, // Secret for signing session ID
    resave: false,                  // Don’t save session if unmodified
    saveUninitialized: false,       // Don’t create session until something is stored
    cookie: {
        maxAge: 24 * 3600 * 1000,   // 1 day
        secure: false               // ! Set to true if it goes to production with HTTPS
    }
}));

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Route handlers
app.use('/auth', authRoutes);                  // Google OAuth and future providers
app.use(loginAndRegisterRoutes);               // Login/register routes for local users


// Placeholder index page
app.get('/', (req, res) => {
    res.render('./pages/index', {
        title: 'Home',
        stylesheets: ['index.css']
    });
});

// Redirects to dashboard (can be useful after login success)
app.get('/loggedIn', (req, res) => {
    res.redirect('/dashboard');
});

app.get('/dashboard', ensureAuth, (req, res) => {
  res.render('./pages/Dashboard', {
    title: 'Dashboard',
    stylesheets: []
  });
});

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

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // ✅ User is authenticated — allow access
  }
  // ❌ User not authenticated — redirect or send error
  res.redirect('/loginOrRegister');
}