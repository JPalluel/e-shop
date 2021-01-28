const express = require('express');
const path = require("path") //The path module provides utilities for working with file and directory paths. 
const app = express();
require ('dotenv').config();
const mongoose = require('mongoose');
const urlDb = process.env.DB_URL;
const port = process.env.PORT || 3000 

//define Path for front

const publicPath = path.join(__dirname,"./public"); 
const partialsPath = path.join(__dirname, './partials')
const viewsPath = path.join(__dirname, "./views")

//connecting to database  
mongoose.connect(urlDb,{useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false})
const db = mongoose.connection;
db.once('open', _ =>{
    console.log("Connected to db", urlDb)
})
db.on('error', err =>{
    console.log("Connection error", err)
})

// Set up views and hbs
const hbs = require('hbs');
app.set("view engine", "hbs");
app.set("views", viewsPath)
hbs.registerPartials(partialsPath);
app.use(express.static(publicPath)); //static directory to serve


//fetch form data from the request => body-parser extract data from the <form> element and add them to the body property in the request object
const bodyParser = require('body-parser') //makes it easier to get at the information contained in client requests
app.use(bodyParser.urlencoded({extended:false}));


// Setting up the session
const session = require('express-session');  
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);//store the session inside db
app.use(cookieParser());
app.use(session({
    secret :'mysecret',
    saveUninitialized: false,
    resave:false,
    store: new MongoStore({mongooseConnection: db}),
     cookie : {
         maxAge: 8*60*60*1000,// 8hours, set in milliseconds
         secure: false
        }
    }))

//set intermediate data on res.locals in your middleware, and that data will be available in your view
app.use(function(req, res, next){
    res.locals.login = req.session.user; //this set up a variable that returns true or false. the Login var  will be available on the views=> used in header to modify the links log in/log out
    res.locals.session = req.session; // Session will be accessible in views
    res.locals.user = req.session.user// userName accessible in views => see header
    next();
})

//Setting up the routes
const UserRoutes = require ('./routers/UserRoutes');
const cartRoutes = require('./routers/cartRoutes');
const searchBardRoutes = require('./routers/searchBarRoutes');
const newsLetterRouters= require('./routers/newsLetter');
const generalRoutes = require('./routers/generalRoutes');
app.use(UserRoutes);
app.use(cartRoutes);
app.use(searchBardRoutes);
app.use(newsLetterRouters);
app.use(generalRoutes);
//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send('Page not found...');
  });

app.listen( port, () =>{
    console.log(`server is running on port  ${port}`)
});


