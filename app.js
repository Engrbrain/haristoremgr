const express = require('express')
const app = express();
const bodyParser = require('body-parser');
require('dotenv/config');
const api = process.env.API_URL;
const morgan = require('morgan');
const mongoose = require('mongoose');


//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
//End of middleware

//connect to database
mongoose.connect(process.env.CONNECTION_STRING, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        dbName: 'haristore'
    }).then(()=> {
    console.log('Database Connection is ready...');
}).catch((err)=> {
    console.log(err);
})
// End of Connect to Database



//Create database model for product

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

//End of create database models

//make API requests POST, PUT, GET, DELETE
app.get(`${api}/products`, async (req, res) => {
    const productList = await Product.find();

    if(!productList) {
        res.status(500).json({success:false})
    }
    res.send(productList);
});

app.post(`${api}/products`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    });
    product.save().then((createdProduct =>{
        res.status(201).json(createdProduct)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    })
    
});

// End of make API Requests

// Setup Node Server
app.listen(3000, () => {
    //console.log(api);
     console.log('Server is running http://localhost:3000');
});
// End of Setup Node Server