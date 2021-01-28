const express =  require('express');  
const router = new express.Router();
const Product = require('../model/product')

router.get('/shop', (req,res) =>{
    if(!req.query.search){
    Product.find(function(err, products){
        res.render("shop", { products : products})
    })
//Search bar
    }else {
        const productName = (req.query.search).toLowerCase(); // as it's a form with GET method, the req.query.search will refers to the input inside the form
        console.log(productName)
        Product.find({name: productName}, function (err, product){
            if (err){
                return res.render('index',{
                    message: "An error occured"
                })
            }
            if(product.length <= 0){ //so  if no match in the research
                return res.render('shop',{
                    message : "Product not found"
                })
            }
            res.render('shop', {products: product})
        })
    }
})

module.exports = router;