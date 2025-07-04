const router = require('express').Router();
const passport = require('passport');

//auth logins
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

/* router.get('/microsoft', (req, res)=>{
    res.send('logging in with microsoft'); //Debugger
});

router.get('/apple', (req, res)=>{
    res.send('logging in with apple'); //Debugger
});
 */
router.get('/google/redirect', passport.authenticate('google'), (req, res)=>{
    console.log('callback function fired');
})

module.exports = router;