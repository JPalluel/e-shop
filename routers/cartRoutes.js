const express =  require('express');  
const router = new express.Router();
const Cart = require ('../model/cart');
const Product = require('../model/product')

//routes for gestion of the cart

//Add to cart
router.get('/add-to-cart/:id', (req, res, next) =>{
    console.log(req.session)
    console.log(req.params.id)
    const productId = req.params.id;
    
    // create a new cart each time we add a new item, passing the old cart as parameter in order to keep it 
    //ternary expression: check inside the session if cart property exists, if true, pass the old cart if false create a new empty cart object
    const cart = new Cart (req.session.cart ? req.session.cart : {});

    //check inside db if the product requested exists, then with the cb function, add the product inside the cart
    // the productId comes from the req => /:id
    Product.findById(productId, function (err, product){
        if(err){
            return res.render('index' ,{
                message : " Error with cart"
            });
        }
        cart.add(product, product.id);
        req.session.cart = cart //store the cart inside my session
        console.log(cart);
        console.log(cart.items)
        res.redirect('/shop')
    });
})

//remove an item
router.get('/reduce/:id', (req, res, next) =>{
    const productId = req.params.id;
    const cart = new Cart (req.session.cart ? req.session.cart : {});
    
    cart.removeOne(productId);
    req.session.cart = cart;
    res.redirect('/cart')
})

//remove all items
router.get('/removeAll/:id', (req, res, next) =>{
    const productId = req.params.id;
    const cart = new Cart (req.session.cart ? req.session.cart : {});
    
    cart.removeAll(productId);
    req.session.cart = cart;
    res.redirect('/cart')
})

//accessing the cart view
router.get("/cart",isLoggedIn, (req, res)=>{
    //console.log(req.session.cart);
    if (!req.session.cart){
       return  res.render('cart', {products : null})
    }
    const cart = new Cart(req.session.cart);
    
    res.render('cart', { products : cart.generateArray(), totalPrice : (cart.totalPrice), grandTotal : Math.floor((cart.totalPrice + 2)*100)/100 })
})

//accesing the checkout view
router.get("/checkout", isLoggedIn,(req,res) =>{
    if(!req.session.cart){
        return res.render("checkout", {products: null})
    }
    const cart = new Cart(req.session.cart);
    console.log(cart)
    res.render('checkout', { products : cart.generateArray(), totalPrice : (cart.totalPrice), grandTotal : Math.floor((cart.totalPrice+2)*100)/100})
})

//creation of a middleware to check if User connected to access this page
function isLoggedIn (req, res, next){
    if(req.session.user){
        return next();
    }
    res.render("signIn", {
        errorMessage: "You need to Sign up to access this page"
    })
}

module.exports = router;