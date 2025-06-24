const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const morgan = require('morgan');
const { connectToDb, getDb } = require('./db');


let db;
//connect to the database
connectToDb((err)=>{
    if (err){
        console.error('Failed to connect to the database', err);
        return;
    }
    console.log('Connected to the database');
    app.listen(3000, () =>{
        console.log('Server is running on port 3000...')
    }),
    db = getDb();

})

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/', (req, res)=>{
    res.render('./pages/index', {title: 'Home', stylesheets: ['index.css']});
})
app.get('/loginOrRegister', (req, res)=>{
    res.render('./pages/loginPage', {title : 'Login', stylesheets : ['loginPage.css']})
})
//Logic to handle the login or registration form submission
//This is a placeholder for the actual logic that will handle the login or registration
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
app.post('/loginOrRegister', async (req, res)=>{
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

                try {
                    const ispasswordValid = await bcrypt.compare(password, user.password);
                    //If the password is valid, we will return a success response
                    //If the password is invalid, we will return an error response
                    if(!ispasswordValid) return res.status(401).json({ result: 'fail', message: 'Invalid password' });
                    //else
                    return res.status(200).json({
                        result: 'success',
                        message: 'Login successful',
                        user: {
                            name: user.name,
                            email: user.email,
                            id: user._id
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

//ToDo: 