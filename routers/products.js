const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      cb(null, fileName + '-' + Date.now());
    }
  })
  
  const uploadOptions = multer({ storage: storage })

//make API requests POST, PUT, GET, DELETE
router.get(`/`, async (req, res) => {
    const productList = await Product.find();
    //selecting specific columns to be displayed with the _id included by default
    const newProductList = await Product.find().select('name image');

    //selecting specific columns to be displayed but excluding the default _id column
    const anotherProductList = await Product.find().select('name image -_id');

    if(!productList) {
        res.status(500).json({success:false})
    }
    res.send(productList);
});

router.get(`/:id`,  async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if(!product) {
        res.status(500).json({success:false})
    }
    res.send(product);
});

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category');
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richdescription: req.body.richdescription,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });
    product = await product.save();
    if (!product)
    return res.status(500).send('The product cannot be created');

    res.status(200).send(product);
});

router.put('/:id', async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id');
    }
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category');
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richdescription: req.body.richdescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured

        },
        {new: true}
    )
    if(!product)
    return res.status(404).send('The Product cannot be updated!')

    res.send(category);
});

router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(
        product =>{
            if(product) {
                return res.status(200).json({
                    success: true,
                    message: 'The Product is deleted!'
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'The Product was not found!'
                })
            }
        }).catch(err=> {
            return res.status(400).json({
                success: false,
                error: err
            })
        });

});

//get product count for statistical purpose
router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments((count) => count)

    if(!productCount) {
        res.status(500).json({success:false})
    }
    res.send({
        productCount: productCount
    });
});

//get featured products that will display on the homepage
router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({isFeatured: true}).limit(+count);

    if(!products) {
        res.status(500).json({success:false});
    }
    res.send(products);
});

//get products by category using query parameters
router.get(`/`, async (req, res) => {
   let filter = {};
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')};
    }
    const products = await Product.find(filter);

    if(!products) {
        res.status(500).json({success:false});
    }
    res.send(products);
});

module.exports = router;
// End of make API Requests