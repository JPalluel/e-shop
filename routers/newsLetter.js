const express =  require('express');  
const router = new express.Router();
const newsLetter = require('../model/newsletter')

router.post('/newsLetter', async (req, res)=>{
    try {
        console.log(req.body.email)
        const newMember = new newsLetter({
            email: req.body.email
        })
        await newMember.save();
        res.render('index', { 
            message: "You successfully registered to our Newsletter!" });
    } catch (e) {
        if(e.code === 11000) // meaning if email exists already inside the db
        res.render('index', {
            message: "You are already registered!"
        })
    }
})



module.exports = router;