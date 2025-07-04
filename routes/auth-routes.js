const router = require('express').Router();
const passport = require('passport');

// Start Google OAuth login
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

// Reserved routes for Microsoft and Apple (currently stubbed for future use)
/*
router.get('/microsoft', (req, res) => {
    res.send('logging in with microsoft'); // Debugger
});

router.get('/apple', (req, res) => {
    res.send('logging in with apple'); // Debugger
});
*/

// Google OAuth callback route
router.get('/google/redirect', passport.authenticate('google',{ 
    failureRedirect: '/loginOrRegister?status=access_denied' // On failure, notify frontend
    }), 
    (req, res)=>{
    // On success, redirect to loginOrRegister with a success status
    handleGoogleSuccess(req, res); 
})

function handleGoogleSuccess(req, res) {
  res.redirect('/loginOrRegister?status=access_granted');
}
module.exports = router;