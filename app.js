const express = require('express');
const app = express();
const morgan = require('morgan');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.listen(3000, ()=>{
    console.log('Listening to request on port 3000....')
});

app.use(express.static('public folder'));
app.use(morgan('dev'));

app.get('/', (req, res)=>{
    res.render('./pages/index', {title: 'Home', stylesheets: ['index.css']});
})
app.get('/login', (req, res)=>{
    res.render('./pages/loginPage', {title : 'Login', stylesheets : ['loginPage.css']})
})
app.post('/login', (req, res)=>{
    
})