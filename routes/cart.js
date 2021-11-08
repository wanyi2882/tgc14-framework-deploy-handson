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
        res.redirect('/products');
    } else {
        req.flash('error_messages', "Failed to add item to shopping cart");
        res.redirect('/products');
    }  
})

router.post('/:product_id/quantity/update', async function(req,res){
    let status = await cartServices.updateQuantityInCart(req.session.user.id,
                                            req.params.product_id,
                                            req.body.newQuantity
                                            );
    if (status) {
        req.flash("success_messages", "Product quantity has been updated");
    } else {
        req.flash("error_messages", "Failed to update product quantity");
    }

    res.redirect('/cart');
});

router.post('/:product_id/delete', async function(req,res){
    let status  = await cartServices.removeFromCart(req.session.user.id, req.params.product_id);
    if (status) {
        req.flash("success_messages", "Item has been removed from cart");
    } else {
        req.flash("error_messges", "Failed to remove from cart")
    }
    res.redirect('/cart');
})
    

module.exports = router;