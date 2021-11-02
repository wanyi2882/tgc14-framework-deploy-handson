const express = require('express');
const router = express.Router();

// #1 require in the Product model
const { Product} = require('../models')

router.get('/', async function(req,res){
    // the model represents the entire table
    let products = await Product.collection().fetch();
    res.render('products/index', {
        'products': products.toJSON() // convert the results to JSON
    })
})

module.exports = router;