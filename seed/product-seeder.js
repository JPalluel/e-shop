const Product = require('../model/product');
const mongoose  = require('mongoose');
// Database seeding is the initial seeding of a database with data. Seeding a database is a process 
//in which an initial set of data is provided to a database when it is being installed.
// We need to run this file once to upload the products inside our db

const urlDb = process.env.DB_URL;
const db = mongoose.connection;
db.once('open', _ =>{
    console.log("Connected to db", urlDb)
});
db.on('error', err =>{
    console.log("Connection error", err)
});

mongoose.connect(urlDb,{useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex:true})


const products = [
    new Product ({
        name: "carrots",
        image : "images/img-pro-01.jpg",
        price : 1.20
    }),
    new Product ({
        name: "tomatoes",
        image : "images/img-pro-02.jpg",
        price: 2.59
    }),
    new Product ({
        name: "grapes",
        image : "images/img-pro-03.jpg",
        price: 3.79
    }),
    new Product({
        name: "strawberries",
        image : "images/instagram-img-08.jpg",
        price : 1.59
    }),
    new Product({
        name: "lentils",
        image : "images/gallery-img-04.jpg",
        price: 2.23
    }),
    new Product({
        name: "cucumber",
        image : "images/gallery-img-01.jpg",
        price: 1.15
    }),
    new Product({
        name: "pepper",
        image : "images/gallery-img-03.jpg",
        price: 2.35
    }),
    new Product({
        name: "cherries",
        image : "images/instagram-img-05.jpg",
        price: 4.34
    }),
    new Product({
        name: "lemon",
        image : "images/instagram-img-04.jpg",
        price: 2.40
    }),
    new Product({
        name: "orange",
        image : "images/instagram-img-06.jpg",
        price: 2.55
    })
]

let done = 0;

for (let i = 0 ; i < products.length; i++){
    products[i].save(function (err, result){
        done ++;
        if(done === products.length){
            exit()
        }
    })
}

function exit () {
    mongoose.disconnect
}