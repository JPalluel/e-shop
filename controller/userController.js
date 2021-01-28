const User = require('../model/user');//contain instance of user model 
const bcrypt = require('bcryptjs'); // package that encrypts the password

//userController  constains a function that will allow to create a new user when request is made (this function is called in router)  
const usersController={  
    addUsers : async (req,res) => {  
        console.log(req.body)  
        const user = new User(req.body);
        if(req.session.user){
            res.render("index", {
                message: "You're already connected"
            })
        }   
        try{
            if(req.body.password === req.body.passwordRepeat){
            await user.save();
            req.session.user = user.userName; // set session with username
            console.log(req.session)
            res.render("index", {
                message: "Welcome",
                userName : user.userName
            }) 
        }else{
            res.render("register", {
                message: "Passwords don't match"
            })
                
            }
        }catch (err) {
            if(err.code === 11000) //meaning if user already registered inside the db
            res.render('index', {
                message: "You are already registered"
            })
        }  
    },
    modifyCredentials : async (req,res) =>{
        console.log(req.body);
        const oldUserName = { userName : req.body.userName};
        try{
            if(req.body.password != req.body.passwordRepeat){
                res.render("modify-credentials",{
                   errorMessage : " Passwords don't match"
                })
            }
            const newPassword = await bcrypt.hash(req.body.newPassword,8);// hash the pwd, run the function 8 times ( good balance between security and efficiency)
            const modifiedCredentials = await User.findOneAndUpdate(oldUserName, {$set: {userName : req.body.newUserName, password: newPassword}} , {new :true});
            console.log("new user : " + modifiedCredentials);
            req.session.user = modifiedCredentials.userName;
            res.render("my-account", {
            message : "Credentials successfully modified!"
        })
    }catch(err){
        console.log(err)
        res.render("my-account",{
            message: "An error occured"
        })
    }

},
    logUser :  async(req, res) =>{
        if(req.session.user){
            res.render("index", {
                message: "You're already connected"
            })
        }   
        try{
            const user = await User.findByCredentials(req.body.userName, req.body.password);
            console.log(user.userName + " connected!")
    
            if(user){ // set  a session with the userName
                req.session.user = user.userName;
                console.log(req.session)
                res.render("index", {
                message : "Welcome",
                userName: user.userName})
            
            }
        }catch(err){
        console.log(err, "an error occured");
        res.render("signIn", {
            errorMessage : "Wrong credentials, Try Again"
        })
        }
    }
}


//exports it so it can be used inside the router
module.exports = usersController;  
