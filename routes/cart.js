const express = require('express');
const router = express.Router();

const cartServices = require('../services/cart');

router.get('/', async function(req,res){
    let userId = req.session.user.id;
    let cartItems = await cartServices.getShoppingCart(userId);
    res.render('cart/index', {
        'cartItems': cartItems.toJSON()
    })
})

router.get('/:product_id/add', async function(req,res){
    let userId = req.session.user.id;
    let productId = req.params.product_id;

    let status  = await cartServices.addItemToCart(userId, productId);
    if (status) {
        req.flash("success_messages", "Item successfully added to cart");
        res.redirect('/products') 
    } else {
        req.flash('error_messages', "Failed to add item to shopping cart");
    }  
})

module.exports = router;