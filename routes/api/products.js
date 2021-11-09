const express = require('express');
const router = express.Router();

const productDataLayer = require('../../dal/products');

router.get('/', async function(req,res){
    let products = await productDataLayer.getAllProducts();
    res.json({
        products,
        // 'products':products
    })
})

module.exports = router;