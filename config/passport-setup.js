const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const { getDb } = require('../databaseFiles/db'); 


passport.serializeUser((user, cb)=>{
    cb(null, user._id);
})

passport.deserializeUser(async (id, cb)=>{
    try{
        const db = getDb();
        const user = await db.collection('login_data').findOne({_id: id});
        cb(null, id);
    }
    catch(err){
        cb(err, null);
    }
    
})

//config google strategy 
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CB_URL
  },
  async (accessToken, refreshToken, profile, cb) => {
    console.log(JSON.stringify(profile, null, 2));
    try {
        const db = getDb(); // ✅ Get db after connection is established
        const collection = db.collection('login_data');

        const googleId = profile.id;

        let user = await collection.findOne({ googleId });

        if (!user) {
            const email = profile.emails?.[0]?.value;

            const data = {
            googleId,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            username: profile.displayName,
            email,
            loginType: 'google',
            };

            const result = await collection.insertOne(data);
            user = { ...data, _id: result.insertedId };
        }
        
        return cb(null, user)
    } catch (err) {
    console.error('Error in GoogleStrategy:', err);
    return cb(err, null);
    }
}));

/* passport.use(new MicrosoftStrategy(
    {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: process.env.MICROSOFT_CB_URL,

    },
    (accessToken, refreshToken, profile, cb)=>{

    })
);

passport.use(new AppleStrategy(
    {
        clientID: process.env.APPLE_CLIENT_ID,
        clientSecret: process.env.APPLE_CLIENT_SECRET,
        callbackURL: process.env.APPLE_CB_URL,

    },
    (accessToken, refreshToken, profile, cb)=>{

    })
); */


