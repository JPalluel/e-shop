const express =  require('express');  
const router = new express.Router();

// No prior connexion needed to access this pages
router.get('',(req, res)=>{
    res.render("index");
});

router.get('/home', (req,res )=> {
    res.render("index")
})

router.get('/about', (req,res) =>{
    console.log(req.session)
    res.render("about")
})

router.get('/contact-us', (req,res) =>{
    console.log(req.session)
    res.render("contact-us")
})
router.get('/gallery', (req,res) =>{
    console.log(req.session)
    res.render("gallery")
})

router.get('/wishlist', (req,res) =>{
    res.render("wishlist")
})

router.get('/shop-detail', (req,res) =>{
    res.render("shop-detail")
})

module.exports = router;