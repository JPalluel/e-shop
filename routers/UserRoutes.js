const express =  require('express');  
const router = new express.Router();
const usersController = require('../controller/userController');

//routes used for user management
router.get('/signIn', (req,res) =>{
     res.render("signIn")
 })

 router.get('/register',(req, res)=>{
    res.render("register")
})

//addUsers function will be called from the controller when request come for this route, create a session aswell when registered 
 router.post('/register', usersController.addUsers) ;


// signIn and create a session
router.post('/signIn', usersController.logUser);



router.get("/my-account", isLoggedIn, (req,res) =>{    
    res.render("my-account");    
})

router.get("/modify-credentials", isLoggedIn, (req,res) =>{
    res.render("modify-credentials")
})

router.post("/modify-credentials", usersController.modifyCredentials);

router.get('/logOut', isLoggedIn, (req, res) =>{
    req.session.destroy((err) =>{
        res.redirect ("/home");
    })
})


// //creation of a middleware to check if User connected to access certain pages
function isLoggedIn (req, res, next){
    if(req.session.user){
        return next();
    }
    res.render("signIn", {
        errorMessage: "You need to Sign up to access this page"
    })
}

 module.exports = router; 
